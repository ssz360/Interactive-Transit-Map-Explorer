interface RouteListProps {
  routes: string[];
  selectedRoutes: Set<string>;
  onRouteToggle: (route: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function RouteList({
  routes,
  selectedRoutes,
  onRouteToggle,
  onSelectAll,
  onDeselectAll,
}: RouteListProps) {
  if (routes.length === 0) {
    return (
      <div style={{
        position: "absolute",
        top: "10px",
        left: "50px",
        zIndex: 1000,
        background: "white",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        minWidth: "250px",
        maxHeight: "calc(100vh - 20px)",
        overflowY: "auto"
      }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Transport Lines</h3>
        <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
          Select a location to see routes
        </p>
      </div>
    );
  }

  const sortedRoutes = [...routes].sort((a, b) => {
    const aNum = parseInt(a);
    const bNum = parseInt(b);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    return a.localeCompare(b);
  });

  return (
    <div style={{
      position: "absolute",
      top: "10px",
      left: "50px",
      zIndex: 1000,
      background: "white",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      minWidth: "250px",
      maxHeight: "calc(100vh - 20px)",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>Transport Lines</h3>
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            onClick={onSelectAll}
            style={{
              fontSize: "11px",
              padding: "4px 8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer"
            }}
          >
            All
          </button>
          <button
            onClick={onDeselectAll}
            style={{
              fontSize: "11px",
              padding: "4px 8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer"
            }}
          >
            None
          </button>
        </div>
      </div>
      
      <div style={{
        overflowY: "auto",
        maxHeight: "calc(100vh - 120px)"
      }}>
        {sortedRoutes.map((route) => (
          <label
            key={route}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 0",
              cursor: "pointer",
              fontSize: "14px",
              borderBottom: "1px solid #f0f0f0"
            }}
          >
            <input
              type="checkbox"
              checked={selectedRoutes.has(route)}
              onChange={() => onRouteToggle(route)}
              style={{
                marginRight: "8px",
                cursor: "pointer"
              }}
            />
            <span>Line {route}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

