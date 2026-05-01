import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { modelId = "gemma-3-1b-it", language = "English" } = await req.json();
    const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

    // 1. Fetch live news from NewsData.io
    const newsApiUrl = `https://newsdata.io/api/1/latest?apikey=${process.env.NEWSDATA_API_KEY}&q="Lok Sabha" OR "Election Commission of India" OR "Vidhan Sabha" OR "Indian Elections"&country=in&language=en`;
    
    const newsResponse = await fetch(newsApiUrl);
    const newsData = await newsResponse.json();

    if (newsData.status !== 'success' || !newsData.results) {
      return NextResponse.json({ error: "Failed to fetch live news." }, { status: 500 });
    }

    // Extract top 5 articles for AI analysis
    const topArticles = newsData.results.slice(0, 5);
    const headlines = topArticles.map(a => `- ${a.title}`).join('\n');

    // 2. Cascade AI Sentiment Analysis
    const systemPrompt = `You are an expert political analyst. Review the following live news headlines about the Indian Elections:
    
    ${headlines}
    
    Provide a brief 2-sentence summary of the overall "Voter Sentiment" based solely on these headlines. 
    Format your response with a clear mood indicator (e.g. 🟢 Positive, 🔴 Negative, or 🟡 Neutral) followed by the summary.
    Translate your response to ${language}.`;

    const modelsToTry = [modelId];
    if (!modelsToTry.includes("gemma-2-2b-it")) modelsToTry.push("gemma-2-2b-it");
    if (!modelsToTry.includes("gemini-3.1-flash-lite-preview")) modelsToTry.push("gemini-3.1-flash-lite-preview");
    if (!modelsToTry.includes("gemini-2.5-flash")) modelsToTry.push("gemini-2.5-flash");

    let sentiment = "🟡 Neutral: No significant sentiment detected.";

    for (const currentModel of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${API_KEY}`;
        let payload = {};

        if (currentModel.includes("gemma")) {
          payload = { contents: [{ role: 'user', parts: [{ text: systemPrompt }] }] };
        } else {
          payload = {
            systemInstruction: { parts: [{ text: "You are an expert political analyst. Translate to " + language }] },
            contents: [{ role: 'user', parts: [{ text: systemPrompt }] }]
          };
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        
        if (!res.ok || data.error) {
           throw new Error(data.error?.message || "API Error");
        }
        
        if (data.candidates && data.candidates.length > 0) {
           const parts = data.candidates[0].content?.parts;
           if (parts && parts.length > 0) {
             sentiment = parts[0].text;
             break; // Success
           }
        }
      } catch (err) {
        // Continue to next fallback model
        console.error(`News Sentiment Failed for ${currentModel}:`, err.message);
      }
    }

    return NextResponse.json({
      sentiment: sentiment,
      articles: topArticles.map(a => ({
        title: a.title,
        link: a.link,
        source: a.source_id,
        pubDate: a.pubDate,
        description: a.description || "No description available."
      }))
    });

  } catch (error) {
    console.error("News API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
