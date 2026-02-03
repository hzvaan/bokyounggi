export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  const { message, systemInstruction } = req.body;

  // SDK를 쓰지 않고 v1(정식 버전) 주소로 직접 찌릅니다.
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{ text: systemInstruction ? `${systemInstruction}\n\n질문: ${message}` : message }]
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: "구글 응답 에러", 
        detail: data.error?.message || "알 수 없는 오류" 
      });
    }

    return res.status(200).json({ text: data.candidates[0].content.parts[0].text });
  } catch (error) {
    return res.status(500).json({ error: "통신 에러", detail: error.message });
  }
}
