import type { GeoLike, HeadingLike } from "../types";

// Placeholder “air quality” model. Later: pull nearest station from public APIs.
export function drawAir(
  ctx: CanvasRenderingContext2D,
  { w, h }: { w: number; h: number; dpr: number },
  geo: GeoLike,
  _heading: HeadingLike,
  now: number,
) {
  ctx.save();

  const t = now * 0.001;
  const base = geo.status === "ready" ? (Math.abs(Math.sin(geo.lat + geo.lon)) * 40 + 10) : 25;
  const pm = base + Math.sin(t) * 6; // µg/m3 (fake)

  // a thin “readout” column on right
  const x = w - 18;
  const y0 = h * 0.55;
  const H = h * 0.22;

  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y0);
  ctx.lineTo(x, y0 + H);
  ctx.stroke();

  const v = Math.max(0, Math.min(1, pm / 80));
  const y = y0 + H * (1 - v);

  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + 2, y);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  const txt = `PM2.5 ${pm.toFixed(1)} µg/m³`;
  ctx.fillText(txt, w - 18 - ctx.measureText(txt).width, y0 - 18);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText("AIR (placeholder)", w - 18 - ctx.measureText("AIR (placeholder)").width, y0 - 36);

  ctx.restore();
}
