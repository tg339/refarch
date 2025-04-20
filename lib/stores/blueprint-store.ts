import { create } from "zustand";

interface BlueprintState {
  expandedLayers: Record<string, boolean>;
  expandedSections: Record<string, boolean>;
  expandedComponents: Record<string, boolean>;
  toggleLayer: (layerName: string) => void;
  toggleSection: (sectionName: string) => void;
  toggleComponent: (componentName: string) => void;
  setLayerExpanded: (layerName: string, expanded: boolean) => void;
  setSectionExpanded: (sectionName: string, expanded: boolean) => void;
  setComponentExpanded: (componentName: string, expanded: boolean) => void;
  toggleAllInLayer: (layerName: string, expanded: boolean) => void;
  toggleAllInSection: (sectionName: string, expanded: boolean) => void;
  resetState: () => void;
}

export const useBlueprintStore = create<BlueprintState>((set) => ({
  expandedLayers: {},
  expandedSections: {},
  expandedComponents: {},

  toggleLayer: (layerName) =>
    set((state) => ({
      expandedLayers: {
        ...state.expandedLayers,
        [layerName]: !state.expandedLayers[layerName],
      },
    })),

  toggleSection: (sectionName) =>
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [sectionName]: !state.expandedSections[sectionName],
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

  setSectionExpanded: (sectionName, expanded) =>
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [sectionName]: expanded,
      },
    })),

  setComponentExpanded: (componentName, expanded) =>
    set((state) => ({
      expandedComponents: {
        ...state.expandedComponents,
        [componentName]: expanded,
      },
    })),

  toggleAllInLayer: (layerName, expanded) =>
    set((state) => {
      // This is a placeholder - the actual implementation is in the component
      // where we have access to the blueprint data
      return state;
    }),

  toggleAllInSection: (sectionName, expanded) =>
    set((state) => {
      // This is a placeholder - the actual implementation is in the component
      // where we have access to the blueprint data
      return state;
    }),

  resetState: () =>
    set({
      expandedLayers: {},
      expandedSections: {},
      expandedComponents: {},
    }),
}));
