'use client';

import { cn } from '@/lib/utils';
import type { CSSProperties, ReactNode } from 'react';

type BorderPosition = 'top' | 'bottom' | 'left' | 'right';

interface BaseRainbowProps {
  className?: string;
  height?: string | number;
}

interface RainbowAnimationProps extends BaseRainbowProps {
  children?: ReactNode;
}

interface RainbowBorderProps extends BaseRainbowProps {
  position?: BorderPosition;
}

const POSITION_STYLES: Record<BorderPosition, CSSProperties> = {
  top: { top: 0, left: 0, width: '100%' },
  bottom: { bottom: 0, left: 0, width: '100%' },
  left: { top: 0, left: 0, height: '100%' },
  right: { top: 0, right: 0, height: '100%' },
};

export function RainbowAnimation({ className, height = '2px', children }: RainbowAnimationProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {}
      <RainbowBorder position="top" height={height} className="z-10" />
    </div>
  );
}

RainbowAnimation.displayName = 'RainbowAnimation';

export function RainbowBorder({ className, position = 'top', height = '2px' }: RainbowBorderProps) {
  const baseStyles = POSITION_STYLES[position];

  const thicknessProperty = position === 'left' || position === 'right' ? 'width' : 'height';

  const styles: CSSProperties = {
    ...baseStyles,
    [thicknessProperty]: height,
  };

  return <div className={cn('rainbow-animation absolute', className)} style={styles} />;
}

RainbowBorder.displayName = 'RainbowBorder';
