"use client";

import React, { useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface MediaDropzoneProps {
  onImageDropped: (url: string, x: number, y: number) => void;
  children: React.ReactNode;
}

export const MediaDropzone: React.FC<MediaDropzoneProps> = ({ onImageDropped, children }) => {
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));

    for (const file of imageFiles) {
      const fileName = `${Date.now()}-${file.name}`;

      const { data, error } = await supabase.storage
        .from('workspace_media')
        .upload(fileName, file);

      if (error) {
        console.error("Upload failed", error);
        continue;
      }

      if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('workspace_media')
          .getPublicUrl(data.path);

        onImageDropped(publicUrl, e.clientX, e.clientY);
      }
    }
  }, [onImageDropped]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="w-full h-full relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {children}
    </div>
  );
};
