/**
 * Normalize a metric value to a 0-1 range
 */
export function normalizeMetric(
  value: number,
  min: number,
  max: number,
): number {
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

/**
 * Get connection color based on normalized weight (0-1)
 * Yellow (good) -> Orange -> Red (bad)
 */
export function getConnectionColor(normalizedWeight: number): string {
  // Brand yellow: rgb(238, 184, 21)
  // Orange: rgb(245, 158, 11)
  // Red: rgb(239, 68, 68)

  if (normalizedWeight <= 0.5) {
    // Yellow to Orange (0 to 0.5)
    const t = normalizedWeight * 2;
    const r = Math.round(238 + (245 - 238) * t);
    const g = Math.round(184 + (158 - 184) * t);
    const b = Math.round(21 + (11 - 21) * t);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Orange to Red (0.5 to 1)
    const t = (normalizedWeight - 0.5) * 2;
    const r = Math.round(245 + (239 - 245) * t);
    const g = Math.round(158 + (68 - 158) * t);
    const b = Math.round(11 + (68 - 11) * t);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

/**
 * Get stroke width based on normalized weight (0-1)
 * Range: 1.5px (low) to 4px (high)
 */
export function getStrokeWidth(normalizedWeight: number): number {
  return 1.5 + normalizedWeight * 2.5;
}

/**
 * Get opacity based on normalized weight (0-1)
 * Range: 0.6 (low) to 0.9 (high)
 */
export function getOpacity(normalizedWeight: number): number {
  return 0.6 + normalizedWeight * 0.3;
}

/**
 * Format metric value for display
 */
export function formatMetric(key: string, value: number): string {
  switch (key) {
    case 'bundleLoss':
      return `${value.toFixed(2)}%`;
    case 'latency':
      return `${value.toFixed(0)}ms`;
    case 'bandwidth':
      return `${value.toFixed(1)} Mbps`;
    default:
      return value.toFixed(2);
  }
}

/**
 * Get human-readable label for metric key
 */
export function getMetricLabel(key: string): string {
  switch (key) {
    case 'bundleLoss':
      return 'Bundle Loss';
    case 'latency':
      return 'Latency';
    case 'bandwidth':
      return 'Bandwidth';
    default:
      // Convert camelCase to Title Case
      return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase());
  }
}
