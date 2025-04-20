import React from "react";
import { Handle, NodeProps, Position, Node } from "@xyflow/react";
import { Label } from "@/components/ui/label";

// CustomNode uses data.depth to style different levels with Tailwind CSS colors
export function CustomNode(
  props: NodeProps<Node<{ label: string; depth: number }, "custom">> & {
    style?: React.CSSProperties;
    className?: string;
  }
) {
  const { data, style, className } = props;
  // Define background and border colors per depth
  const levelStyles = [
    "bg-gray-100 border-gray-300", // depth 0: layer
    "bg-gray-200 border-gray-400", // depth 1: section
    "bg-gray-300 border-gray-500", // depth 2: component
  ];

  // Height based on depth
  const styleClass = levelStyles[data.depth] || levelStyles[0];

  return (
    <div
      style={style}
      className={`${styleClass} ${
        className ?? ""
      } relative rounded shadow p-4 border`}
    >
      {/* Top-left label */}
      <div className="absolute top-2 left-2">
        <Label>{data.label}</Label>
      </div>
      {/* Connection handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
