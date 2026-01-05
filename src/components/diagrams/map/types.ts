export interface Server {
  /** Unique identifier for the server */
  id: string;
  /** Display name */
  name: string;
  /** [longitude, latitude] coordinates */
  coordinates: [number, number];
  /** Optional short code (e.g., "FRA", "NYC") */
  code?: string;
}

export interface ConnectionMetrics {
  /** Bundle loss percentage (0-100) */
  bundleLoss?: number;
  /** Latency in milliseconds */
  latency?: number;
  /** Bandwidth in Mbps */
  bandwidth?: number;
  /** Allow custom metrics */
  [key: string]: number | undefined;
}

export interface Connection {
  /** Server ID to connect from */
  from: string;
  /** Server ID to connect to */
  to: string;
  /** Metrics affecting visual weight */
  metrics: ConnectionMetrics;
  /** Optional label override */
  label?: string;
  /** If true, renders as bidirectional (no arrow). Default: false (directional) */
  bidirectional?: boolean;
  /** Optional intermediate waypoints [longitude, latitude] for cable-style routing */
  waypoints?: [number, number][];
}

export interface GlobalMapProps {
  /** Array of server nodes to display */
  servers: Server[];
  /** Array of connections between servers */
  connections: Connection[];
  /** Which metric key to use for visual weighting */
  metricKey?: keyof ConnectionMetrics;
  /** [min, max] range for the metric (for normalization) */
  metricRange?: [number, number];
  /** Map height in pixels (width is responsive) */
  height?: number;
  /** Show graticule (lat/lon grid) - not supported in mapcn */
  showGraticule?: boolean;
  /** Custom className for the container */
  className?: string;
  /** Center point [longitude, latitude] for the map view */
  center?: [number, number];
  /** Zoom scale (default ~150 for world view, higher = more zoomed in) */
  scale?: number;
  /** Show color legend for the metric. Default: false */
  showLegend?: boolean;
}
