import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";
import { WebrtcProvider } from "y-webrtc";

export const initSync = (roomName: string) => {
  const ydoc = new Y.Doc();

  // Local caching via Dexie/IndexedDB via y-indexeddb
  const providerLocal = new IndexeddbPersistence(roomName, ydoc);

  // Real-time via WebRTC (could also be Supabase Realtime channel if we write a custom provider)
  // Using y-webrtc as a stand-in for immediate multiplayer sync
  const providerWebRTC = new WebrtcProvider(roomName, ydoc, {
    signaling: ['wss://signaling.yjs.dev']
  });

  const awareness = providerWebRTC.awareness;

  return { ydoc, awareness, providerLocal, providerWebRTC };
};
