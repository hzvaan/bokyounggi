export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST만 가능해영' });

  const apiKey = process.env.GEMINI_API_KEY;
  const { message, systemInstruction } = req.body;

  // 구글 공식 API 주소 (v1beta를 떼고 v1으로 시도하거나, 가장 안정적인 주소를 씁니다)
  // 이번에는 모델명을 'gemini-1.5-flash'로 딱 고정해서 직접 찌릅니다.
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemInstruction ? `${systemInstruction}\n\n질문: ${message}` : message }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 800,
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("구글 서버 응답 에러:", data);
      return res.status(response.status).json({ 
        error: "구글 서버가 거절했어영", 
        detail: data.error?.message || "알 수 없는 에러" 
      });
    }

    // 결과값 추출
    const reply = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: reply });

  } catch (error) {
    console.error("네트워크 에러:", error);
    return res.status(500).json({ error: "통신 중 사고가 났어영", detail: error.message });
  }
}
