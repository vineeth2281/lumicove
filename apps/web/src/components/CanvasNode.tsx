"use client";

import React from "react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CanvasNodeProps {
  id: string;
  x: number;
  y: number;
  z: number;
  width?: number;
  height?: number;
  onPositionChange?: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
  className?: string;
}

export const CanvasNode: React.FC<CanvasNodeProps> = ({
  id,
  x,
  y,
  z,
  width,
  height,
  onPositionChange,
  children,
  className,
}) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ x, y, zIndex: z }}
      onDragEnd={(e, info) => {
        if (onPositionChange) {
          onPositionChange(id, x + info.offset.x, y + info.offset.y);
        }
      }}
      style={{
        position: "absolute",
        width: width,
        height: height,
        zIndex: z,
      }}
      className={cn("bg-white border shadow-sm rounded-md group relative", className)}
    >
      {children}
      {/* Edge resize handles */}
      <div className="absolute right-0 bottom-0 w-3 h-3 bg-blue-500 cursor-se-resize rounded-br-sm opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};
