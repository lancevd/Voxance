"use client";
import axios from "axios";
import OpenAI from "openai";
import { CoachingOptions } from "./Options";

export const getToken = async () => {
  const result = await axios.get("/api/getToken");
  // console.log(result)
  return result.data;
};

async function getAPIKey() {
  result = await axios.get("/api/openAIKey");
  console.log(result.data);
  return result.data;
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export const AIModel = async (topic, coachingOption, msg) => {
  const option = CoachingOptions.find(
    (option) => option.name === coachingOption
  );
  const PROMPT = option.prompt.replace("{user_topic}", topic);
  console.log(PROMPT);

  const completion = await openai.chat.completions.create({
    model: `google/gemini-2.0-flash-exp:free`,
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: msg },
    ],
  });
  console.log(completion.choices[0].message);
};
