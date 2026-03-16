"use client";

interface WeekData {
  label: string;
  parents: number;
  sitters: number;
}

interface SignupChartProps {
  data: WeekData[];
}

export function SignupChart({ data }: SignupChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-text-tertiary">
        No signup data yet.
      </div>
    );
  }

  const maxValue = Math.max(...data.flatMap((d) => [d.parents, d.sitters]), 1);
  const chartHeight = 180;
  const barWidth = 10;
  const groupGap = 4;
  const groupWidth = barWidth * 2 + groupGap;
  const leftPad = 32;
  const rightPad = 12;
  const topPad = 16;
  const bottomPad = 36;
  const groupSpacing = 8;
  const totalWidth =
    leftPad + rightPad + data.length * (groupWidth + groupSpacing) - groupSpacing;
  const totalHeight = chartHeight + topPad + bottomPad;

  const yLines = [0, 0.25, 0.5, 0.75, 1];

  function barHeight(value: number) {
    return (value / maxValue) * chartHeight;
  }

  function xPos(i: number) {
    return leftPad + i * (groupWidth + groupSpacing);
  }

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        style={{ width: "100%", minWidth: Math.max(totalWidth, 320), height: "auto" }}
      >
        {/* Y-axis grid lines and labels */}
        {yLines.map((frac) => {
          const y = topPad + chartHeight - frac * chartHeight;
          const label = Math.round(frac * maxValue);
          return (
            <g key={frac}>
              <line
                x1={leftPad}
                x2={totalWidth - rightPad}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.1}
                strokeWidth={1}
              />
              <text
                x={leftPad - 4}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={9}
                fill="currentColor"
                opacity={0.4}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = xPos(i);
          const ph = barHeight(d.parents);
          const sh = barHeight(d.sitters);
          return (
            <g key={i}>
              {/* Parents bar */}
              <rect
                x={x}
                y={topPad + chartHeight - ph}
                width={barWidth}
                height={ph}
                fill="#3b82f6"
                opacity={0.85}
                rx={1}
              />
              {/* Sitters bar */}
              <rect
                x={x + barWidth + groupGap}
                y={topPad + chartHeight - sh}
                width={barWidth}
                height={sh}
                fill="#22c55e"
                opacity={0.85}
                rx={1}
              />
              {/* X-axis label */}
              <text
                x={x + groupWidth / 2}
                y={topPad + chartHeight + 10}
                textAnchor="middle"
                fontSize={8}
                fill="currentColor"
                opacity={0.5}
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* X axis line */}
        <line
          x1={leftPad}
          x2={totalWidth - rightPad}
          y1={topPad + chartHeight}
          y2={topPad + chartHeight}
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={1}
        />
      </svg>

      {/* Legend */}
      <div className="mt-3 flex gap-5 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-blue-500 opacity-85" />
          Parents
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-500 opacity-85" />
          Sitters
        </span>
      </div>
    </div>
  );
}
