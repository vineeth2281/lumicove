"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { CanvasNode } from "./CanvasNode";
import { initSync } from "sync";

export interface NodeData {
  id: string;
  x: number;
  y: number;
  z: number;
  width?: number;
  height?: number;
  content: React.ReactNode;
}

interface CanvasProps {
  initialNodes?: NodeData[];
  onNodesChange?: (nodes: NodeData[]) => void;
  children?: React.ReactNode;
}

export const Canvas: React.FC<CanvasProps> = ({
  initialNodes = [],
  onNodesChange,
  children,
}) => {
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
  const [cursors, setCursors] = useState<{ id: number; x: number; y: number }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize sync for multiplayer cursors
    const { awareness } = initSync("aetherspace-room");

    awareness.on("change", () => {
      const states = Array.from(awareness.getStates().entries());
      const activeCursors = states
        .filter(([id, state]) => id !== awareness.clientID && state.cursor)
        .map(([id, state]) => ({ id, ...state.cursor }));
      setCursors(activeCursors);
    });

    const handleMouseMove = (e: MouseEvent) => {
      awareness.setLocalStateField("cursor", { x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handlePositionChange = (id: string, x: number, y: number) => {
    const updated = nodes.map((node) =>
      node.id === id ? { ...node, x, y } : node
    );
    setNodes(updated);
    if (onNodesChange) onNodesChange(updated);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-neutral-100 dark:bg-neutral-900"
      style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #ccc 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}
    >
      <motion.div
        drag
        dragMomentum={false}
        className="absolute inset-0 w-[5000px] h-[5000px] origin-top-left"
        style={{ x: 0, y: 0 }}
      >
        {nodes.map((node) => (
          <CanvasNode
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            z={node.z}
            width={node.width}
            height={node.height}
            onPositionChange={handlePositionChange}
          >
            {node.content}
          </CanvasNode>
        ))}

        {/* Render multiplayer cursors */}
        {cursors.map((cursor) => (
          <div
            key={cursor.id}
            className="absolute pointer-events-none z-50 flex items-center"
            style={{
              left: cursor.x,
              top: cursor.y,
            }}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm" />
            <span className="ml-2 px-1 py-0.5 text-xs text-white bg-red-500 rounded opacity-75">
              User {cursor.id.toString().slice(-4)}
            </span>
          </div>
        ))}

        {children}
      </motion.div>
    </div>
  );
};
