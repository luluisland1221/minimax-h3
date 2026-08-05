'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

export function CopyVideoLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const absoluteUrl = new URL(url, window.location.origin).toString();
    await navigator.clipboard.writeText(absoluteUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy}>
      {copied ? (
        <Check className="mr-1.5 size-3.5 text-emerald-500" />
      ) : (
        <Copy className="mr-1.5 size-3.5" />
      )}
      {copied ? 'Copied' : 'Copy link'}
    </Button>
  );
}
