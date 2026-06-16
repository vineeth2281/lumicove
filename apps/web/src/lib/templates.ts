import { NodeData } from "@/components/Canvas";

export const templates = {
  blank: [],
  meetingNotes: [
    {
      id: "meeting-1",
      x: 100,
      y: 100,
      z: 1,
      width: 400,
      height: 600,
      content: "<h1>Meeting Notes</h1><p>Date: </p><p>Attendees: </p><h2>Agenda</h2><ul><li>Item 1</li></ul>",
    }
  ],
  kanban: [
    { id: "board-1", x: 100, y: 100, z: 1, width: 300, content: "<h2>To Do</h2>" },
    { id: "board-2", x: 450, y: 100, z: 1, width: 300, content: "<h2>In Progress</h2>" },
    { id: "board-3", x: 800, y: 100, z: 1, width: 300, content: "<h2>Done</h2>" },
  ]
};

export const cloneTemplate = (templateName: keyof typeof templates): NodeData[] => {
  const tpl = templates[templateName] || [];
  return tpl.map(node => ({
    ...node,
    id: `${node.id}-${Date.now()}`
  })) as any;
};
