import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // POST 요청이 아니면 거절해영
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API 키 설정이 안 되어 있어영!" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { message, systemInstruction } = req.body;

    // 복영기의 영혼을 불어넣는 대화 생성
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }],
      systemInstruction: systemInstruction,
    });

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("복영기 통신 에러:", error);
    return res.status(500).json({ error: error.message });
  }
}
