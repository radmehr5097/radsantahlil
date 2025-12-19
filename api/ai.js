export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query, systemPrompt } = req.body;

  const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-3-flash:generateContent?key=" +
  API_KEY;
  try {
    const payload = {
      contents: [{ parts: [{ text: query }]}],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
