"use client";

interface CityRow {
  city: string;
  count: number;
}

interface CityStatsProps {
  sitterCities: CityRow[];
  parentCities: CityRow[];
}

function CityBar({ city, count, max }: { city: string; count: number; max: number }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 truncate text-xs text-text-secondary">{city || "—"}</span>
      <div className="flex-1 bg-surface-tertiary h-1.5 overflow-hidden">
        <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-xs font-medium text-text-primary">{count}</span>
    </div>
  );
}

export function CityStats({ sitterCities, parentCities }: CityStatsProps) {
  const sitterMax = sitterCities[0]?.count ?? 1;
  const parentMax = parentCities[0]?.count ?? 1;

  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <div className="border border-border-default bg-surface-secondary p-6">
        <h2 className="mb-1 font-serif text-lg text-text-primary">Sitter nach Stadt</h2>
        <p className="mb-5 text-xs text-text-secondary">Top Städte — aktive Profile</p>
        <div className="space-y-3">
          {sitterCities.length === 0 ? (
            <p className="text-xs text-text-muted">Keine Daten</p>
          ) : (
            sitterCities.map((r) => (
              <CityBar key={r.city} city={r.city} count={r.count} max={sitterMax} />
            ))
          )}
        </div>
      </div>

      <div className="border border-border-default bg-surface-secondary p-6">
        <h2 className="mb-1 font-serif text-lg text-text-primary">Eltern nach Stadt</h2>
        <p className="mb-5 text-xs text-text-secondary">Top Städte — Betreuungsanfragen</p>
        <div className="space-y-3">
          {parentCities.length === 0 ? (
            <p className="text-xs text-text-muted">Keine Daten</p>
          ) : (
            parentCities.map((r) => (
              <CityBar key={r.city} city={r.city} count={r.count} max={parentMax} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
