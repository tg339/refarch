"use client";
import React, { useCallback, useEffect, useState, ComponentType } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  useEdgesState,
  useNodesState,
  addEdge,
  Panel,
  useReactFlow,
  Connection,
  EdgeTypes,
  BackgroundVariant,
  ReactFlowProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useBlueprintStore } from "@/lib/stores/blueprint-store";
import { ArchitectureBlueprint } from "@/lib/utils/blueprint-parser";
import { CustomNode } from "./architecture-node";

// Define custom node types using our CustomNode component
const nodeTypes: NodeTypes = { custom: CustomNode };

// Define custom edge types
const edgeTypes: EdgeTypes = {};

// Define heights for each depth
const layerNodeHeight = 200;
const sectionNodeHeight = 120;
const componentNodeHeight = 64;

interface ArchitectureVisualizerProps {
  blueprint?: ArchitectureBlueprint;
}

export function ArchitectureVisualizer({
  blueprint,
}: ArchitectureVisualizerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { fitView } = useReactFlow();
  const [isMinimapVisible, setIsMinimapVisible] = useState(true);

  const { expandedLayers, expandedSections, expandedComponents } =
    useBlueprintStore();

  // Helper function to generate nodes based on expanded state
  const generateNodesFromBlueprint = useCallback(
    (
      bp: ArchitectureBlueprint,
      expLayers: Record<string, boolean>,
      expSections: Record<string, boolean>,
      expComponents: Record<string, boolean>
    ): Node[] => {
      const newNodes: Node[] = [];
      let layerYOffset = 50;
      const layerX = 50;
      const sectionXOffset = 50;
      const componentXOffset = 50;
      const verticalSpacing = 50; // Spacing between elements within a parent
      const layerHeight = 100; // Base height, will grow with children
      const sectionHeight = 80;
      const componentHeight = 60;
      const nodeWidth = 250;
      const layerWidth = 1000; // Make layers wide

      bp.layers.forEach((layer, layerIndex) => {
        const layerId = `layer-${layer.name}`;
        if (expLayers[layer.name]) {
          // Add layer node
          newNodes.push({
            id: layerId,
            type: "custom",
            position: { x: layerX, y: layerYOffset },
            data: { label: `${layer.name} Layer`, depth: 0 },
            style: {
              borderRadius: "8px",
              width: layerWidth,
              height: `${layerNodeHeight}px`,
              boxSizing: "border-box",
              textAlign: "center",
              fontWeight: "bold",
            },
            // Indicate it's a parent node for layout purposes
            // className: 'layer-node', // Add class for potential future styling
          });
          // Distribute sections evenly inside the layer
          const activeSections = layer.sections.filter(
            (sec) => expSections[`${layer.name}-${sec.name}`]
          );
          const secCount = activeSections.length;
          if (secCount > 0) {
            const secWidth = nodeWidth;
            // Calculate margins so children are spaced evenly
            const totalSecWidth = secCount * secWidth;
            const secMargin = (layerWidth - totalSecWidth) / (secCount + 1);
            // Sections positioned relative to the layer node
            activeSections.forEach((section, idx) => {
              const sectionId = `section-${layer.name}-${section.name}`;
              const secX = secMargin * (idx + 1) + secWidth * idx;
              // Position sections inside the layer with a fixed top offset
              const secY = verticalSpacing;
              newNodes.push({
                id: sectionId,
                type: "custom",
                position: { x: secX, y: secY },
                data: { label: `${section.name} Section`, depth: 1 },
                parentId: layerId,
                extent: "parent",
                style: {
                  width: secWidth,
                  height: `${sectionNodeHeight}px`,
                  boxSizing: "border-box",
                },
              });
              // Distribute components evenly inside the section
              const activeComps = section.components.filter(
                (comp) => expComponents[comp.name]
              );
              const compCount = activeComps.length;
              if (compCount > 0) {
                const compWidth = nodeWidth - componentXOffset * 2;
                const totalCompWidth = compCount * compWidth;
                const compMargin =
                  (secWidth - totalCompWidth) / (compCount + 1);
                activeComps.forEach((component, jdx) => {
                  const compId = `component-${component.name}`;
                  const compX = compMargin * (jdx + 1) + compWidth * jdx;
                  // Position components inside the section with the same top offset
                  const compY = verticalSpacing;
                  newNodes.push({
                    id: compId,
                    type: "custom",
                    position: { x: compX, y: compY },
                    data: { label: component.name, depth: 2 },
                    parentId: sectionId,
                    extent: "parent",
                    style: {
                      width: compWidth,
                      height: `${componentNodeHeight}px`,
                      boxSizing: "border-box",
                    },
                  });
                });
              }
            });
          }
          // Move to next layer vertically
          layerYOffset += layerHeight + verticalSpacing;
        }
      });

      return newNodes;
    },
    [] // No dependencies needed for the function definition itself
  );

  // Helper function to generate edges based on expanded state
  const generateEdgesFromBlueprint = useCallback(
    (
      bp: ArchitectureBlueprint,
      expLayers: Record<string, boolean>,
      expSections: Record<string, boolean>,
      expComponents: Record<string, boolean>
    ): Edge[] => {
      // No parent-child edges needed
      return [];
    },
    [] // No dependencies needed for the function definition itself
  );

  // Recalculate nodes and edges when blueprint or expanded states change
  useEffect(() => {
    if (blueprint) {
      const newNodes = generateNodesFromBlueprint(
        blueprint,
        expandedLayers,
        expandedSections,
        expandedComponents
      );
      const newEdges = generateEdgesFromBlueprint(
        blueprint,
        expandedLayers,
        expandedSections,
        expandedComponents
      );
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [
    blueprint,
    expandedLayers,
    expandedSections,
    expandedComponents,
    generateNodesFromBlueprint,
    generateEdgesFromBlueprint,
    setNodes,
    setEdges,
  ]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const toggleMinimap = useCallback(() => {
    setIsMinimapVisible((prev) => !prev);
  }, []);

  // Fit view when nodes change (might need debouncing for performance)
  useEffect(() => {
    if (nodes.length > 0) {
      // Adding a small delay to allow layout adjustments
      const timer = setTimeout(() => fitView({ padding: 0.2 }), 100);
      return () => clearTimeout(timer);
    }
  }, [nodes, fitView]);

  if (!blueprint) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Loading blueprint...
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        attributionPosition="bottom-right"
        minZoom={0.1}
        maxZoom={2.5} // Increased maxZoom
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        nodesDraggable={true} // Allow dragging
        nodesConnectable={false} // Usually don't connect architecture blocks manually
        elementsSelectable={true}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        {isMinimapVisible && <MiniMap nodeStrokeWidth={3} zoomable pannable />}
        <Panel position="top-right" className="bg-white p-2 rounded shadow">
          <button
            onClick={toggleMinimap}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            {isMinimapVisible ? "Hide Minimap" : "Show Minimap"}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
