import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. 서버가 깨어있는지 확인
  console.log("복영기 서버 작동 시작!");

  try {
    const key = process.env.GEMINI_API_KEY;
    
    // 2. 키 자체가 들어오는지 확인 (보안상 앞 4자리만 로그에 찍음)
    if (!key) {
      return res.status(500).json({ error: "시스템 설정에 API 키가 누락되었습니다. (Vercel 설정 확인 필요)" });
    }
    console.log("키 확인 완료:", key.substring(0, 4) + "****");

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. 아주 간단한 인사만 시켜보기 (데이터 전달 문제인지 확인)
    const result = await model.generateContent("안녕하세요, 1글자로 '네'라고 답해주세요.");
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ 
      success: true, 
      message: "연결 성공!", 
      data: text 
    });

  } catch (err) {
    // 4. 에러의 정체를 낱낱이 밝히기
    console.error("상세 에러:", err);
    return res.status(500).json({ 
      error: "범인 검거 완료!", 
      detail: err.message,
      code: err.status || "알 수 없음"
    });
  }
}
