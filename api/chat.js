// api/chat.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

export default async function handler(req, res) {
  // 1. POST 요청인지 확인 (보안)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, systemInstruction } = req.body;

  // 2. 환경변수에 저장된 API KEY 불러오기
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    // 3. 모델 설정 (시스템 프롬프트 주입)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction, // 복영기 페르소나 주입
    });

    // 4. 답변 생성
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    // 5. 결과 반환
    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: "연기가 꼬였어영! 잠시 후 다시 시도해주세영." });
  }
}
