import { parse } from "toml";

/**
 * Represents a component in the architecture blueprint
 */
export interface Component {
  name: string;
}

/**
 * Represents a section in the architecture blueprint
 */
export interface Section {
  name: string;
  components: Component[];
}

/**
 * Represents a layer in the architecture blueprint
 */
export interface Layer {
  name: string;
  sections: Section[];
}

/**
 * Represents the complete architecture blueprint
 */
export interface ArchitectureBlueprint {
  layers: Layer[];
}

/**
 * Raw TOML structure as parsed from the file
 */
interface RawBlueprint {
  [key: string]: {
    [key: string]: {
      components: string[];
    };
  };
}

/**
 * Parses the architecture blueprint TOML file into a strongly-typed structure
 * @param tomlContent The TOML content as a string
 * @returns A structured representation of the architecture blueprint
 */
export function parseBlueprint(tomlContent: string): ArchitectureBlueprint {
  const rawBlueprint = parse(tomlContent) as RawBlueprint;
  const layers: Layer[] = [];

  // Process each layer in the blueprint
  for (const [layerName, layerData] of Object.entries(rawBlueprint)) {
    const sections: Section[] = [];

    // Process each section in the layer
    for (const [sectionName, sectionData] of Object.entries(layerData)) {
      const components: Component[] = sectionData.components.map(
        (componentName) => ({ name: componentName })
      );

      sections.push({
        name: sectionName,
        components,
      });
    }

    layers.push({
      name: layerName,
      sections,
    });
  }

  return { layers };
}

/**
 * Loads and parses the architecture blueprint from a file
 * @param filePath Path to the TOML file
 * @returns A promise that resolves to the parsed architecture blueprint
 */
export async function loadBlueprintFromFile(
  filePath: string
): Promise<ArchitectureBlueprint> {
  try {
    const response = await fetch(filePath);
    const tomlContent = await response.text();
    return parseBlueprint(tomlContent);
  } catch (error: unknown) {
    console.error("Error loading blueprint:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load architecture blueprint: ${errorMessage}`);
  }
}
