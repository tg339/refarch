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
import { ChevronDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlueprintStore } from "@/lib/stores/blueprint-store";
import { Switch } from "@/components/ui/switch";

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
  const {
    expandedLayers,
    expandedSections,
    expandedComponents,
    toggleLayer,
    toggleSection,
    toggleComponent,
    setLayerExpanded,
    setSectionExpanded,
    setComponentExpanded,
    toggleAllInLayer,
    toggleAllInSection,
  } = useBlueprintStore();

  // Implement toggleAllInLayer and toggleAllInSection
  const handleToggleAllInLayer = (layerName: string, expanded: boolean) => {
    setLayerExpanded(layerName, expanded);

    // Only untoggle children when parent is untoggled
    if (!expanded) {
      // Find the layer
      const layer = blueprint.layers.find((l) => l.name === layerName);
      if (layer) {
        // Untoggle all sections in this layer
        layer.sections.forEach((section) => {
          const sectionId = `${layerName}-${section.name}`;
          setSectionExpanded(sectionId, false);

          // Untoggle all components in each section
          section.components.forEach((component) => {
            setComponentExpanded(component.name, false);
          });
        });
      }
    }
  };

  const handleToggleAllInSection = (
    layerName: string,
    sectionName: string,
    expanded: boolean
  ) => {
    const sectionId = `${layerName}-${sectionName}`;
    setSectionExpanded(sectionId, expanded);

    // Only untoggle children when parent is untoggled
    if (!expanded) {
      // Find the section
      const layer = blueprint.layers.find((l) => l.name === layerName);
      if (layer) {
        const section = layer.sections.find((s) => s.name === sectionName);
        if (section) {
          // Untoggle all components in this section
          section.components.forEach((component) => {
            setComponentExpanded(component.name, false);
          });
        }
      }
    }
  };

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
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={expandedLayers[layer.name] || false}
                        onCheckedChange={(checked) =>
                          handleToggleAllInLayer(layer.name, checked)
                        }
                      />
                      <span>{formatLayerName(layer.name)}</span>
                    </div>
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
                        {layer.sections.map((section) => {
                          const sectionId = `${layer.name}-${section.name}`;
                          return (
                            <SidebarMenuSubItem key={section.name}>
                              <SidebarMenuSubButton asChild>
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={
                                        expandedSections[sectionId] || false
                                      }
                                      onCheckedChange={(checked) =>
                                        handleToggleAllInSection(
                                          layer.name,
                                          section.name,
                                          checked
                                        )
                                      }
                                    />
                                    <a href={`#${sectionId}`}>
                                      {formatSectionName(section.name)}
                                    </a>
                                  </div>
                                </div>
                              </SidebarMenuSubButton>
                              {section.components?.length ? (
                                <SidebarMenuSub>
                                  {section.components.map((component) => (
                                    <SidebarMenuSubItem key={component.name}>
                                      <SidebarMenuSubButton asChild>
                                        <div className="flex items-center justify-between w-full">
                                          <div className="flex items-center gap-2">
                                            <Switch
                                              checked={
                                                expandedComponents[
                                                  component.name
                                                ] || false
                                              }
                                              onCheckedChange={(checked) =>
                                                setComponentExpanded(
                                                  component.name,
                                                  checked
                                                )
                                              }
                                            />
                                            <a href={`#${component.name}`}>
                                              {component.name}
                                            </a>
                                          </div>
                                        </div>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              ) : null}
                            </SidebarMenuSubItem>
                          );
                        })}
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
