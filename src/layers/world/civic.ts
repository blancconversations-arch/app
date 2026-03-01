import type { GeoLike, HeadingLike } from "../types";

// Placeholder civic labels. Later: plug into cadastral/zoning/OSM/POI datasets.
export function drawCivic(
  ctx: CanvasRenderingContext2D,
  { w, h }: { w: number; h: number; dpr: number },
  geo: GeoLike,
  heading: HeadingLike,
  now: number,
) {
  ctx.save();

  const cx = w * 0.62;
  const cy = h * 0.40;

  // floating “tag”
  const t = now * 0.001;
  const bob = Math.sin(t) * 6;

  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;

  const label =
    geo.status === "ready"
      ? `ZONE: mixed use • ${geo.accuracyM < 40 ? "high fix" : "coarse fix"}`
      : "ZONE: unknown";

  const sub =
    heading.status === "ready" ? `permit layer • heading ${Math.round(heading.deg)}°` : "permit layer";

  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";

  const pad = 10;
  const w1 = ctx.measureText(label).width;
  const w2 = ctx.measureText(sub).width;
  const bw = Math.max(w1, w2) + pad * 2;
  const bh = 54;

  const x = cx - bw / 2;
  const y = cy - bh / 2 + bob;

  roundRect(ctx, x, y, bw, bh, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.fillText(label, x + pad, y + 12);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText(sub, x + pad, y + 30);

  // leader line
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.moveTo(cx, y + bh);
  ctx.lineTo(cx, y + bh + 28);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, y + bh + 34, 3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fill();

  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
