"use client";

import React, { useState } from "react";
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react";

export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: TreeNode[];
}

interface SidebarProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
}

const TreeItem = ({ node, onSelect }: { node: TreeNode; onSelect?: (node: TreeNode) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pl-4">
      <div
        className="flex items-center gap-2 py-1 px-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded cursor-pointer text-sm"
        onClick={() => {
          if (node.type === "folder") setIsOpen(!isOpen);
          else if (onSelect) onSelect(node);
        }}
      >
        {node.type === "folder" ? (
          isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        ) : (
          <span className="w-[14px]" />
        )}
        {node.type === "folder" ? <Folder size={14} /> : <File size={14} />}
        <span>{node.name}</span>
      </div>
      {node.type === "folder" && isOpen && node.children && (
        <div className="ml-2 border-l border-neutral-300 dark:border-neutral-700">
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ data, onSelect }) => {
  return (
    <div className="w-64 h-full bg-neutral-100 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto py-4">
      <div className="px-4 mb-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        Workspace
      </div>
      {data.map((node) => (
        <TreeItem key={node.id} node={node} onSelect={onSelect} />
      ))}
    </div>
  );
};
