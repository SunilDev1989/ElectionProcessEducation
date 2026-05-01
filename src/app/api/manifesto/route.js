import { NextResponse } from 'next/server';


export async function POST(req) {
  try {
    const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
    const { manifestoText, modelId = "gemini-3.1-flash-lite-preview" } = await req.json();

    if (!manifestoText || manifestoText.trim().length < 50) {
      return NextResponse.json({ error: "Please provide a substantial portion of the manifesto to analyze." }, { status: 400 });
    }
    
    const prompt = `
      You are an expert, strict, and neutral political analyst fact-checker. 
      Your ONLY job is to analyze excerpts from political party election manifestos or answer civic policy queries.

      TASK:
      If the user provides a manifesto excerpt OR asks a political policy query (e.g., "Key Promises of BJP 2026"):
      1. Extract or simulate the top 3-5 core promises related to this text/query. 
      2. For each promise, provide a brief, objective analysis of its "Feasibility" (High, Medium, Low) based on typical economic and legislative constraints in India, and explain why in one sentence.
      3. Format the output using clear markdown with bullet points and bold text for readability. Do not include introductory filler.

      User Input to Analyze:
      "${manifestoText.substring(0, 5000)}"
    `;

    // Retry and Fallback Strategy Array
    const modelsToTry = [modelId];
    if (!modelsToTry.includes("gemini-3.1-flash-lite-preview")) modelsToTry.push("gemini-3.1-flash-lite-preview");
    if (!modelsToTry.includes("gemini-2.5-flash")) modelsToTry.push("gemini-2.5-flash");
    if (!modelsToTry.includes("gemma-2-2b-it")) modelsToTry.push("gemma-2-2b-it");

    let analysis = "";
    let finalError = null;

    for (const currentModel of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${API_KEY}`;
        
        let payload = {};
        if (currentModel.includes("gemma")) {
          payload = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
        } else {
          payload = { 
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            tools: [{ googleSearch: {} }]
          };
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(`API Error ${res.status}: ${data.error?.message || JSON.stringify(data)}`);
        }
        if (data.error) throw new Error(data.error.message);
        
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts) {
          analysis = data.candidates[0].content.parts[0].text.trim();
          finalError = null;
          break; // Success!
        } else {
           throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error(`Manifesto API Failed with model ${currentModel}:`, err.message);
        finalError = err;
      }
    }

    if (finalError) throw finalError;

    return NextResponse.json({ analysis });

  } catch (error) {
    console.error("Manifesto API Error:", error);
    
    if (error.message && (error.message.includes("429") || error.message.includes("Quota"))) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait 30 seconds before trying again." }, { status: 429 });
    }
    
    return NextResponse.json({ error: "Failed to analyze manifesto. Please try again." }, { status: 500 });
  }
}
