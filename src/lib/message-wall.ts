export const MESSAGE_WALL_REFRESH_EVENT = "message-wall-refresh";
export const MESSAGE_WALL_REFRESH_STORAGE_KEY = "lucas_vanessa_message_wall_refresh";

export function notifyMessageWallChanged() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(MESSAGE_WALL_REFRESH_EVENT));

  try {
    window.localStorage.setItem(
      MESSAGE_WALL_REFRESH_STORAGE_KEY,
      `${Date.now()}:${Math.random().toString(36).slice(2)}`,
    );
  } catch {
    // The same-tab event above is enough when storage is unavailable.
  }
}
