import { useEffect, useState } from "react";

type GeoState =
  | { status: "idle" | "loading" }
  | { status: "ready"; lat: number; lon: number; accuracyM: number }
  | { status: "error"; message: string };

export function useGeo(): GeoState {
  const [state, setState] = useState<GeoState>({ status: "idle" });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({ status: "error", message: "Geolocation not available." });
      return;
    }

    setState({ status: "loading" });

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          status: "ready",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          accuracyM: pos.coords.accuracy,
        });
      },
      (err) => setState({ status: "error", message: err.message }),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 },
    );

    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return state;
}
