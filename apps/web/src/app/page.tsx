"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Canvas, NodeData } from "@/components/Canvas";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";
import { MediaDropzone } from "@/components/MediaDropzone";
import { Editor } from "@/components/Editor";

export default function Home() {
  const [zoomedIn, setZoomedIn] = useState(false);
  const [nodes, setNodes] = useState<NodeData[]>([
    {
      id: "editor-1",
      x: 100,
      y: 100,
      z: 1,
      width: 600,
      height: 400,
      content: <Editor initialContent="<h1>AetherSpace Docs</h1><p>Start writing here...</p>" />,
    },
  ]);

  const handleImageDrop = (url: string, x: number, y: number) => {
    setNodes((prev) => [
      ...prev,
      {
        id: `img-${Date.now()}`,
        x,
        y,
        z: prev.length + 1,
        width: 300,
        content: <img src={url} alt="dropped media" className="w-full h-auto rounded-md pointer-events-none" />,
      },
    ]);
  };

  if (zoomedIn) {
    return (
      <main className="w-screen h-screen flex overflow-hidden">
        <Sidebar
          data={[
            {
              id: "ws-1",
              name: "Personal Workspace",
              type: "folder",
              children: [
                { id: "doc-1", name: "Roadmap", type: "file" },
                { id: "doc-2", name: "Meeting Notes", type: "file" },
              ],
            },
          ]}
        />
        <div className="flex-1 relative">
          <CommandPalette />
          <MediaDropzone onImageDropped={handleImageDrop}>
            <Canvas initialNodes={nodes} onNodesChange={setNodes} />
          </MediaDropzone>
        </div>
      </main>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black w-screen h-screen">
      <motion.div
        layoutId="workspace"
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
          AetherSpace
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          The infinite spatial workspace.
        </p>
        <button
          onClick={() => setZoomedIn(true)}
          className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium transition-transform hover:scale-105"
        >
          Enter Workspace
        </button>
      </motion.div>
    </div>
  );
}
