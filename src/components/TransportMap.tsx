import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapClickHandler } from "./MapClickHandler";
import { ControlPanel } from "./ControlPanel";
import { RouteList } from "./RouteList";
import { busIcon, tramIcon, selectedIcon } from "./MapIcons";
import { colorForRoute } from "../utils/routeColors";
import { fetchTransportData } from "../services/overpassApi";
import type { StopNode, RouteWays } from "../types/transport";

// Calculate distance between two lat/lon points in meters using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function TransportMap() {
  const [stops, setStops] = useState<StopNode[]>([]);
  const [routes, setRoutes] = useState<RouteWays>({});
  const [selectedPoint, setSelectedPoint] = useState<[number, number] | null>(null);
  const [radius, setRadius] = useState(500);
  const [loading, setLoading] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set());
  const center: [number, number] = [45.0703, 7.6869];

  const handleLocationSelect = (coords: [number, number]) => {
    // Clear old data when selecting a new location
    setStops([]);
    setRoutes({});
    setSelectedRoutes(new Set());
    setSelectedPoint(coords);
    loadTransportData(coords[0], coords[1], radius);
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (selectedPoint) {
      loadTransportData(selectedPoint[0], selectedPoint[1], newRadius);
    }
  };

  const loadTransportData = async (lat: number, lon: number, rad: number) => {
    setLoading(true);
    try {
      const { stops: stopNodes, routes: routeWays } = await fetchTransportData(lat, lon, rad);
      setStops(stopNodes);
      setRoutes(routeWays);
      // Initialize all routes as selected by default
      setSelectedRoutes(new Set(Object.keys(routeWays)));
    } catch (error) {
      console.error("Failed to fetch transport data:", error);
      alert(`Error: something went wrong, probably the server is busy. Try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteToggle = (route: string) => {
    setSelectedRoutes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(route)) {
        newSet.delete(route);
      } else {
        newSet.add(route);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedRoutes(new Set(Object.keys(routes)));
  };

  const handleDeselectAll = () => {
    setSelectedRoutes(new Set());
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <RouteList
        routes={Object.keys(routes)}
        selectedRoutes={selectedRoutes}
        onRouteToggle={handleRouteToggle}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
      />
      <ControlPanel
        radius={radius}
        onRadiusChange={handleRadiusChange}
        selectedPoint={selectedPoint}
        stopsCount={
          selectedPoint
            ? stops.filter((stop) => {
                const distance = calculateDistance(
                  selectedPoint[0],
                  selectedPoint[1],
                  stop.lat,
                  stop.lon
                );
                return distance <= radius;
              }).length
            : 0
        }
        routesCount={Object.keys(routes).length}
        loading={loading}
      />

      <MapContainer center={center} zoom={14} style={{ height: "100%" }}>
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onLocationSelect={handleLocationSelect} />

        {selectedPoint && (
          <>
            <Marker position={selectedPoint} icon={selectedIcon}>
              <Popup>
                <strong>Selected Location</strong><br />
                Radius: {radius}m
              </Popup>
            </Marker>
            <Circle
              center={selectedPoint}
              radius={radius}
              pathOptions={{
                color: "#377eb8",
                fillColor: "#377eb8",
                fillOpacity: 0.1,
                weight: 2
              }}
            />
          </>
        )}

        {Object.entries(routes)
          .filter(([ref]) => selectedRoutes.has(ref))
          .map(([ref, segments]) =>
            segments.map((coords, i) => (
              <Polyline
                key={`${ref}-${i}`}
                positions={coords}
                color={colorForRoute(ref)}
                weight={5}
              >
                <Popup>Line {ref}</Popup>
              </Polyline>
            ))
          )}

        {stops
          .filter((stop) => {
            if (!selectedPoint) return false;
            const distance = calculateDistance(
              selectedPoint[0],
              selectedPoint[1],
              stop.lat,
              stop.lon
            );
            return distance <= radius;
          })
          .map((stop) => {
            const isTram = stop.tags?.railway === "tram_stop";
            return (
              <Marker
                key={stop.id}
                position={[stop.lat, stop.lon]}
                icon={isTram ? tramIcon : busIcon}
              >
                <Popup>
                  <strong>{stop.tags?.name || "Stop"}</strong>
                  <br />
                  {isTram ? "Tram stop" : "Bus stop"}
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}

