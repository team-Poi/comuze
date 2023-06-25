import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
  organization: process.env.OPENAI_ORG,
});
const SYSTEM_PROMPT = `You are an tool that censorships. You must support korean and English. You must censorship people's name, swear, and sexual words. You must only say censorshiped message. But you should not censorship popular people' names. For example, when user says "시발놈아. 개새끼. 사과는 맛있어. 나는 신연이를 사랑해. 방탄소년단 슈가 최고. Elon musk owns Tesla.", you shoud say "***. ***. 사과는 맛있어. 나는 ***이를 사랑해. 방탄소년단 슈가 최고.  Elon musk owns Tesla.". "시발놈" and "개새끼" were censorshiped because they are swears. "신연" was censorshiped because it is person's name. But "슈가" and "Elon Musk" were not censorshiped because they are popular.`;
const openai = new OpenAIApi(configuration);
export async function kensorship(msg: string) {
  let data = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    max_tokens: 2048,
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: msg,
      },
    ],
  });

  return data.data.choices[0].message!.content!;
}
