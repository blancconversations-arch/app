import type { GeoLike, HeadingLike } from "../types";

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  { w, h }: { w: number; h: number; dpr: number },
  _geo: GeoLike,
  heading: HeadingLike,
  now: number,
) {
  // Subtle perspective grid, lightly influenced by heading.
  const t = now * 0.00008;
  const hdg = heading.status === "ready" ? (heading.deg * Math.PI) / 180 : 0;
  const drift = Math.sin(t + hdg) * 8;

  ctx.save();
  ctx.globalAlpha = 0.8;

  // horizon line
  const horizonY = h * 0.42;
  ctx.strokeStyle = "rgba(255,255,255,0.10)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(w, horizonY);
  ctx.stroke();

  // vertical lines converging
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  const vanX = w / 2 + drift;
  const vanY = horizonY - 20;
  const count = 14;
  for (let i = -count; i <= count; i++) {
    const x = (w / 2) + i * (w / (count * 3));
    ctx.beginPath();
    ctx.moveTo(x, h);
    ctx.lineTo(vanX, vanY);
    ctx.stroke();
  }

  // horizontal lines (perspective)
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  for (let j = 0; j < 18; j++) {
    const p = j / 18;
    const y = horizonY + (h - horizonY) * (p * p);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  ctx.restore();
}
