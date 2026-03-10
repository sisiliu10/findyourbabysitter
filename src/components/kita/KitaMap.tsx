"use client";

import { useEffect, useRef, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import type { Kita } from "@prisma/client";

interface KitaMapProps {
  kitas: Kita[];
  highlightedId?: string | null;
  onMarkerClick?: (kita: Kita) => void;
  onMarkerHover?: (id: string | null) => void;
}

// Berlin center
const BERLIN_CENTER: [number, number] = [52.52, 13.405];
const BERLIN_ZOOM = 11;

export function KitaMap({ kitas, highlightedId, onMarkerClick, onMarkerHover }: KitaMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const leafletRef = useRef<any>(null);

  const initMap = useCallback(async () => {
    if (mapRef.current || !mapContainerRef.current) return;

    const L = await import("leaflet");
    leafletRef.current = L;

    // Create map
    const map = L.map(mapContainerRef.current, {
      center: BERLIN_CENTER,
      zoom: BERLIN_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    // Add markers for kitas with coordinates
    addMarkers(L, map, kitas);
  }, []);

  const createMarkerIcon = useCallback(
    (L: any, isHighlighted: boolean) => {
      const color = isHighlighted ? "#2C2420" : "#D4845C";
      const size = isHighlighted ? 14 : 10;

      return L.divIcon({
        className: "kita-marker",
        html: `<div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 2px solid white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        transition: all 0.15s;
      "></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    },
    []
  );

  const addMarkers = useCallback(
    (L: any, map: any, kitaList: Kita[]) => {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      kitaList.forEach((kita) => {
        if (!kita.latitude || !kita.longitude) return;

        const marker = L.marker([kita.latitude, kita.longitude], {
          icon: createMarkerIcon(L, false),
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: Outfit, sans-serif; padding: 2px;">
            <strong style="font-size: 13px;">${kita.name}</strong>
            ${kita.rating > 0 ? `<div style="font-size: 11px; color: #7A6B5D; margin-top: 2px;">${kita.rating.toFixed(1)} &#9733;</div>` : ""}
            ${kita.address ? `<div style="font-size: 11px; color: #A69686; margin-top: 2px;">${kita.address}</div>` : ""}
          </div>`,
            { closeButton: false, offset: [0, -5] }
          );

        marker.on("click", () => onMarkerClick?.(kita));
        marker.on("mouseover", () => {
          onMarkerHover?.(kita.id);
          marker.openPopup();
        });
        marker.on("mouseout", () => {
          onMarkerHover?.(null);
          marker.closePopup();
        });

        markersRef.current.set(kita.id, marker);
      });
    },
    [createMarkerIcon, onMarkerClick, onMarkerHover]
  );

  // Initialize map
  useEffect(() => {
    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [initMap]);

  // Update markers when kitas change
  useEffect(() => {
    if (!mapRef.current || !leafletRef.current) return;
    addMarkers(leafletRef.current, mapRef.current, kitas);
  }, [kitas, addMarkers]);

  // Highlight marker on hover
  useEffect(() => {
    if (!leafletRef.current) return;

    markersRef.current.forEach((marker, id) => {
      const isHighlighted = id === highlightedId;
      marker.setIcon(createMarkerIcon(leafletRef.current, isHighlighted));
      if (isHighlighted) {
        marker.setZIndexOffset(1000);
      } else {
        marker.setZIndexOffset(0);
      }
    });
  }, [highlightedId, createMarkerIcon]);

  return (
    <div
      ref={mapContainerRef}
      className="h-full w-full"
      style={{ minHeight: "400px" }}
    />
  );
}
