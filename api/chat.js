import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 가능해영!' });
  }

  // API 키 확인
  if (!process.env.GEMINI_API_KEY) {
    console.error("API KEY IS MISSING!");
    return res.status(500).json({ error: "API 키가 설정되지 않았어영!" });
  }

  try {
    const { message, systemInstruction } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 모델 설정 (쉼표와 주석 위치를 수정했습니다)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction 
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API 에러 상세:", error);
    // Vercel 로그에서 확인한 상세 에러를 응답에 포함
    return res.status(500).json({ error: error.message || "연기가 꼬였어영!" });
  }
}
