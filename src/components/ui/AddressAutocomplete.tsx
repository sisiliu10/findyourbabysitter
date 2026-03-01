"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    country?: string;
  };
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

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<PhotonFeature[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    onChange(query);
    setActiveIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=52.52&lon=13.405&limit=5`
        );
        const data = await res.json();
        const features = (data.features || []) as PhotonFeature[];
        setSuggestions(features);
        setIsOpen(features.length > 0);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);
  }

  function handleSelect(feature: PhotonFeature) {
    const props = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;

    const street = props.street || props.name || "";
    const housenumber = props.housenumber || "";
    const address = housenumber ? `${street} ${housenumber}` : street;

    onChange(address);
    onSelect({
      address,
      city: props.city || "",
      zipCode: props.postcode || "",
      latitude: lat,
      longitude: lng,
    });

    setSuggestions([]);
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  function formatSuggestion(feature: PhotonFeature) {
    const p = feature.properties;
    const street = p.street || p.name || "";
    const housenumber = p.housenumber || "";
    const primary = housenumber ? `${street} ${housenumber}` : street;
    const secondary = [p.postcode, p.city].filter(Boolean).join(", ");
    return { primary, secondary };
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className={cn(
          "block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary",
          "placeholder:text-text-muted transition focus:border-text-primary focus:outline-none",
          className,
        )}
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls="address-suggestions"
        autoComplete="off"
      />
      {isOpen && (
        <ul
          id="address-suggestions"
          role="listbox"
          className="absolute z-50 w-full border border-t-0 border-border-default bg-surface-secondary shadow-sm"
        >
          {suggestions.map((feature, i) => {
            const { primary, secondary } = formatSuggestion(feature);
            return (
              <li
                key={i}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={() => handleSelect(feature)}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "cursor-pointer px-3 py-2.5 text-sm transition",
                  i === activeIndex
                    ? "bg-surface-tertiary text-text-primary"
                    : "text-text-secondary hover:bg-surface-tertiary",
                )}
              >
                <span className="block text-text-primary">{primary}</span>
                {secondary && (
                  <span className="block text-xs text-text-muted">{secondary}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
