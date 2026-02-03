import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 가능해영!' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "API 키가 설정되지 않았어영!" });
  }

  try {
    const { message, systemInstruction } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 핵심 수정: 모델 이름 앞에 'models/'를 명시적으로 붙였습니다.
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-1.5-flash"
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API 상세 에러:", error);
    return res.status(500).json({ error: error.message });
  }
}
