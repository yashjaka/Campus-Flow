import { useEffect } from "react";

const CHANNEL_NAME = "campusflow_live_sync";

// Safely obtain or instantiate BroadcastChannel
let channel: BroadcastChannel | null = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch {
    channel = null;
  }
}

export function broadcastSync(key: string, payload?: unknown) {
  if (typeof window === "undefined") return;

  const eventPayload = { key, timestamp: Date.now(), payload };

  // 1. Post to BroadcastChannel (for other tabs)
  if (channel) {
    try {
      channel.postMessage(eventPayload);
    } catch {
      // Ignore broadcast errors
    }
  }

  // 2. Dispatch a custom window event for the same tab/window
  window.dispatchEvent(
    new CustomEvent("campusflow_local_sync", { detail: eventPayload }),
  );
}

export function useStoreSync(keys: string | string[], onSync: () => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const targetKeys = Array.isArray(keys) ? keys : [keys];

    const handleMessage = (e: MessageEvent) => {
      if (e.data && targetKeys.includes(e.data.key)) {
        onSync();
      }
    };

    const handleLocal = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail && targetKeys.includes(custom.detail.key)) {
        onSync();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key && targetKeys.includes(e.key)) {
        onSync();
      }
    };

    if (channel) {
      channel.addEventListener("message", handleMessage);
    }
    window.addEventListener("campusflow_local_sync", handleLocal);
    window.addEventListener("storage", handleStorage);

    return () => {
      if (channel) {
        channel.removeEventListener("message", handleMessage);
      }
      window.removeEventListener("campusflow_local_sync", handleLocal);
      window.removeEventListener("storage", handleStorage);
    };
  }, [keys, onSync]);
}
