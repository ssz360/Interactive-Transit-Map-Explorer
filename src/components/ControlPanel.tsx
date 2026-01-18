interface ControlPanelProps {
  radius: number;
  onRadiusChange: (newRadius: number) => void;
  selectedPoint: [number, number] | null;
  stopsCount: number;
  routesCount: number;
  loading: boolean;
}

export function ControlPanel({
  radius,
  onRadiusChange,
  selectedPoint,
  stopsCount,
  routesCount,
  loading,
}: ControlPanelProps) {
  return (
    <div style={{
      position: "absolute",
      top: "10px",
      right: "10px",
      zIndex: 1000,
      background: "white",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      minWidth: "250px"
    }}>
      <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Transport Finder</h3>
      <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#666" }}>
        Click on the map to select a location
      </p>
      
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontSize: "13px", fontWeight: "bold" }}>
          Radius: {radius}m
        </label>
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#666" }}>
          <span>100m</span>
          <span>2000m</span>
        </div>
      </div>

      {selectedPoint && (
        <div style={{ fontSize: "12px", color: "#444", padding: "10px", background: "#f5f5f5", borderRadius: "4px" }}>
          <strong>Selected:</strong><br />
          Lat: {selectedPoint[0].toFixed(5)}<br />
          Lon: {selectedPoint[1].toFixed(5)}<br />
          <strong style={{ marginTop: "5px", display: "block" }}>Found:</strong>
          {stopsCount} stops, {routesCount} routes
        </div>
      )}

      {loading && (
        <div style={{ marginTop: "10px", color: "#377eb8", fontSize: "13px" }}>
          Loading transport data...
        </div>
      )}
    </div>
  );
}

