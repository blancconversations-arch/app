import React, { useMemo, useState } from "react";
import { useCamera } from "./hooks/useCamera";
import { useGeo } from "./hooks/useGeo";
import { useHeading } from "./hooks/useHeading";
import { Overlay } from "./components/Overlay";
import { LayerId, LAYERS, defaultEnabled } from "./layers/registry";

export default function App() {
  const [enabled, setEnabled] = useState<Record<LayerId, boolean>>(() => ({ ...defaultEnabled }));

  const cam = useCamera();
  const geo = useGeo();
  const heading = useHeading();

  const enabledLayers = useMemo(
    () => (Object.keys(enabled) as LayerId[]).filter((k) => enabled[k]),
    [enabled],
  );

  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      {/* Camera background */}
      <video
        ref={cam.videoRef}
        playsInline
        muted
        autoPlay
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "contrast(1.05) saturate(1.05)",
          background: "#000",
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1200px 800px at 50% 40%, rgba(0,0,0,0.10), rgba(0,0,0,0.62))",
          pointerEvents: "none",
        }}
      />

      {/* Overlay */}
      <Overlay
        width="100%"
        height="100%"
        geo={geo}
        heading={heading}
        enabledLayers={enabledLayers}
      />

      {/* Top chrome */}
      <div style={{ position: "absolute", top: 14, left: 14, right: 14, display: "flex", gap: 10 }}>
        <div className="glass" style={{ padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.22em" }}>BLANC VISION</div>
            <div className="small" style={{ letterSpacing: "0.08em" }}>
              perception layer • software prototype
            </div>
          </div>
          <div style={{ width: 10 }} />
          <div className="pill" title="Location">
            <span style={{ opacity: 0.9 }}>LOC</span>
            <span style={{ letterSpacing: "0.02em", textTransform: "none" }}>
              {geo.status === "ready"
                ? `${geo.lat.toFixed(5)}, ${geo.lon.toFixed(5)}`
                : geo.status.toUpperCase()}
            </span>
          </div>
          <div className="pill" title="Heading">
            <span style={{ opacity: 0.9 }}>HDG</span>
            <span style={{ letterSpacing: "0.02em", textTransform: "none" }}>
              {heading.status === "ready" ? `${Math.round(heading.deg)}°` : heading.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div className="glass" style={{ padding: 10, display: "flex", gap: 8, alignItems: "center" }}>
          <button className="btn" onClick={() => cam.toggle()}>
            {cam.on ? "Camera On" : "Camera Off"}
          </button>
          <button className="btn" onClick={() => cam.switchFacing()} title="Switch camera (if available)">
            Switch
          </button>
          <button className="btn" onClick={() => setEnabled({ ...defaultEnabled })} title="Reset layers">
            Reset
          </button>
        </div>
      </div>

      {/* Bottom layer tray */}
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14 }}>
        <div className="glass" style={{ padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.22em" }}>LAYERS</div>
            <div className="small">keep it sparse. one glance.</div>
          </div>

          <div className="hairline" style={{ margin: "10px 0 12px" }} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 10,
            }}
          >
            {LAYERS.map((layer) => (
              <label
                key={layer.id}
                className="pill"
                style={{
                  cursor: "pointer",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderColor: enabled[layer.id] ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.10)",
                  background: enabled[layer.id] ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.22)",
                }}
              >
                <span style={{ opacity: 0.95 }}>{layer.label}</span>
                <input
                  type="checkbox"
                  checked={enabled[layer.id]}
                  onChange={(e) => setEnabled((prev) => ({ ...prev, [layer.id]: e.target.checked }))}
                  style={{ width: 16, height: 16 }}
                />
              </label>
            ))}
          </div>

          <div className="small" style={{ marginTop: 10, opacity: 0.9 }}>
            Tip: open on mobile (HTTPS) to enable camera + heading.
          </div>
        </div>
      </div>

      {/* Permission helper */}
      {cam.error && (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <div className="glass" style={{ padding: 18, maxWidth: 520 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.22em", marginBottom: 10 }}>CAMERA ERROR</div>
            <div className="small" style={{ lineHeight: 1.5 }}>
              {cam.error}
              <br />
              <br />
              Use HTTPS and allow camera permission. On iOS: Settings → Safari → Camera.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
