import { Brain } from 'lucide-react';

export function IdeaIcon({ size = 20 }: { size?: number }) {
  return (
    <Brain
      size={size}
      fill="none"
      stroke="var(--callout-color)"
    />
  );
}
