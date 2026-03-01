import type { GeoLike, HeadingLike, Layer } from "./types";
import { drawGrid } from "./system/grid";
import { drawHUD } from "./system/hud";
import { drawTerrain } from "./world/terrain";
import { drawAir } from "./world/air";
import { drawCivic } from "./world/civic";

export type LayerId = "hud" | "grid" | "terrain" | "air" | "civic";

export const LAYERS: Array<{ id: LayerId; label: string }> = [
  { id: "hud", label: "HUD" },
  { id: "grid", label: "Grid" },
  { id: "terrain", label: "Topo" },
  { id: "air", label: "Air" },
  { id: "civic", label: "Civic" },
];

export const defaultEnabled: Record<LayerId, boolean> = {
  hud: true,
  grid: true,
  terrain: true,
  air: false,
  civic: false,
};

export const layerImpl: Record<LayerId, Layer> = {
  hud: { id: "hud", draw: drawHUD },
  grid: { id: "grid", draw: drawGrid },
  terrain: { id: "terrain", draw: drawTerrain },
  air: { id: "air", draw: drawAir },
  civic: { id: "civic", draw: drawCivic },
};

export function drawLayers(
  ctx: CanvasRenderingContext2D,
  dims: { w: number; h: number; dpr: number },
  geo: GeoLike,
  heading: HeadingLike,
  enabled: LayerId[],
  now: number,
) {
  for (const id of enabled) {
    layerImpl[id].draw(ctx, dims, geo, heading, now);
  }
}
