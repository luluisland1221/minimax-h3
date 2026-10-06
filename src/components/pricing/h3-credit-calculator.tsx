'use client';

import {
  type H3Resolution,
  H3_CREDITS_PER_SECOND,
  getH3OutputCredits,
} from '@/lib/minimax-h3-pricing';
import Link from 'next/link';
import { useState } from 'react';

const durations = Array.from({ length: 12 }, (_, index) => index + 4);

export function H3CreditCalculator() {
  const [duration, setDuration] = useState(4);
  const [resolution, setResolution] = useState<H3Resolution>('768P');
  const credits = getH3OutputCredits(resolution, duration);

  return (
    <section
      aria-labelledby="credit-calculator-title"
      className="rounded-2xl border bg-card p-6 sm:p-8"
    >
      <h2 id="credit-calculator-title" className="text-2xl font-semibold">
        MiniMax H3 credit calculator
      </h2>
      <p className="mt-2 text-muted-foreground">
        Choose your output settings to estimate credits before generating.
      </p>
      <div className="mt-6 grid gap-6 sm:grid-cols-3 sm:items-end">
        <div className="space-y-2">
          <label htmlFor="h3-duration" className="block text-sm font-medium">
            Duration
          </label>
          <select
            id="h3-duration"
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="h-11 w-full rounded-md border bg-background px-3"
          >
            {durations.map((seconds) => (
              <option key={seconds} value={seconds}>
                {seconds} seconds
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="h3-resolution" className="block text-sm font-medium">
            Resolution
          </label>
          <select
            id="h3-resolution"
            value={resolution}
            onChange={(event) =>
              setResolution(event.target.value as H3Resolution)
            }
            className="h-11 w-full rounded-md border bg-background px-3"
          >
            <option value="768P">
              768P · {H3_CREDITS_PER_SECOND['768P']} credits/second
            </option>
            <option value="2K">
              2K · {H3_CREDITS_PER_SECOND['2K']} credits/second
            </option>
          </select>
        </div>
        <output
          htmlFor="h3-duration h3-resolution"
          aria-live="polite"
          className="rounded-lg bg-muted px-4 py-3 text-2xl font-semibold"
        >
          {credits} credits
        </output>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Output-only estimate. Reference video and more than five reference
        images can add charges. Review the Playground estimate for your complete
        request.{' '}
        <Link
          href="/docs/credits-and-pricing"
          className="underline underline-offset-4"
        >
          How credits work
        </Link>
      </p>
    </section>
  );
}
