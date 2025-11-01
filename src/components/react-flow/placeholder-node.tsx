// src/components/placeholder-node.tsx
import React, { forwardRef, ReactNode } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { BaseNode } from "./base-node";

export type PlaceholderNodeData = {
  label?: string;
};

export type PlaceholderNodeProps = Omit<NodeProps<PlaceholderNodeData>, "id" | "type"> & {
  children?: ReactNode;
  onClick?: () => void;
};

export const PlaceholderNode = forwardRef<HTMLDivElement, PlaceholderNodeProps>(
  ({ children, onClick }, ref) => {
    
    return (
      <BaseNode
        ref={ref}
        className="w-auto h-auto border-dashed border-gray-400 bg-card p-4 text-center text-gray-400 shadow-none cursor-pointer hover:border-gray-500 hover:bg-gray-50"
        onClick={onClick}
        aria-label="Add node"
        role="button"
      >
        <span className="text-2xl leading-none">{children ?? "+"}</span>

        {/* вход */}
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={false}
        />
        {/* выход */}
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={false}
        />
      </BaseNode>
    );
  }
);

PlaceholderNode.displayName = "PlaceholderNode";
