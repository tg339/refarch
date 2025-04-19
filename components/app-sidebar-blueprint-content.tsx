"use client";

import * as React from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroupAction,
} from "@/components/ui/sidebar";
import { ArchitectureBlueprint } from "@/lib/utils/blueprint-parser";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlueprintStore } from "@/lib/stores/blueprint-store";

// Helper functions to format names for display
function formatLayerName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatSectionName(name: string): string {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface AppSidebarBlueprintContentProps {
  blueprint: ArchitectureBlueprint;
}

export function AppSidebarBlueprintContent({
  blueprint,
}: AppSidebarBlueprintContentProps) {
  const { expandedLayers, toggleLayer } = useBlueprintStore();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Architecture Blueprint</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {blueprint.layers.map((layer) => (
              <SidebarMenuItem key={layer.name}>
                <SidebarMenuButton asChild>
                  <div className="font-medium flex items-center justify-between">
                    <span>{formatLayerName(layer.name)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:cursor-pointer"
                      onClick={() => toggleLayer(layer.name)}
                    >
                      <ChevronDown
                        className={`transition-transform duration-200 ${
                          expandedLayers[layer.name] ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </SidebarMenuButton>
                {layer.sections?.length ? (
                  <>
                    {expandedLayers[layer.name] && (
                      <SidebarMenuSub>
                        {layer.sections.map((section) => (
                          <SidebarMenuSubItem key={section.name}>
                            <SidebarMenuSubButton asChild>
                              <a href={`#${layer.name}-${section.name}`}>
                                {formatSectionName(section.name)}
                              </a>
                            </SidebarMenuSubButton>
                            {section.components?.length ? (
                              <SidebarMenuSub>
                                {section.components.map((component) => (
                                  <SidebarMenuSubItem key={component.name}>
                                    <SidebarMenuSubButton asChild>
                                      <a href={`#${component.name}`}>
                                        {component.name}
                                      </a>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            ) : null}
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
