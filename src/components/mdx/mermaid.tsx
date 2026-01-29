'use client';

import { useEffect, useState } from 'react';
import { renderMermaid, THEMES } from 'beautiful-mermaid';

export function Mermaid({ chart }: { chart: string }) {
  const [lightSvg, setLightSvg] = useState<string>('');
  const [darkSvg, setDarkSvg] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-render both themes
  useEffect(() => {
    renderMermaid(chart, { ...THEMES['github-light'], transparent: true })
      .then(setLightSvg)
      .catch(console.error);

    renderMermaid(chart, { ...THEMES['dracula'], transparent: true })
      .then(setDarkSvg)
      .catch(console.error);
  }, [chart]);

  if (!mounted || (!lightSvg && !darkSvg)) return null;

  return (
    <div className="my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto [&_svg_text]:text-base">
      {/* Light mode version - hidden in dark mode */}
      <div
        className="block dark:hidden"
        dangerouslySetInnerHTML={{ __html: lightSvg }}
      />
      {/* Dark mode version - hidden in light mode */}
      <div
        className="hidden dark:block"
        dangerouslySetInnerHTML={{ __html: darkSvg }}
      />
    </div>
  );
}
