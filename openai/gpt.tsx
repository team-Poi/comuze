import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
  organization: process.env.OPENAI_ORG,
});
const openai = new OpenAIApi(configuration);
export async function chatgpt(msg: string) {
  try {
    let data = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 1.2,
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: msg,
        },
      ],
    });

    console.log(data.data.choices[0].message!.content!);

    return data.data.choices[0].message!.content!;
  } catch (e: any) {
    console.error(e.response.data);
    throw new Error();
  }
}
