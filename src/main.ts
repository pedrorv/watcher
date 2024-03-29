import {
  DragTracker,
  KeyboardTracker,
  MouseTracker,
  UITracker,
  WindowTracker,
} from "@/trackers";
import { setAppId, setDryRun, setServerUrl } from "@/utils/common";
import { debounce, throttle } from "@/utils/function";

export { getSessionId } from "@/utils/common";
export { getEvents } from "@/utils/logger";

const TRACKERS = [WindowTracker, DragTracker, KeyboardTracker, MouseTracker];
const debouncedUITrack = debounce(UITracker.track, 100);
const throttledUITrack = throttle(UITracker.track, 100);

let domObserver: MutationObserver;
export const init = async (
  appId: string,
  serverUrl: string,
  isDryRun = false
) => {
  setAppId(appId);
  setServerUrl(serverUrl);
  setDryRun(isDryRun);

  if (MutationObserver) {
    domObserver = new MutationObserver((mutations: MutationRecord[]) => {
      mutations.forEach((m) => {
        if (m.type === "attributes") {
          throttledUITrack();
        } else {
          const alteredNodes = [
            ...Array.from(m.addedNodes),
            ...Array.from(m.removedNodes),
          ].filter((node) => {
            if (node.nodeName === "SCRIPT") return false;
            if ((node as any)?.getAttribute?.("data-watcher") === "true")
              return false;

            return true;
          });
          const hasAlteredVisualElements = !!alteredNodes.length;
          if (hasAlteredVisualElements) {
            throttledUITrack();
          }
        }
      });
    });

    domObserver.disconnect();
    domObserver.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  } else {
    setInterval(() => UITracker.track(), 1000);
  }

  if (!isDryRun) {
    await UITracker.track();
  }
  TRACKERS.forEach((tracker) =>
    tracker.eventNames.forEach((name) => {
      tracker.listenerElement.removeEventListener(name, tracker.track);
      tracker.listenerElement.addEventListener(name, tracker.track);
    })
  );

  window.removeEventListener("resize", debouncedUITrack);
  window.addEventListener("resize", debouncedUITrack);
};

export const stop = () => {
  domObserver?.disconnect();
  TRACKERS.forEach((tracker) =>
    tracker.eventNames.forEach((name) => {
      tracker.listenerElement.removeEventListener(name, tracker.track);
    })
  );
  window.removeEventListener("resize", debouncedUITrack);
};
