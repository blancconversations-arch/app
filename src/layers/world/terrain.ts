import type { GeoLike, HeadingLike } from "../types";

// This is a *visual* topo placeholder. Real topo can be fetched from public DEM tiles later.
export function drawTerrain(
  ctx: CanvasRenderingContext2D,
  { w, h }: { w: number; h: number; dpr: number },
  _geo: GeoLike,
  heading: HeadingLike,
  now: number,
) {
  ctx.save();
  const hdg = heading.status === "ready" ? heading.deg : 0;
  const t = now * 0.00015;

  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1;

  const baseY = h * 0.62;
  const bands = 10;

  for (let b = 0; b < bands; b++) {
    const y = baseY + b * 18;
    ctx.beginPath();
    const amp = 10 + b * 2;
    for (let x = 0; x <= w; x += 14) {
      const n = Math.sin(x * 0.014 + t + b * 0.4) + Math.sin(x * 0.008 + t * 0.7 + hdg * 0.02);
      const yy = y + n * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  // label
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.fillText("TOPO (visual)", 18, h * 0.56);

  ctx.restore();
}
