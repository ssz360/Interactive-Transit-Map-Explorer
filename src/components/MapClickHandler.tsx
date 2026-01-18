import { useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";

interface MapClickHandlerProps {
  onLocationSelect: (coords: [number, number]) => void;
}

export function MapClickHandler({ onLocationSelect }: MapClickHandlerProps) {
  useMapEvents({
    click: (e: { latlng: LatLng }) => {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

