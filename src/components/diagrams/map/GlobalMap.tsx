'use client';

import {
  Map as MapComponent,
  MapControls,
  MapMarker,
  MapPopup,
  MapRoute,
  MarkerContent,
  MarkerTooltip,
} from '@/components/ui/map';
import { Server as ServerIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Connection as ConnectionType, GlobalMapProps } from './types';
import {
  formatMetric,
  getConnectionColor,
  getMetricLabel,
  getOpacity,
  getStrokeWidth,
  normalizeMetric,
} from './utils';

export function GlobalMap({
  servers,
  connections,
  metricKey = 'bundleLoss',
  metricRange = [0, 100],
  height = 400,
  className,
  center = [0, 0],
  scale = 150,
  showLegend = false,
}: GlobalMapProps) {
  const [hoveredConnection, setHoveredConnection] = useState<{
    conn: ConnectionType;
    position: { lng: number; lat: number };
  } | null>(null);

  // Create lookup map for server coordinates
  const serverMap = useMemo(
    () => new Map(servers.map((s) => [s.id, s])),
    [servers],
  );

  // Convert scale to zoom level (approximate)
  // scale 150 ≈ zoom 1, scale 350 ≈ zoom 2.5
  const initialZoom = Math.log2(scale / 150) + 1;

  const metricLabel = getMetricLabel(metricKey as string);

  return (
    <div className={`relative ${className ?? ''}`} style={{ height }}>
      {/* Legend */}
      {showLegend && (
        <div
          className="absolute bottom-2 left-2 z-10 rounded-md border border-fd-border bg-fd-card/90 px-3 py-2 text-xs shadow-md backdrop-blur-sm"
          style={{ fontFamily: 'var(--font-at-hauss-mono)' }}
        >
          <div className="mb-1.5 font-medium text-fd-foreground">
            {metricLabel}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-fd-muted-foreground">
              {formatMetric(metricKey as string, metricRange[0])}
            </span>
            <div
              className="h-2 w-24 rounded-sm"
              style={{
                background:
                  'linear-gradient(to right, rgb(238, 184, 21), rgb(245, 158, 11), rgb(239, 68, 68))',
              }}
            />
            <span className="text-fd-muted-foreground">
              {formatMetric(metricKey as string, metricRange[1])}
            </span>
          </div>
        </div>
      )}

      <MapComponent
        center={center as [number, number]}
        zoom={initialZoom}
        scrollZoom={true}
        dragPan={true}
      >
        <MapControls position="top-right" showZoom={true} />

        {/* Render connections */}
        {connections.map((conn) => {
          const fromServer = serverMap.get(conn.from);
          const toServer = serverMap.get(conn.to);
          if (!fromServer || !toServer) return null;

          const metricValue = conn.metrics[metricKey] ?? 0;
          const normalizedWeight = normalizeMetric(
            metricValue,
            metricRange[0],
            metricRange[1],
          );

          const color = getConnectionColor(normalizedWeight);
          const width = getStrokeWidth(normalizedWeight);
          const opacity = getOpacity(normalizedWeight);
          const isHovered = hoveredConnection?.conn === conn;

          // Build route coordinates: start -> waypoints -> end
          const routeCoordinates: [number, number][] = [
            fromServer.coordinates,
            ...(conn.waypoints ?? []),
            toServer.coordinates,
          ];

          return (
            <MapRoute
              key={`${conn.from}-${conn.to}`}
              coordinates={routeCoordinates}
              color={color}
              width={isHovered ? width * 2 : width}
              opacity={isHovered ? 1 : opacity}
              onMouseEnter={(lngLat) =>
                setHoveredConnection({ conn, position: lngLat })
              }
              onMouseLeave={() => setHoveredConnection(null)}
            />
          );
        })}

        {/* Render server nodes */}
        {servers.map((server) => (
          <MapMarker
            key={server.id}
            longitude={server.coordinates[0]}
            latitude={server.coordinates[1]}
          >
            <MarkerContent>
              <div className="rounded-md bg-fd-card p-1 shadow-lg border border-fd-border">
                <ServerIcon className="h-4 w-4 text-fd-foreground" />
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <div style={{ fontFamily: 'var(--font-at-hauss-mono)' }}>
                <span className="font-medium">{server.name}</span>
                {server.code && (
                  <span className="ml-1 opacity-70">({server.code})</span>
                )}
              </div>
            </MarkerTooltip>
          </MapMarker>
        ))}

        {/* Connection tooltip */}
        {hoveredConnection && (
          <MapPopup
            longitude={hoveredConnection.position.lng}
            latitude={hoveredConnection.position.lat}
            closeButton={false}
            closeOnClick={false}
            closeOnMove={false}
            anchor="bottom"
            offset={12}
          >
            <div
              className="pointer-events-none rounded-md border border-fd-border bg-fd-card px-3 py-2 text-sm shadow-md"
              style={{ fontFamily: 'var(--font-at-hauss-mono)' }}
            >
              <div className="font-medium text-fd-foreground">
                {hoveredConnection.conn.from}{' '}
                {hoveredConnection.conn.bidirectional ? '↔' : '→'}{' '}
                {hoveredConnection.conn.to}
              </div>
              <div className="mt-1 space-y-0.5 text-xs text-fd-muted-foreground">
                {Object.entries(hoveredConnection.conn.metrics).map(
                  ([key, value]) => {
                    if (value === undefined) return null;
                    const isHighlighted = key === metricKey;
                    return (
                      <div
                        key={key}
                        className={isHighlighted ? 'text-fd-foreground' : ''}
                      >
                        {getMetricLabel(key)}: {formatMetric(key, value)}
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </MapPopup>
        )}
      </MapComponent>
    </div>
  );
}
