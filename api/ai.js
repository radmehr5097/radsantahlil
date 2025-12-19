export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, systemPrompt } = req.body;

  const API_KEY = process.env.GEMINI_API_KEY;

  const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=" +
    API_KEY;

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt || "" },
              { text: query },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error || "API Error" });
    }

    const output =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    return res.status(200).json({ output });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
