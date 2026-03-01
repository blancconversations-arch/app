export type GeoLike =
  | { status: "idle" | "loading" }
  | { status: "ready"; lat: number; lon: number; accuracyM: number }
  | { status: "error"; message: string };

export type HeadingLike =
  | { status: "idle" | "loading" }
  | { status: "ready"; deg: number }
  | { status: "error"; message: string };

export type Layer = {
  id: string;
  draw: (
    ctx: CanvasRenderingContext2D,
    dims: { w: number; h: number; dpr: number },
    geo: GeoLike,
    heading: HeadingLike,
    now: number,
  ) => void;
};
