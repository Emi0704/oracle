import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface TabIconProps {
  name: 'crystal-ball' | 'candle' | 'eye' | 'mirror' | 'book';
  color: string;
  size: number;
}

export function TabIcon({ name, color, size }: TabIconProps) {
  switch (name) {
    case 'crystal-ball':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="11" r="7" stroke={color} strokeWidth="1.5" />
          <Path d="M8 20h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M9 18h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M9 8c1-1.5 3-2 4.5-1" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={0.6} />
          <Circle cx="14" cy="12" r="0.5" fill={color} opacity={0.4} />
          <Circle cx="10" cy="13" r="0.3" fill={color} opacity={0.3} />
        </Svg>
      );
    case 'candle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M10 8h4v12h-4V8z" stroke={color} strokeWidth="1.5" />
          <Path d="M12 3c-1 1-1.5 2.5-1 3.5.5 1 1.5 1.5 1 1.5s-0.5-.5 0-1.5c.5-1 1-2.5 0-3.5z" fill={color} opacity={0.7} />
          <Path d="M9 20h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <Circle cx="12" cy="5" r="1" fill={color} opacity={0.5} />
        </Svg>
      );
    case 'eye':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7z" stroke={color} strokeWidth="1.5" />
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
          <Circle cx="12" cy="12" r="1" fill={color} />
          <Path d="M12 2v2" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={0.5} />
          <Path d="M12 20v2" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={0.5} />
        </Svg>
      );
    case 'mirror':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="10" r="7" stroke={color} strokeWidth="1.5" />
          <Path d="M10 17l-1 5h6l-1-5" stroke={color} strokeWidth="1.5" />
          <Path d="M9 7c1.5-1.5 4-1.5 5.5 0" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={0.4} />
          <Circle cx="12" cy="10" r="4.5" stroke={color} strokeWidth="0.5" opacity={0.3} />
        </Svg>
      );
    case 'book':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 6.5c-1.5-1.3-3.8-2-6.5-2v13c2.7 0 5 .7 6.5 2" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <Path d="M12 6.5c1.5-1.3 3.8-2 6.5-2v13c-2.7 0-5 .7-6.5 2" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
          <Path d="M12 6.5v13" stroke={color} strokeWidth="1" opacity={0.4} />
        </Svg>
      );
  }
}
