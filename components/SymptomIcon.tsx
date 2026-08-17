import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { SymptomType } from '../types/cycle';

interface IconProps {
  size?: number;
  color?: string;
}

export function Sparkle({ size = 16, color = '#b9c6e8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z"
        fill={color}
      />
    </Svg>
  );
}

export function DropIcon({ size = 18, color = '#a0153e', filled = true }: IconProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2.5C12 2.5 5.5 11.5 5.5 16a6.5 6.5 0 0 0 13 0C18.5 11.5 12 2.5 12 2.5Z"
        stroke={color}
        strokeWidth={1.5}
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.85 : 0}
      />
    </Svg>
  );
}

export function GearIcon({ size = 22, color = '#b9c6e8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3.2" stroke={color} strokeWidth="1.5" />
      <Path
        d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9 6.3 6.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CrystalBallIcon({ size = 48, color = '#b9c6e8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="11" r="7" stroke={color} strokeWidth="1.3" />
      <Path d="M7 20h10" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <Path d="M8.5 18h7" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <Path d="M9 8c1-1.5 3-2 4.5-1" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={0.6} />
      <Circle cx="14.5" cy="12.5" r="0.6" fill={color} opacity={0.4} />
      <Circle cx="9.5" cy="14" r="0.4" fill={color} opacity={0.3} />
    </Svg>
  );
}

export function SymptomIcon({ type, size = 22, color = '#b9c6e8' }: IconProps & { type: SymptomType }) {
  const sw = 1.5;
  switch (type) {
    case 'cramps':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M3 11 Q6 7 9 11 T15 11 T21 11" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M3 16 Q6 13 9 16 T15 16 T21 16" stroke={color} strokeWidth={1} opacity={0.4} strokeLinecap="round" />
        </Svg>
      );
    case 'bloating':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="13" r="6.5" stroke={color} strokeWidth={sw} />
          <Path d="M12 4v2" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M20 13h-2" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M12 22v-2" stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Path d="M4 13h2" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'headache':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={1} opacity={0.4} />
          <Path d="M13.5 5.5 9 13h3l-1 5.5 5.5-8H13l1-5Z" fill={color} />
        </Svg>
      );
    case 'fatigue':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M16 4a8.3 8.3 0 1 0 0 16 6.7 6.7 0 0 1 0-16z" fill={color} opacity={0.85} />
        </Svg>
      );
    case 'mood_swings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 3.5a8.5 8.5 0 0 1 0 17 4.25 4.25 0 0 1 0-8.5 4.25 4.25 0 0 0 0-8.5z" stroke={color} strokeWidth={1.2} fill="none" />
          <Circle cx="12" cy="7.5" r="1.1" fill={color} />
          <Circle cx="12" cy="16.5" r="1.1" stroke={color} strokeWidth={1} />
        </Svg>
      );
    case 'breast_tenderness':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 3 L13.2 10.8 L21 12 L13.2 13.2 L12 21 L10.8 13.2 L3 12 L10.8 10.8 Z" fill={color} opacity={0.9} />
          <Path d="M18 4 L18.6 6.4 L21 7 L18.6 7.6 L18 10 L17.4 7.6 L15 7 L17.4 6.4 Z" fill={color} opacity={0.5} />
        </Svg>
      );
    case 'acne':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 3h4v3.2l2 3V19a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-9.8l2-3V3Z" stroke={color} strokeWidth={1.3} />
          <Path d="M8.6 13.5h6.8" stroke={color} strokeWidth={1} opacity={0.6} />
          <Circle cx="12" cy="17" r="1" fill={color} opacity={0.6} />
        </Svg>
      );
    case 'cravings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M4 10.5h16l-1.8 7.2a2.2 2.2 0 0 1-2.1 1.6H7.9a2.2 2.2 0 0 1-2.1-1.6L4 10.5Z" stroke={color} strokeWidth={1.3} />
          <Path d="M7.5 10.5a4.5 4.5 0 0 1 9 0" stroke={color} strokeWidth={1} />
          <Circle cx="9.5" cy="6" r="0.8" fill={color} opacity={0.5} />
          <Circle cx="13.5" cy="5" r="0.6" fill={color} opacity={0.4} />
        </Svg>
      );
    case 'backache':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 8h4v12h-4V8Z" stroke={color} strokeWidth={sw} />
          <Path d="M12 3c-1 1-1.5 2.5-1 3.5.5 1 1.5 1.5 1 1.5s-.5-.5 0-1.5c.5-1 1-2.5 0-3.5Z" fill={color} opacity={0.8} />
          <Path d="M9 20h6" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'nausea':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 12c3 0 4.2-2.6 2.1-4.7-2.1-2.1-5.5-.9-6.3 1.8-.8 2.7 1 5.9 4.5 5.9s6.4-3 5.2-7"
            stroke={color}
            strokeWidth={1.3}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      );
    case 'insomnia':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M15 4.5a7 7 0 1 0 0 14 5.7 5.7 0 0 1 0-14z" fill={color} opacity={0.8} />
          <Path d="M5 6.5 5.5 8 7 8.5 5.5 9 5 10.5 4.5 9 3 8.5 4.5 8Z" fill={color} opacity={0.7} />
          <Circle cx="5" cy="15" r="0.7" fill={color} opacity={0.5} />
        </Svg>
      );
    case 'anxiety':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M6 4l3 3.5-4 3 5 3-4 3 6 3"
            stroke={color}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
  }
}
