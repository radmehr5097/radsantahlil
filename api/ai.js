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
            parts: [{ text: query }],
          },
        ],
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
      }),
    });

    const result = await response.json();

    // استخراج متن پاسخ از Gemini
    let output = "پاسخی دریافت نشد.";
    if (
      result &&
      result.candidates &&
      result.candidates[0] &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts[0]
    ) {
      output = result.candidates[0].content.parts[0].text;
    }

    res.status(200).json({ output });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "خطا در ارتباط با مدل Gemini" });
  }
}
