import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { useCycle } from '../context/CycleContext';

interface MoonPhaseIconProps {
  phase: 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';
  size?: number;
  color?: string;
}

export function MoonPhaseIcon({ phase, size = 24, color }: MoonPhaseIconProps) {
  const { colors } = useCycle();
  const moonColor = color || colors.silver;
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;

  const getMoonPath = () => {
    switch (phase) {
      case 'new':
        return <Circle cx={cx} cy={cy} r={r} fill="none" stroke={moonColor} strokeWidth="1.5" />;
      case 'full':
        return <Circle cx={cx} cy={cy} r={r} fill={moonColor} />;
      case 'first-quarter':
        return (
          <>
            <Circle cx={cx} cy={cy} r={r} fill="none" stroke={moonColor} strokeWidth="1" />
            <Path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} L ${cx} ${cy - r} Z`} fill={moonColor} />
          </>
        );
      case 'last-quarter':
        return (
          <>
            <Circle cx={cx} cy={cy} r={r} fill="none" stroke={moonColor} strokeWidth="1" />
            <Path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} L ${cx} ${cy - r} Z`} fill={moonColor} />
          </>
        );
      case 'waxing-crescent':
        return (
          <>
            <Circle cx={cx} cy={cy} r={r} fill="none" stroke={moonColor} strokeWidth="1" />
            <Path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r * 0.6} ${r} 0 0 0 ${cx} ${cy - r} Z`} fill={moonColor} />
          </>
        );
      case 'waxing-gibbous':
        return (
          <>
            <Circle cx={cx} cy={cy} r={r} fill={moonColor} />
            <Path d={`M ${cx} ${cy - r} A ${r * 0.4} ${r} 0 0 1 ${cx} ${cy + r} A ${r} ${r} 0 0 0 ${cx} ${cy - r} Z`} fill={colors.background} />
          </>
        );
      case 'waning-gibbous':
        return (
          <>
            <Circle cx={cx} cy={cy} r={r} fill={moonColor} />
            <Path d={`M ${cx} ${cy - r} A ${r * 0.4} ${r} 0 0 0 ${cx} ${cy + r} A ${r} ${r} 0 0 1 ${cx} ${cy - r} Z`} fill={colors.background} />
          </>
        );
      case 'waning-crescent':
        return (
          <>
            <Circle cx={cx} cy={cy} r={r} fill="none" stroke={moonColor} strokeWidth="1" />
            <Path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} A ${r * 0.6} ${r} 0 0 1 ${cx} ${cy - r} Z`} fill={moonColor} />
          </>
        );
    }
  };

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {getMoonPath()}
    </Svg>
  );
}

export function getMoonPhaseForDate(date: Date): MoonPhaseIconProps['phase'] {
  const synodic = 29.53058867;
  const known = new Date(2000, 0, 6, 18, 14);
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const phase = ((diff % synodic) + synodic) % synodic;
  const normalized = phase / synodic;

  if (normalized < 0.0625) return 'new';
  if (normalized < 0.1875) return 'waxing-crescent';
  if (normalized < 0.3125) return 'first-quarter';
  if (normalized < 0.4375) return 'waxing-gibbous';
  if (normalized < 0.5625) return 'full';
  if (normalized < 0.6875) return 'waning-gibbous';
  if (normalized < 0.8125) return 'last-quarter';
  if (normalized < 0.9375) return 'waning-crescent';
  return 'new';
}
