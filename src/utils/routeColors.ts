const routeColors: Record<string, string> = {};
const palette = [
  "#e41a1c", "#377eb8", "#4daf4a", "#984ea3",
  "#ff7f00", "#ffff33", "#a65628", "#f781bf",
];

export function colorForRoute(ref: string): string {
  if (!routeColors[ref]) {
    routeColors[ref] = palette[Object.keys(routeColors).length % palette.length];
  }
  return routeColors[ref];
}

