export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  const { message } = req.body;

  // SDK를 쓰지 않고 직접 구글 API 주소로 요청을 보냅니다.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // 구글 서버가 직접 보내는 에러 메시지를 그대로 출력합니다.
      return res.status(response.status).json({ error: data.error.message || "구글 서버 에러" });
    }

    return res.status(200).json({ text: data.candidates[0].content.parts[0].text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
