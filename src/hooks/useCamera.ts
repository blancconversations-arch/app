import { useEffect, useRef, useState } from "react";

type Facing = "user" | "environment";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [on, setOn] = useState(false);
  const [facing, setFacing] = useState<Facing>("environment");
  const [error, setError] = useState<string | null>(null);

  async function start(nextFacing: Facing = facing) {
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: nextFacing } },
        audio: false,
      });
      setStream(s);
      setOn(true);

      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (e: any) {
      setError(e?.message ?? "Failed to start camera.");
      setOn(false);
    }
  }

  function stop() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setOn(false);
  }

  function toggle() {
    if (on) stop();
    else void start();
  }

  function switchFacing() {
    const next: Facing = facing === "environment" ? "user" : "environment";
    setFacing(next);
    if (on) {
      stop();
      void start(next);
    }
  }

  useEffect(() => {
    // Autostart on load (best effort)
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      void start("environment");
    } else {
      setError("Camera API not available in this browser.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { videoRef, on, error, toggle, switchFacing };
}
