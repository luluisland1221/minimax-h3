'use client';

import { Check, Copy, Play } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PromptExampleProps {
  title: string;
  prompt: string;
  videoSrc: string;
  label?: string;
}

export function PromptExample({
  title,
  prompt,
  videoSrc,
  label = 'Prompt mapped to this video',
}: PromptExampleProps) {
  const [copied, setCopied] = useState(false);
  const playgroundHref = `/?prompt=${encodeURIComponent(prompt)}#playground`;

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="my-8 overflow-hidden rounded-3xl border border-[#EC435B]/25 bg-[#120e12] shadow-[0_24px_80px_rgba(88,60,80,0.22)]">
      <div className="grid lg:grid-cols-[1.05fr_.95fr]">
        <video
          className="aspect-video h-full w-full bg-black object-cover"
          controls
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="flex flex-col p-5 sm:p-7">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#EC435B]">
            {label}
          </p>
          <h3 className="mb-0 mt-2 text-xl font-semibold text-white">
            {title}
          </h3>
          <p className="mt-4 flex-1 text-sm leading-7 text-white/65">
            {prompt}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={copyPrompt}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-[#CC346E]/50 hover:bg-white/10"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? 'Copied' : 'Copy Prompt'}
            </button>
            <Link
              href={playgroundHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EC435B] via-[#CC346E] to-[#583C50] px-4 py-3 text-sm font-semibold text-white no-underline transition hover:brightness-110"
            >
              <Play className="size-4 fill-current" />
              Try This Prompt
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
