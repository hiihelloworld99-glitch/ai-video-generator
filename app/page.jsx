'use client';
‎
import { useState } from 'react';
‎
export default function TextToVideoPage() {
‎  const [prompt, setPrompt] = useState('');
‎  const [aspectRatio, setAspectRatio] = useState('16:9');
‎  const [duration, setDuration] = useState('4s');
‎  const [isLoading, setIsLoading] = useState(false);
‎  const [statusMessage, setStatusMessage] = useState('');
‎  const [videoUrl, setVideoUrl] = useState(null);
‎  const [error, setError] = useState(null);
‎
‎  const handleGenerate = async (e) => {
‎    e?.preventDefault();
‎    if (!prompt.trim() || isLoading) return;
‎
‎    setIsLoading(true);
‎    setError(null);
‎    setVideoUrl(null);
‎    setStatusMessage('Initiating video generation...');
‎
‎    try {
‎      // 1. Send generation request to Next.js API route
‎      const response = await fetch('/api/generate', {
‎        method: 'POST',
‎        headers: { 'Content-Type': 'application/json' },
‎        body: JSON.stringify({ prompt, aspectRatio, duration }),
‎      });
‎
‎      const data = await response.json();
‎
‎      if (!response.ok || data.error) {
‎        throw new Error(data.error || 'Failed to start video generation');
‎      }
‎
‎      if (data.videoUrl) {
‎        setVideoUrl(data.videoUrl);
‎        setStatusMessage('Video generation completed!');
‎      } else {
‎        throw new Error('No video output received from model.');
‎      }
‎    } catch (err) {
‎      console.error(err);
‎      setError(err.message || 'An error occurred during video creation.');
‎    } finally {
‎      setIsLoading(false);
‎    }
‎  };
‎
‎  return (
‎    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-indigo-500 selection:text-white">
‎      {/* Background ambient glows */}
‎      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
‎        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[128px]" />
‎        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[128px]" />
‎      </div>
‎
‎      <div className="w-full max-w-3xl mx-auto space-y-6">
‎        {/* Header */}
‎        <div className="text-center space-y-2">
‎          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
‎            AI Text-to-Video Generator
‎          </h1>
‎          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
‎            Transform descriptive prompts into cinematic high-definition video clips.
‎          </p>
‎        </div>
‎
‎        {/* Glassmorphic Card */}
‎        <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-6">
‎          {/* Prompt Textarea */}
‎          <div className="space-y-2">
‎            <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-300">
‎              Video Description Prompt
‎            </label>
‎            <textarea
‎              id="prompt-input"
‎              rows={4}
‎              value={prompt}
‎              onChange={(e) => setPrompt(e.target.value)}
‎              placeholder="e.g. A neon-lit futuristic drone cruising smoothly above a cybernetic city at dusk, rain reflections on glass, cinematic lighting..."
‎              className="w-full rounded-xl bg-slate-950/70 border border-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-sm sm:text-base"
‎            />
‎          </div>
‎
‎          {/* Settings Row */}
‎          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
‎            {/* Aspect Ratio */}
‎            <div className="space-y-2">
‎              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
‎                Aspect Ratio
‎              </span>
‎              <div className="flex gap-2">
‎                {[
‎                  { id: '16:9', label: '16:9 Landscape' },
‎                  { id: '9:16', label: '9:16 Portrait' },
‎                  { id: '1:1', label: '1:1 Square' },
‎                ].map((option) => (
‎                  <button
‎                    key={option.id}
‎                    type="button"
‎                    onClick={() => setAspectRatio(option.id)}
‎                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
‎                      aspectRatio === option.id
‎                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
‎                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
‎                    }`}
‎                  >
‎                    {option.id}
‎                  </button>
‎                ))}
‎              </div>
‎            </div>
‎
‎            {/* Duration */}
‎            <div className="space-y-2">
‎              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
‎                Duration
‎              </span>
‎              <div className="flex gap-2">
‎                {[
‎                  { id: '4s', label: '4 Seconds (Fast)' },
‎                  { id: '8s', label: '8 Seconds' },
‎                ].map((option) => (
‎                  <button
‎                    key={option.id}
‎                    type="button"
‎                    onClick={() => setDuration(option.id)}
‎                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
‎                      duration === option.id
‎                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
‎                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
‎                    }`}
‎                  >
‎                    {option.id}
‎                  </button>
‎                ))}
‎              </div>
‎            </div>
‎          </div>
‎
‎          {/* Action Button */}
‎          <button
‎            id="generate-video-btn"
‎            type="button"
‎            disabled={isLoading || !prompt.trim()}
‎            onClick={handleGenerate}
‎            className="w-full relative py-3.5 px-6 rounded-xl font-medium text-white transition-all duration-200 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 active:scale-[0.99] flex items-center justify-center gap-2 overflow-hidden"
‎          >
‎            {isLoading ? (
‎              <span className="flex items-center gap-3">
‎                <svg
‎                  className="animate-spin h-5 w-5 text-white"
‎                  xmlns="http://www.w3.org/2000/svg"
‎                  fill="none"
‎                  viewBox="0 0 24 24"
‎                >
‎                  <circle
‎                    className="opacity-25"
‎                    cx="12"
‎                    cy="12"
‎                    r="10"
‎                    stroke="currentColor"
‎                    strokeWidth="4"
‎                  />
‎                  <path
‎                    className="opacity-75"
‎                    fill="currentColor"
‎                    d="M4 12a8 8 0 018-8v8H4z"
‎                  />
‎                </svg>
‎                <span>Synthesizing Video...</span>
‎              </span>
‎            ) : (
‎              <span>Generate Video</span>
‎            )}
‎          </button>
‎
‎          {/* Status / Loading Progress */}
‎          {isLoading && (
‎            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-center space-y-1.5 animate-pulse">
‎              <p className="text-sm font-medium text-indigo-300">
‎                {statusMessage || 'Processing video generation on GPU...'}
‎              </p>
‎              <p className="text-xs text-slate-400">
‎                High-definition neural rendering usually takes 30–90 seconds. Please hold on!
‎              </p>
‎            </div>
‎          )}
‎
‎          {/* Error Message */}
‎          {error && (
‎            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-sm">
‎              {error}
‎            </div>
‎          )}
‎        </div>
‎
‎        {/* Video Player Output Section */}
‎        {videoUrl && (
‎          <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50 space-y-4 animate-fade-in">
‎            <div className="flex items-center justify-between">
‎              <h2 className="text-lg font-semibold text-slate-200">Generated Video</h2>
‎              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
‎                Ready for Download
‎              </span>
‎            </div>
‎
‎            <div className="relative rounded-xl overflow-hidden bg-black/60 border border-slate-800 aspect-video flex items-center justify-center">
‎              <video
‎                src={videoUrl}
‎                controls
‎                autoPlay
‎                loop
‎                playsInline
‎                className="w-full h-full object-contain"
‎              />
‎            </div>
‎
‎            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
‎              <p className="text-xs text-slate-400 line-clamp-1 italic">
‎                "{prompt}"
‎              </p>
‎              <a
‎                id="download-mp4-btn"
‎                href={videoUrl}
‎                download="generated-video.mp4"
‎                target="_blank"
‎                rel="noreferrer"
‎                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors shadow-md"
‎              >
‎                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
‎                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
‎                </svg>
‎                Download MP4
‎              </a>
‎            </div>
‎          </div>
‎        )}
‎      </div>
‎    </main>
‎  );
‎}
‎
