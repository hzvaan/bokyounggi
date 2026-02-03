import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 가능해영!' });
  }

  // API 키 확인용 로그 (Vercel 로그에서 확인 가능)
  if (!process.env.GEMINI_API_KEY) {
    console.error("API KEY IS MISSING!");
    return res.status(500).json({ error: "API 키가 설정되지 않았어영!" });
  }

  try {
    const { message, systemInstruction } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 모델 설정
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-1.5-flash", // ✅ 앞에 'models/'를 직접 붙여줍니다.
      systemInstruction: systemInstruction 
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API 에러:", error);
    return res.status(500).json({ error: "연기가 꼬였어영! 다시 시도해주세영." });
  }
}
