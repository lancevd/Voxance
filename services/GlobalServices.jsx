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

// 🔥 ADDED: Rate limiting variables
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests

export const AIModel = async (topic, coachingOption, msg) => {
  // 🔥 ADDED: Simple rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  const option = CoachingOptions.find(
    (option) => option.name === coachingOption
  );
  const PROMPT = option.prompt.replace("{user_topic}", topic);
  //   console.log(PROMPT);

  try {
    lastRequestTime = Date.now(); // 🔥 ADDED: Update last request time

    const completion = await openai.chat.completions.create({
      model: `google/gemini-2.0-flash-exp:free`,
      messages: [
        { role: "system", content: PROMPT },
        { role: "user", content: msg },
      ],
      // 🔥 ADDED: Additional parameters to help with rate limiting
      max_tokens: 150, // Limit response length
      temperature: 0.7,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error("AI Model Error:", error);

    // 🔥 ADDED: Better error handling for rate limits
    if (
      error.status === 429 ||
      error.message.includes("429") ||
      error.message.includes("Too Many Requests")
    ) {
      throw new Error(
        "429: Rate limit exceeded. Please wait before making another request."
      );
    }

    // Re-throw other errors
    throw error;
  }
};
