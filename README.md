# Interactive Transit Map Explorer

An interactive web application that visualizes public transportation networks (buses and trams) using real-time data from OpenStreetMap. Explore nearby transit stops and routes with an intuitive map interface.

## Features

- **Interactive Map**: Click anywhere on the map to explore public transport in that area
- **Customizable Search Radius**: Adjust the search radius from 100m to 2000m
- **Route Filtering**: Toggle individual routes on/off to focus on specific lines
- **Real-time Data**: Fetches live transit data from OpenStreetMap via Overpass API
- **Visual Differentiation**: Distinct icons for bus stops and tram stops
- **Color-coded Routes**: Each route line is displayed in a unique color
- **Detailed Information**: View stop names, route numbers, and location statistics

## Technologies

- **React 19.2** with TypeScript for type-safe UI development
- **Leaflet** and **React-Leaflet** for interactive mapping
- **Vite** (Rolldown) for fast development and building
- **OpenStreetMap** for map tiles
- **Overpass API** for public transport data

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10 or higher)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Usage

1. Click anywhere on the map to select a location
2. Adjust the radius slider to change the search area
3. View the discovered stops and routes in the stats panel
4. Use the route list to toggle specific routes on/off
5. Click on markers and route lines for detailed information

## Project Structure

```
src/
├── components/          # React components
│   ├── TransportMap.tsx      # Main map component
│   ├── ControlPanel.tsx      # Radius control and stats
│   ├── RouteList.tsx          # Route filtering sidebar
│   ├── MapClickHandler.tsx    # Map interaction handler
│   └── MapIcons.tsx           # Custom map markers
├── services/           # API services
│   └── overpassApi.ts        # Overpass API integration
├── types/              # TypeScript type definitions
│   └── transport.ts          # Transport data types
├── utils/              # Utility functions
│   └── routeColors.ts        # Route color generation
└── App.tsx             # Root component
```

## License

MIT
