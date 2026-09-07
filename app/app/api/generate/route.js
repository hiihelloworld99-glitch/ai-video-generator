‎// app/api/generate/route.js
‎import { NextResponse } from 'next/server';
‎import Replicate from 'replicate';
‎
‎// Initialize Replicate client with your secret token
‎const replicate = new Replicate({
‎  auth: process.env.REPLICATE_API_TOKEN,
‎});
‎
‎export async function POST(request) {
‎  try {
‎    const { prompt, aspectRatio = '16:9', duration = '4s' } = await request.json();
‎
‎    if (!prompt || typeof prompt !== 'string') {
‎      return NextResponse.json(
‎        { error: 'Prompt is required and must be a string' },
‎        { status: 400 }
‎      );
‎    }
‎
‎    if (!process.env.REPLICATE_API_TOKEN) {
‎      return NextResponse.json(
‎        {
‎          error: 'REPLICATE_API_TOKEN environment variable is not configured. Add it in your .env.local file.',
‎        },
‎        { status: 500 }
‎      );
‎    }
‎
‎    // Step 1: Trigger the text-to-video prediction
‎    // Popular model: ZeroScope (anotherjesse/zeroscope-v2-xl) or Minimax / Runway Gen-2
‎    // For ZeroScope:
‎    const prediction = await replicate.predictions.create({
‎      version: '9f747673945c628663605fb1d1a0f44c76dd737cfbd7887b8e16e8208f3d562f', // zeroscope-v2-xl
‎      input: {
‎        prompt: prompt,
‎        num_frames: duration === '8s' ? 36 : 24,
‎        num_inference_steps: 30,
‎        fps: 8,
‎        width: aspectRatio === '9:16' ? 576 : 1024,
‎        height: aspectRatio === '9:16' ? 1024 : 576,
‎      },
‎    });
‎
‎    // Step 2: Poll Replicate prediction until status is 'succeeded' or 'failed'
‎    let currentPrediction = prediction;
‎    const maxAttempts = 60; // 60 attempts * 2 seconds = 120 seconds timeout
‎    let attempts = 0;
‎
‎    while (
‎      currentPrediction.status !== 'succeeded' &&
‎      currentPrediction.status !== 'failed' &&
‎      currentPrediction.status !== 'canceled' &&
‎      attempts < maxAttempts
‎    ) {
‎      // Wait 2.5 seconds between polling checks
‎      await new Promise((resolve) => setTimeout(resolve, 2500));
‎      currentPrediction = await replicate.predictions.get(currentPrediction.id);
‎      attempts++;
‎    }
‎
‎    if (currentPrediction.status === 'succeeded') {
‎      // Replicate returns output URL (e.g. string URL or array of URLs)
‎      const output = currentPrediction.output;
‎      const videoUrl = Array.isArray(output) ? output[0] : output;
‎
‎      return NextResponse.json({
‎        success: true,
‎        videoUrl: videoUrl,
‎        predictionId: currentPrediction.id,
‎      });
‎    } else {
‎      throw new Error(
‎        currentPrediction.error ||
‎          `Video generation ended with status: ${currentPrediction.status}`
‎      );
‎    }
‎  } catch (error) {
‎    console.error('Text-to-Video generation error:', error);
‎    return NextResponse.json(
‎      { error: error.message || 'Failed to generate video' },
‎      { status: 500 }
‎    );
‎  }
‎}
‎
