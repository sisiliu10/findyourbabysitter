"use client";

import { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    initGoogleMaps?: () => void;
  }
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (result: {
    address: string;
    city: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  }) => void;
  placeholder?: string;
  className?: string;
}

let googleMapsLoaded = false;
let googleMapsLoading = false;
const loadCallbacks: (() => void)[] = [];

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (googleMapsLoaded) return Promise.resolve();

  return new Promise((resolve) => {
    loadCallbacks.push(resolve);

    if (googleMapsLoading) return;
    googleMapsLoading = true;

    window.initGoogleMaps = () => {
      googleMapsLoaded = true;
      loadCallbacks.forEach((cb) => cb());
      loadCallbacks.length = 0;
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  });
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const autocompleteRef = useRef<any>(null);

  const handlePlaceSelect = useCallback(() => {
    const autocomplete = autocompleteRef.current;
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place.geometry?.location) return;

    const components = place.address_components || [];
    let street = "";
    let streetNumber = "";
    let city = "";
    let zipCode = "";

    for (const comp of components) {
      const types = comp.types;
      if (types.includes("route")) street = comp.long_name;
      if (types.includes("street_number")) streetNumber = comp.long_name;
      if (types.includes("locality")) city = comp.long_name;
      if (types.includes("postal_code")) zipCode = comp.long_name;
    }

    const address = streetNumber ? `${street} ${streetNumber}` : street;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    onChange(address);
    onSelect({ address, city, zipCode, latitude: lat, longitude: lng });
  }, [onChange, onSelect]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !inputRef.current) return;

    loadGoogleMaps(apiKey).then(() => {
      if (!inputRef.current || autocompleteRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "de" },
        fields: ["address_components", "geometry"],
      });

      autocomplete.addListener("place_changed", handlePlaceSelect);
      autocompleteRef.current = autocomplete;
    });
  }, [handlePlaceSelect]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary",
        "placeholder:text-text-muted transition focus:border-text-primary focus:outline-none",
        className,
      )}
      autoComplete="off"
    />
  );
}
