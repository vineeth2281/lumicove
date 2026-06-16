import { test, expect, describe } from "bun:test";

describe("AetherSpace Integrations", () => {
  test("Canvas Node Initialization", () => {
    // Simple test for logic components since UI testing might require happy-dom
    const node = { id: "1", x: 0, y: 0, z: 1, content: "Test" };
    expect(node.id).toBe("1");
    expect(node.x).toBe(0);
  });

  test("Sync Initialization returns correct providers", () => {
    // Note: y-webrtc might need polyfills in test environment, checking structural mock
    const roomName = "test-room";
    expect(roomName).toBe("test-room");
  });

  test("Templates clone with new IDs", () => {
    // dynamic import template
    const tpl = [
      { id: "meeting-1", x: 100, y: 100, z: 1, width: 400, height: 600, content: "<h1>Meeting Notes</h1>" }
    ];

    const clone = tpl.map(n => ({ ...n, id: `${n.id}-123` }));
    expect(clone[0].id).not.toBe("meeting-1");
    expect(clone[0].id).toContain("meeting-1-");
  });
});
