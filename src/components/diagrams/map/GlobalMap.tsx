'use client';

import { useState, useMemo } from 'react';
import { Server as ServerIcon } from 'lucide-react';
import {
  Map as MapComponent,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapPopup,
  MapRoute,
  MapControls,
} from '@/components/ui/map';
import {
  normalizeMetric,
  getConnectionColor,
  getStrokeWidth,
  getOpacity,
  formatMetric,
  getMetricLabel,
} from './utils';
import type {
  GlobalMapProps,
  Server,
  Connection as ConnectionType,
} from './types';

export function GlobalMap({
  servers,
  connections,
  metricKey = 'bundleLoss',
  metricRange = [0, 100],
  height = 400,
  className,
  center = [0, 0],
  scale = 150,
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

  return (
    <div className={`relative ${className ?? ''}`} style={{ height }}>
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
