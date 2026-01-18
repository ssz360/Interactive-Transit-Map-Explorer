export interface StopNode {
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    railway?: string;
    public_transport?: string;
    highway?: string;
  };
}

export interface RouteWay {
  geometry: Array<{ lat: number; lon: number }>;
  tags?: {
    ref?: string;
  };
}

export interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  geometry?: Array<{ lat: number; lon: number }>;
  tags?: Record<string, string>;
  members?: Array<{
    type: "node" | "way" | "relation";
    ref: number;
    role?: string;
  }>;
}

export interface OverpassResponse {
  elements: OverpassElement[];
}

export type RouteWays = Record<string, Array<Array<[number, number]>>>;

