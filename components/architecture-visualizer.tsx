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

// Define custom node types
const nodeTypes: NodeTypes = {};

// Define custom edge types
const edgeTypes: EdgeTypes = {};

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

  // Initialize nodes and edges from blueprint
  useEffect(() => {
    if (blueprint) {
      const initialNodes = generateNodesFromBlueprint(blueprint);
      const initialEdges = generateEdgesFromBlueprint(blueprint);
      setNodes(initialNodes);
      setEdges(initialEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [blueprint, setNodes, setEdges]);

  // Update node visibility based on store state
  useEffect(() => {
    if (!blueprint) return;
    setNodes((nds) =>
      nds.map((node) => {
        const nodeId = node.id;

        // Handle layer nodes
        if (nodeId.startsWith("layer-")) {
          const layerName = nodeId.replace("layer-", "");
          return {
            ...node,
            hidden: !expandedLayers[layerName],
          };
        }

        // Handle section nodes
        if (nodeId.startsWith("section-")) {
          const sectionId = nodeId.replace("section-", "");
          return {
            ...node,
            hidden: !expandedSections[sectionId],
          };
        }

        // Handle component nodes
        if (nodeId.startsWith("component-")) {
          const componentName = nodeId.replace("component-", "");
          return {
            ...node,
            hidden: !expandedComponents[componentName],
          };
        }

        return node;
      })
    );
  }, [
    blueprint,
    expandedLayers,
    expandedSections,
    expandedComponents,
    setNodes,
  ]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const toggleMinimap = useCallback(() => {
    setIsMinimapVisible((prev) => !prev);
  }, []);

  // Helper function to generate nodes from blueprint
  const generateNodesFromBlueprint = (
    blueprint: ArchitectureBlueprint
  ): Node[] => {
    const nodes: Node[] = [];
    let yOffset = 0;
    const xSpacing = 300;
    const ySpacing = 150;

    // Add layers
    blueprint.layers.forEach((layer) => {
      nodes.push({
        id: `layer-${layer.name}`,
        type: "layer",
        position: { x: 50, y: yOffset },
        data: {
          label: layer.name,
          layer,
          type: "layer",
        },
        style: {
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          padding: "10px",
          width: 200,
          fontWeight: "bold",
        },
      });

      yOffset += ySpacing;

      // Add sections for each layer
      layer.sections.forEach((section) => {
        const sectionId = `${layer.name}-${section.name}`;
        nodes.push({
          id: `section-${sectionId}`,
          type: "section",
          position: { x: 50 + xSpacing, y: yOffset },
          data: {
            label: section.name,
            section,
            type: "section",
          },
          style: {
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            padding: "10px",
            width: 200,
          },
        });

        yOffset += ySpacing;

        // Add components for each section
        section.components.forEach((component) => {
          nodes.push({
            id: `component-${component.name}`,
            type: "component",
            position: { x: 50 + xSpacing * 2, y: yOffset },
            data: {
              label: component.name,
              component,
              type: "component",
            },
            style: {
              background: "#ffffff",
              border: "1px solid #94a3b8",
              borderRadius: "8px",
              padding: "10px",
              width: 200,
            },
          });

          yOffset += ySpacing;
        });
      });
    });

    return nodes;
  };

  // Helper function to generate edges from blueprint
  const generateEdgesFromBlueprint = (
    blueprint: ArchitectureBlueprint
  ): Edge[] => {
    const edges: Edge[] = [];

    // Add edges between layers and sections
    blueprint.layers.forEach((layer) => {
      layer.sections.forEach((section) => {
        const sectionId = `${layer.name}-${section.name}`;
        edges.push({
          id: `edge-layer-${layer.name}-section-${sectionId}`,
          source: `layer-${layer.name}`,
          target: `section-${sectionId}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#94a3b8" },
        });

        // Add edges between sections and components
        section.components.forEach((component) => {
          edges.push({
            id: `edge-section-${sectionId}-component-${component.name}`,
            source: `section-${sectionId}`,
            target: `component-${component.name}`,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#94a3b8" },
          });
        });
      });
    });

    return edges;
  };

  // Conditionally render ReactFlow only if blueprint exists
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
        fitView
        attributionPosition="bottom-right"
        minZoom={0.1}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        {isMinimapVisible && <MiniMap />}
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
