import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // CORS 처리 (필요시) 및 POST 메서드 검증
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '메서드가 허용되지 않아영!' });
  }

  try {
    const { message, systemInstruction } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API 키가 설정되지 않았어영!' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction 
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: "연기가 꼬였어영! 다시 시도해주세영." });
  }
}
