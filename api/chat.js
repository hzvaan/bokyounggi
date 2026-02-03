// api/chat.js
export default async function handler(req, res) {
  const { message, systemInstruction } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY; // 서버에 저장된 키를 가져옵니다.

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AIzaSyBGrfaZL6d5Wt6LjInaWK3g5JVPOd2oUoI}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `시스템: ${systemInstruction}\n사용자: ${message}` }] }]
      })
    });

    const data = await response.json();
    const botResponse = data.candidates[0].content.parts[0].text;
    
    res.status(200).json({ text: botResponse });
  } catch (error) {
    res.status(500).json({ error: "연기가 꼬였어욥!" });
  }
}
