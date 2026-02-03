import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. 요청 방식 확인
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 허용됩니다.' });
  }

  try {
    const { message, systemInstruction } = req.body;
    
    // 2. 환경변수 확인
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Vercel 설정에서 API 키를 확인해주세요." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 3. 모델 설정 (가장 안정적인 방식)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" 
    });

    // 4. 대화 생성 (최신 문법 적용)
    const chatSession = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 500 }
    });

    // 시스템 지침이 있다면 앞에 붙여서 보냄
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\n사용자 질문: ${message}` : message;
    const result = await chatSession.sendMessage(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });

  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
