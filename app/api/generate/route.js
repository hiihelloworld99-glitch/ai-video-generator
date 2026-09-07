import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const output = await replicate.run(
      "minimax/video-01",
      {
        input: {
          prompt: prompt,
        }
      }
    );

    const videoUrl = typeof output === 'string' ? output : (output?.url || String(output));

    return NextResponse.json({ videoUrl: videoUrl });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
