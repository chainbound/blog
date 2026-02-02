'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react';

const fontMono = 'font-[family-name:var(--font-at-hauss-mono)]';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referrer: pathname }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setState('success');
      setEmail('');
    } catch (error) {
      setState('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  };

  if (state === 'success') {
    return (
      <div className="w-full rounded-xl border border-fd-border bg-fd-card p-8">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
            <Check className="h-6 w-6 text-green-500" />
          </div>
          <h3 className={`text-lg font-medium ${fontMono}`}>
            You&apos;re subscribed!
          </h3>
          <p className="text-fd-muted-foreground text-sm">
            Thanks for subscribing. We&apos;ll keep you updated with our latest
            posts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-fd-border bg-fd-card p-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fd-primary/10">
            <Mail className="h-5 w-5 text-fd-primary" />
          </div>
          <div>
            <h3 className={`text-lg font-medium ${fontMono}`}>
              Stay in the loop
            </h3>
            <p className="text-fd-muted-foreground text-sm">
              Get notified when we publish new articles
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state === 'error') setState('idle');
              }}
              placeholder="you@example.com"
              required
              disabled={state === 'loading'}
              className={`flex-1 rounded-lg border border-fd-border bg-fd-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-fd-muted-foreground focus:border-fd-primary focus:ring-1 focus:ring-fd-primary disabled:opacity-50 ${fontMono}`}
            />
            <button
              type="submit"
              disabled={state === 'loading' || !email}
              className={`inline-flex items-center justify-center gap-2 rounded-lg bg-fd-primary px-4 py-2.5 text-sm font-medium text-fd-primary-foreground transition-all hover:bg-fd-primary/90 disabled:opacity-50 disabled:cursor-not-allowed ${fontMono}`}
            >
              {state === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {state === 'error' && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}

          <p className="text-xs text-fd-muted-foreground">
            No spam, unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
}
