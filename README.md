# Architecture Blueprint Viewer

A web application for viewing and exploring architecture blueprints defined in TOML format.

## Features

- Parse and display architecture blueprints from TOML files
- Interactive sidebar with expandable/collapsible layers and sections
- Clean, modern UI built with Next.js and Tailwind CSS
- TypeScript support for type safety

## Project Structure

- `lib/utils/blueprint-parser.ts` - Core parser for TOML blueprint files
- `components/BlueprintSidebar.tsx` - React component for displaying the blueprint
- `pages/blueprint.tsx` - Example page demonstrating the sidebar
- `work/architecture-blueprint.toml` - Sample blueprint file

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000/blueprint](http://localhost:3000/blueprint) in your browser

## Usage

The BlueprintSidebar component can be used in any page by importing it and providing the path to a TOML blueprint file:

```tsx
import { BlueprintSidebar } from '../components/BlueprintSidebar';

// In your component:
<BlueprintSidebar blueprintPath="/path/to/your/blueprint.toml" />
```

## Blueprint TOML Format

The blueprint should follow this structure:

```toml
[layer_name]
[layer_name.section_name]
components = [
  "Component 1",
  "Component 2",
  # ...
]
```

## License

MIT
