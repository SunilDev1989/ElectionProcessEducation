import { NextResponse } from 'next/server';

/**
 * Handles incoming chat requests, processes prompt wrapping security, and executes a resilient model cascade.
 * 
 * @async
 * @function POST
 * @param {Request} req - The standard Next.js API Request object containing the JSON payload.
 * @returns {Promise<NextResponse>} Returns a JSON response containing the AI reply or an error message.
 * @throws {Error} Throws an error if all models in the cascade fail or rate limits are exceeded.
 */
export async function POST(req) {
  try {
    const { messages, modelId = "gemini-3.1-flash-lite-preview", language = "English" } = await req.json();
    const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

    const systemPrompt = `Namaste! You are a Voter Education AI Guide. Your ONLY purpose is to assist Indian citizens with democratic processes, voter registration, EPIC cards, polling timelines, and real-time election results. 
    
    CRITICAL LANGUAGE INSTRUCTION: You MUST communicate entirely and exclusively in ${language}. If the user asks a question, reply in ${language}.

    COMPLIANCE & SECURITY RULES: 
    1. You must explicitly state that you are an educational tool and NOT an official representative of the Election Commission of India. 
    2. When discussing voter registration, ALWAYS provide the official hyperlink: [voters.eci.gov.in](https://voters.eci.gov.in/).
    3. You must NEVER endorse or criticize any political party or candidate. Maintain absolute strict neutrality. 
    4. ABSOLUTE ZERO TOLERANCE FOR NON-ELECTION QUERIES: If a user asks a question that is NOT about elections, voting, politics, or governance (e.g., food recipes like idli, coding, general trivia, movies), YOU MUST REFUSE TO ANSWER. DO NOT perform a Google Search. Reply exactly with: "I am a Voter Education AI. I can only assist you with questions related to the Indian electoral process, voter registration, and civic duties. I cannot answer non-election queries." Translate this refusal into ${language}.
    
    KNOWLEDGE USAGE (LIVE INTERNET & SIMULATION): 
    - For historical elections (e.g., 2024 or earlier) and current events, YOU MUST use LIVE Google Search Grounding to provide factual data.
    - If the user asks about FUTURE elections (e.g., 2026, 2029) or hypothetical scenarios (e.g., "who won Kapadwanj 2026"), DO NOT say you lack information. Instead, act as an AI simulator. Invent a highly detailed, realistic, but fake scenario (including simulated candidate names, margins, and voter turnout). 
    - Always clearly label simulated data with a disclaimer like "[Simulated Scenario]" at the beginning of your response.
    
    Translate your findings or simulations into ${language} before replying.`;

    // We rely purely on Prompt Engineering (Whitelist Prompt Wrapping) to restrict domain.

    // Map messages to Gemini REST format
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Retry and Fallback Strategy
    const modelsToTry = [modelId];
    if (!modelsToTry.includes("gemini-3.1-flash-lite-preview")) modelsToTry.push("gemini-3.1-flash-lite-preview");
    if (!modelsToTry.includes("gemini-2.5-flash")) modelsToTry.push("gemini-2.5-flash");
    if (!modelsToTry.includes("gemma-2-2b-it")) modelsToTry.push("gemma-2-2b-it"); // Highly stable Gemma 2 fallback

    let finalText = "";
    let finalError = null;

    for (const currentModel of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${API_KEY}`;
        
        let payload = {};

        // The Prompt Wrapping Whitelist Instruction
        const strictWhitelistWrap = (userQuery) => `[STRICT DOMAIN EVALUATION]
Analyze the user query below. Does this query explicitly ask about Indian elections, voting processes, political parties, the Election Commission, or civic governance?
If NO, you are FORBIDDEN from answering. You MUST reply EXACTLY with: "I am a Voter Education AI. I can only assist you with questions related to the Indian electoral process, voter registration, and civic duties."
If YES, provide a helpful, neutral answer in ${language}.

[USER QUERY]:
"${userQuery}"`;

        // All models use this simple array structure now for maximum compatibility
        if (currentModel.includes("gemma")) {
          const gemmaMessages = [...formattedMessages];
          if (gemmaMessages.length > 0) {
            // Inject system prompt into the first message
            gemmaMessages[0].parts[0].text = `[SYSTEM INSTRUCTION: ${systemPrompt}]\n\n[USER QUERY: ${gemmaMessages[0].parts[0].text}]`;
            
            // Wrap the very last user message in the Whitelist evaluator
            const lastIndex = gemmaMessages.length - 1;
            gemmaMessages[lastIndex].parts[0].text = strictWhitelistWrap(gemmaMessages[lastIndex].parts[0].text);
          } else {
            gemmaMessages.push({ role: 'user', parts: [{ text: systemPrompt }] });
          }
          payload = { contents: gemmaMessages };
        } else {
          // Use official systemInstruction for Gemini models
          const geminiMessages = [...formattedMessages];
          if (geminiMessages.length > 0) {
             // Wrap the very last user message in the Whitelist evaluator
             const lastIndex = geminiMessages.length - 1;
             geminiMessages[lastIndex].parts[0].text = strictWhitelistWrap(geminiMessages[lastIndex].parts[0].text);
          }
          
          payload = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: geminiMessages
          };
        }

        const attemptFetch = async () => {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          
          if (!res.ok) {
            console.error(`API Error for ${currentModel}:`, data);
            throw new Error(`API Error ${res.status}: ${data.error?.message || JSON.stringify(data)}`);
          }
          if (data.error) throw new Error(data.error.message);
          
          if (!data.candidates || data.candidates.length === 0) {
              console.error(`No candidates returned from API for ${currentModel}:`, data);
              throw new Error("No candidates returned from API");
          }
          
          // Gemma models sometimes return text in a slightly different path depending on the exact version
          const parts = data.candidates[0].content?.parts;
          if (!parts || parts.length === 0) {
             throw new Error("Empty parts returned from API");
          }
          return parts[0].text;
        };

        // Attempt 1
        try {
          finalText = await attemptFetch();
          finalError = null;
          break; // Success!
        } catch (err) {
          const isRateLimitOrOverload = err.message && (err.message.includes("503") || err.message.includes("429") || err.message.toLowerCase().includes("exceeded"));
          
          if (isRateLimitOrOverload) {
            // If we are on the very last fallback model and it STILL hits a limit, 
            // do a final desperate wait (4 seconds) to let the per-minute quota bucket reset.
            if (currentModel === modelsToTry[modelsToTry.length - 1]) {
               await new Promise(resolve => setTimeout(resolve, 4000));
               finalText = await attemptFetch();
               finalError = null;
               break;
            }
            throw err; // Jump to next model in the fallback array
          } else {
            throw err; // Throw non-rate-limit errors to outer catch
          }
        }
      } catch (err) {
        console.error(`Failed with model ${currentModel}:`, err.message);
        finalError = err; // Save error and try next model in fallback array
      }
    }

    if (finalError) throw finalError;

    return NextResponse.json({ reply: finalText });
  } catch (error) {
    console.error("Gemini API Error Detailed:", error);
    
    const errorMessage = error.message || "";
    
    // Auto-discover models if there's a 404
    if (errorMessage.includes("404") || errorMessage.includes("not found")) {
      try {
        const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const modelsData = await modelsRes.json();
        const modelNames = modelsData.models ? modelsData.models.map(m => m.name.replace('models/', '')).join(", ") : "Unknown";
        return NextResponse.json({ 
          error: `⚠️ **Model Error:** ${errorMessage}\n\n**Available Models on your Key:** ${modelNames.substring(0, 1000)}...` 
        }, { status: 404 });
      } catch(e) {
        // Fallback if discovery fails
      }
    }
    
    // Return EXACT error so user can debug
    return NextResponse.json({ 
      error: `⚠️ **API Error:** ${errorMessage}` 
    }, { status: 500 });
  }
}
