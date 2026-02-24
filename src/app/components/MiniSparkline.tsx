interface MiniSparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

export function MiniSparkline({ data, color, width = 80, height = 28 }: MiniSparklineProps) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 2;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return [x, y] as [number, number];
  });

  const linePoints = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const areaPoints = [
    `${pts[0][0]},${height}`,
    ...pts.map(([x, y]) => `${x},${y}`),
    `${pts[pts.length - 1][0]},${height}`,
  ].join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <polyline
        fill={`${color}18`}
        stroke="none"
        points={areaPoints}
      />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={linePoints}
      />
      {/* Last point dot */}
      <circle
        cx={pts[pts.length - 1][0]}
        cy={pts[pts.length - 1][1]}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}
