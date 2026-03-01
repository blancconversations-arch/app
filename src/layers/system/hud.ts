import type { GeoLike, HeadingLike } from "../types";

function pad(n: number, w: number) {
  const s = String(n);
  return s.length >= w ? s : "0".repeat(w - s.length) + s;
}

export function drawHUD(
  ctx: CanvasRenderingContext2D,
  { w, h }: { w: number; h: number; dpr: number },
  geo: GeoLike,
  heading: HeadingLike,
  now: number,
) {
  const date = new Date(now);
  const time = `${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(date.getSeconds(), 2)}`;

  ctx.save();

  // corners
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;

  const m = 18;
  const L = 22;

  const corners = [
    [m, m, +1, +1],
    [w - m, m, -1, +1],
    [m, h - m, +1, -1],
    [w - m, h - m, -1, -1],
  ] as const;

  for (const [x, y, sx, sy] of corners) {
    ctx.beginPath();
    ctx.moveTo(x, y + sy * L);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * L, y);
    ctx.stroke();
  }

  // center reticle
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.moveTo(cx - 32, cy);
  ctx.lineTo(cx - 12, cy);
  ctx.moveTo(cx + 12, cy);
  ctx.lineTo(cx + 32, cy);
  ctx.moveTo(cx, cy - 32);
  ctx.lineTo(cx, cy - 12);
  ctx.moveTo(cx, cy + 12);
  ctx.lineTo(cx, cy + 32);
  ctx.stroke();

  // text
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
  ctx.textBaseline = "top";

  ctx.fillText(`T ${time}`, m, m + 10);

  const hdgTxt =
    heading.status === "ready" ? `HDG ${Math.round(heading.deg)}°` : `HDG ${heading.status.toUpperCase()}`;
  ctx.fillText(hdgTxt, w - m - ctx.measureText(hdgTxt).width, m + 10);

  const geoTxt =
    geo.status === "ready"
      ? `GEO ${geo.lat.toFixed(5)}, ${geo.lon.toFixed(5)} ±${Math.round(geo.accuracyM)}m`
      : `GEO ${geo.status.toUpperCase()}`;
  ctx.fillText(geoTxt, m, h - m - 24);

  ctx.restore();
}
