"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
  markerTitle?: string;
  markerDescription?: string;
}

export function Map({
  lat,
  lng,
  zoom = 15,
  className = "",
  markerTitle = "Location",
  markerDescription,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Only initialize if container exists and map hasn't been created
    if (!containerRef.current || mapInstanceRef.current) return;

    // Create the map
    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: zoom,
      scrollWheelZoom: false,
    });

    // Add dark tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        ">
          <div style="
            transform: rotate(45deg);
            font-size: 18px;
          ">☕</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    // Add marker
    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    
    // Add popup
    const popupContent = `
      <div style="text-align: center; padding: 4px;">
        <strong style="color: black;">${markerTitle}</strong>
        ${markerDescription ? `<p style="color: #666; font-size: 12px; margin-top: 4px;">${markerDescription}</p>` : ''}
      </div>
    `;
    marker.bindPopup(popupContent);

    mapInstanceRef.current = map;

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, zoom, markerTitle, markerDescription]);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ height: "100%", width: "100%", minHeight: "400px" }}
    />
  );
}

