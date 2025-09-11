import { NextResponse } from 'next/server';

export function GET (req) {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    return NextResponse.json(apiKey)
}