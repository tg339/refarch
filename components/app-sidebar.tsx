import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  ArchitectureBlueprint,
  parseBlueprint,
} from "@/lib/utils/blueprint-parser";
import { AppSidebarBlueprintContent } from "@/components/app-sidebar-blueprint-content";
import fs from "fs";
import path from "path";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Load blueprint data directly in the server component
  let blueprint: ArchitectureBlueprint | null = null;
  let error: string | null = null;

  try {
    // Read the TOML file directly from the filesystem
    const blueprintPath = path.join(
      process.cwd(),
      "work",
      "architecture-blueprint.toml"
    );
    const tomlContent = fs.readFileSync(blueprintPath, "utf-8");
    blueprint = parseBlueprint(tomlContent);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load blueprint";
    console.error("Error loading blueprint:", err);
  }

  if (error) {
    return (
      <Sidebar {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-red-500">
              Error: {error}
            </SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  if (!blueprint) {
    return (
      <Sidebar {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>No blueprint data available</SidebarGroupLabel>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    );
  }

  return (
    <Sidebar {...props}>
      <AppSidebarBlueprintContent blueprint={blueprint} />
      <SidebarRail />
    </Sidebar>
  );
}
