'use client';

import { renderMermaid, THEMES } from 'beautiful-mermaid';
import { useEffect, useState } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);
  const [lightSvg, setLightSvg] = useState<string>('');
  const [darkSvg, setDarkSvg] = useState<string>('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    renderMermaid(chart, { ...THEMES['github-light'], transparent: true })
      .then(setLightSvg)
      .catch(console.error);

    renderMermaid(chart, { ...THEMES.dracula, transparent: true })
      .then(setDarkSvg)
      .catch(console.error);
  }, [chart]);

  if (!mounted || (!lightSvg && !darkSvg)) return null;

  return (
    <div className="my-6 flex justify-center overflow-x-auto [&_svg]:max-w-full [&_svg]:h-auto">
      <div
        className="block dark:hidden"
        dangerouslySetInnerHTML={{ __html: lightSvg }}
      />
      <div
        className="hidden dark:block"
        dangerouslySetInnerHTML={{ __html: darkSvg }}
      />
    </div>
  );
}
