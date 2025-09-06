import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

const assembly = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_AI_API_KEY,
});

export async function GET(request) {
  try {
    // Use the new Universal-Streaming API to create temporary token
    const token = await assembly.streaming.createTemporaryToken({
      expires_in_seconds: 600, // Token expires in 1 hour
    });
    return NextResponse.json(token);
  } catch (error) {
    console.error("Error creating AssemblyAI token:", error);
    return NextResponse.json(
      { error: "Failed to create streaming token" },
      { status: 500 }
    );
  }
}
