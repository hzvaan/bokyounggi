import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 가장 안전하고 표준적인 호출 방식입니다.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    const { message, systemInstruction } = req.body;

    const result = await model.generateContent(message);
    const response = await result.response;
    
    return res.status(200).json({ text: response.text() });
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
