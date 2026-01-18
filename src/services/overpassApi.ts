import type { StopNode, RouteWays, OverpassResponse, OverpassElement } from "../types/transport";

export async function fetchTransportData(
  lat: number,
  lon: number,
  radius: number
): Promise<{ stops: StopNode[]; routes: RouteWays }> {
  const query = `
    [out:json];
    (
      node(around:${radius}, ${lat}, ${lon})
        [public_transport~"platform|stop_position"];
      node(around:${radius}, ${lat}, ${lon})
        [highway=bus_stop];
    )->.stops;
    rel(bn.stops)
      [type=route]
      [route~"bus|tram"]
      ->.routes;
    (.routes; .routes >; .stops;);
    out geom;
  `;
  
  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
  });
  
  const data: OverpassResponse = await response.json();
  
  const stopNodes: StopNode[] = [];
  const routeWays: RouteWays = {};
  
  // First pass: Process relations to extract route names and build way-to-route mapping
  const wayToRouteMap = new Map<number, string>();
  const routeNames = new Map<number, string>();
  
  data.elements.forEach((el: OverpassElement) => {
    if (el.type === "relation" && el.tags) {
      // Extract route reference (prefer ref, fallback to name)
      const routeRef = el.tags.ref || el.tags.name || `route_${el.id}`;
      routeNames.set(el.id, routeRef);
      
      // Map all way members to this route
      if (el.members) {
        el.members.forEach((member) => {
          if (member.type === "way") {
            wayToRouteMap.set(member.ref, routeRef);
          }
        });
      }
    }
  });
  
  // Second pass: Process nodes and ways
  data.elements.forEach((el: OverpassElement) => {
    // Only include nodes that have stop-related tags
    if (el.type === "node" && el.lat && el.lon) {
      const tags = el.tags || {};
      const isStop = 
        tags.public_transport === "platform" ||
        tags.public_transport === "stop_position" ||
        tags.highway === "bus_stop" ||
        tags.railway === "tram_stop" ||
        tags.railway === "station";
      
      if (isStop) {
        stopNodes.push({
          id: el.id,
          lat: el.lat,
          lon: el.lon,
          tags: el.tags,
        });
      }
    }
    
    // Process ways and assign them to routes based on the mapping
    if (el.type === "way" && el.geometry) {
      const routeRef = wayToRouteMap.get(el.id) || el.tags?.ref || "unknown";
      
      if (!routeWays[routeRef]) {
        routeWays[routeRef] = [];
      }
      routeWays[routeRef].push(
        el.geometry.map((p) => [p.lat, p.lon] as [number, number])
      );
    }
  });
  
  return { stops: stopNodes, routes: routeWays };
}

