import React, { useMemo } from 'react';
import Svg, { Path, Defs, LinearGradient, Stop, Line, G } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { MoodPoint } from './MoodPoint';

interface TimelinePoint {
  x: number;
  y: number;
  moodLevel: number | null;
}

interface MoodTimelineProps {
  points: TimelinePoint[];
  svgWidth: number;
  svgHeight: number;
}

export const MoodTimeline = React.memo(({ points, svgWidth, svgHeight }: MoodTimelineProps) => {
  const { colors } = useTheme();

  const pathD = useMemo(() => {
    // Filter out points to find logged indices to draw smooth curve segment
    const validPoints = points.filter(p => p.moodLevel !== null);
    if (validPoints.length < 2) return '';

    let d = `M ${validPoints[0].x} ${validPoints[0].y}`;
    for (let i = 1; i < validPoints.length; i++) {
      const prev = validPoints[i - 1];
      const curr = validPoints[i];
      const cx1 = (prev.x + curr.x) / 2;
      const cx2 = (prev.x + curr.x) / 2;
      d += ` C ${cx1} ${prev.y}, ${cx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, [points]);

  const areaD = useMemo(() => {
    const validPoints = points.filter(p => p.moodLevel !== null);
    if (validPoints.length < 2) return '';
    const last = validPoints[validPoints.length - 1];
    const first = validPoints[0];
    return `${pathD} L ${last.x} ${svgHeight - 10} L ${first.x} ${svgHeight - 10} Z`;
  }, [pathD, points, svgHeight]);

  // Compute grid line Y coordinates
  const topY = 20;
  const bottomY = svgHeight - 20;
  const midY = (topY + bottomY) / 2;

  const startX = points.length > 0 ? points[0].x : 20;
  const endX = points.length > 0 ? points[points.length - 1].x : svgWidth - 20;

  return (
    <Svg
      width={svgWidth}
      height={svgHeight}
    >
      <Defs>
        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colors.brand.primary} stopOpacity={0.16} />
          <Stop offset="1" stopColor={colors.brand.primary} stopOpacity={0} />
        </LinearGradient>
        <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor={colors.brand.secondary || '#8B5CF6'} />
          <Stop offset="50%" stopColor={colors.brand.primary} />
          <Stop offset="100%" stopColor="#06B6D4" />
        </LinearGradient>
      </Defs>

      {/* Guide lines (horizontal dashed) */}
      <Line
        x1={startX}
        y1={topY}
        x2={endX}
        y2={topY}
        stroke={colors.border.default}
        strokeWidth={1}
        strokeDasharray="4 6"
        opacity={0.15}
      />
      <Line
        x1={startX}
        y1={midY}
        x2={endX}
        y2={midY}
        stroke={colors.border.default}
        strokeWidth={1}
        strokeDasharray="4 6"
        opacity={0.15}
      />
      <Line
        x1={startX}
        y1={bottomY}
        x2={endX}
        y2={bottomY}
        stroke={colors.border.default}
        strokeWidth={1}
        strokeDasharray="4 6"
        opacity={0.15}
      />

      {/* Vertical connector grids linking points to days axis */}
      {points.map((p, i) => (
        <Line
          key={`v-grid-${i}`}
          x1={p.x}
          y1={p.moodLevel !== null ? p.y + 4 : topY}
          x2={p.x}
          y2={svgHeight - 10}
          stroke={colors.border.default}
          strokeWidth={1}
          strokeDasharray="2 3"
          opacity={p.moodLevel !== null ? 0.18 : 0.05}
        />
      ))}

      {/* Filled area under curve */}
      {areaD.length > 0 && (
        <Path
          d={areaD}
          fill="url(#areaGrad)"
        />
      )}

      {pathD.length > 0 && (
        <G>
          {/* Neon wide outer glow */}
          <Path
            d={pathD}
            stroke="url(#lineGrad)"
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            opacity={0.1}
          />
          {/* Neon medium glow */}
          <Path
            d={pathD}
            stroke="url(#lineGrad)"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={0.25}
          />
          {/* Main foreground crisp line */}
          <Path
            d={pathD}
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            fill="none"
            strokeLinecap="round"
            opacity={0.95}
          />
        </G>
      )}

      {/* Mood Points markers */}
      {points.map((p, i) => (
        <MoodPoint
          key={i}
          cx={p.x}
          cy={p.y}
          moodLevel={p.moodLevel}
          isToday={i === points.length - 1}
        />
      ))}
    </Svg>
  );
});

MoodTimeline.displayName = 'MoodTimeline';


