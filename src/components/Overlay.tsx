import React, { useEffect, useMemo, useRef } from "react";
import type { GeoLike, HeadingLike } from "../layers/types";
import { drawLayers, LayerId } from "../layers/registry";

export function Overlay(props: {
  width: string | number;
  height: string | number;
  geo: GeoLike;
  heading: HeadingLike;
  enabledLayers: LayerId[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const enabledKey = useMemo(() => props.enabledLayers.join(","), [props.enabledLayers]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const loop = (t: number) => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

      // clear
      ctx.clearRect(0, 0, w, h);

      // draw
      drawLayers(ctx, { w, h, dpr }, props.geo, props.heading, props.enabledLayers, t);

      raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.geo, props.heading, enabledKey]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: props.width, height: props.height, pointerEvents: "none" }}
    />
  );
}
