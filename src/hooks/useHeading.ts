import { useEffect, useState } from "react";

type HeadingState =
  | { status: "idle" | "loading" }
  | { status: "ready"; deg: number }
  | { status: "error"; message: string };

function normalize(deg: number) {
  const d = deg % 360;
  return d < 0 ? d + 360 : d;
}

export function useHeading(): HeadingState {
  const [state, setState] = useState<HeadingState>({ status: "idle" });

  useEffect(() => {
    const w = window as any;
    const hasDeviceOrientation = "DeviceOrientationEvent" in window;
    if (!hasDeviceOrientation) {
      setState({ status: "error", message: "Heading not available." });
      return;
    }

    setState({ status: "loading" });

    const requestPerm = async () => {
      // iOS requires explicit permission
      if (typeof w.DeviceOrientationEvent?.requestPermission === "function") {
        try {
          const res = await w.DeviceOrientationEvent.requestPermission();
          if (res !== "granted") {
            setState({ status: "error", message: "Heading permission denied." });
            return;
          }
        } catch (e: any) {
          setState({ status: "error", message: e?.message ?? "Heading permission error." });
          return;
        }
      }

      const handler = (ev: DeviceOrientationEvent) => {
        // alpha: 0..360 (compass-ish), but implementation varies
        if (typeof ev.alpha === "number") setState({ status: "ready", deg: normalize(ev.alpha) });
      };

      window.addEventListener("deviceorientation", handler, true);
      return () => window.removeEventListener("deviceorientation", handler, true);
    };

    let cleanup: undefined | (() => void);
    void requestPerm().then((c) => (cleanup = c));
    return () => cleanup?.();
  }, []);

  return state;
}
