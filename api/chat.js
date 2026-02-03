import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. GET 요청 등 엉뚱한 접근 차단
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST 요청만 가능해영!' });
  }

  try {
    // 2. API 키 가져오기
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("API 키가 없어영! Vercel 설정을 확인해주세영.");
    }

    // 3. 모델 준비 (가장 표준적인 이름 사용)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" // models/ 붙이지 말고, latest도 빼세요. 이게 표준입니다.
    });

    // 4. 대화 생성
    const { message, systemInstruction } = req.body;
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: message }] }],
      systemInstruction: systemInstruction, // 시스템 지시사항 추가
    });

    const response = await result.response;
    const text = response.text();

    // 5. 성공 응답
    return res.status(200).json({ text });

  } catch (error) {
    console.error("에러 발생:", error);
    // 에러 내용을 숨기지 않고 형님께 그대로 보여줍니다.
    return res.status(500).json({ 
      error: error.message || "알 수 없는 오류가 났어영 ㅠㅠ" 
    });
  }
}
