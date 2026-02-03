import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 가능해영!' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API 키가 설정되지 않았어영!" });
  }

  try {
    const { message, systemInstruction } = req.body;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 💡 해결 포인트: 모델명을 "gemini-1.5-flash-latest"로 지정합니다.
    // 이 명칭은 구글 API v1beta 환경에서 가장 인식이 잘 됩니다.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest" 
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }],
      systemInstruction: systemInstruction,
    });

    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini API 상세 에러:", error);
    // 404 에러가 발생할 경우를 대비해 더 친절한 에러 메시지를 띄웁니다.
    return res.status(500).json({ error: `복영기가 잠시 자리를 비웠어영! (${error.message})` });
  }
}
