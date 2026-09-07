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

    // Minimax मॉडल को रन करना
    const output = await replicate.run(
      "minimax/video-01",
      {
        input: {
          prompt: prompt,
        }
      }
    );

    console.log("Raw Replicate Output:", JSON.stringify(output));

    let videoUrl = "";

    // सभी संभावित फॉर्मेट्स से यूआरएल निकालना
    if (typeof output === 'string') {
      videoUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      videoUrl = output[0];
    } else if (output?.url) {
      videoUrl = typeof output.url === 'string' ? output.url : output.url();
    } else if (typeof output === 'object' && output !== null) {
      // अगर यह ReadableStream या FileOutput ऑब्जेक्ट है
      const values = Object.values(output);
      for (const val of values) {
        if (typeof val === 'string' && val.startsWith('http')) {
          videoUrl = val;
          break;
        }
      }
    }

    if (!videoUrl) {
      videoUrl = String(output);
    }

    return NextResponse.json({ videoUrl: videoUrl });
  } catch (error) {
    console.error("Generation Error:", error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong during generation' },
      { status: 500 }
    );
  }
}
