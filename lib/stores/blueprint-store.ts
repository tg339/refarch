import { create } from "zustand";

interface BlueprintState {
  expandedLayers: Record<string, boolean>;
  expandedComponents: Record<string, boolean>;
  toggleLayer: (layerName: string) => void;
  toggleComponent: (componentName: string) => void;
  setLayerExpanded: (layerName: string, expanded: boolean) => void;
  setComponentExpanded: (componentName: string, expanded: boolean) => void;
  resetState: () => void;
}

export const useBlueprintStore = create<BlueprintState>((set) => ({
  expandedLayers: {},
  expandedComponents: {},

  toggleLayer: (layerName) =>
    set((state) => ({
      expandedLayers: {
        ...state.expandedLayers,
        [layerName]: !state.expandedLayers[layerName],
      },
    })),

  toggleComponent: (componentName) =>
    set((state) => ({
      expandedComponents: {
        ...state.expandedComponents,
        [componentName]: !state.expandedComponents[componentName],
      },
    })),

  setLayerExpanded: (layerName, expanded) =>
    set((state) => ({
      expandedLayers: {
        ...state.expandedLayers,
        [layerName]: expanded,
      },
    })),

  setComponentExpanded: (componentName, expanded) =>
    set((state) => ({
      expandedComponents: {
        ...state.expandedComponents,
        [componentName]: expanded,
      },
    })),

  resetState: () =>
    set({
      expandedLayers: {},
      expandedComponents: {},
    }),
}));
