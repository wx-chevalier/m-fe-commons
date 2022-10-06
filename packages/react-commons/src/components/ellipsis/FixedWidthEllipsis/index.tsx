import Typography from 'antd/lib/typography';
import cn from 'classnames';
import React from 'react';

export interface FixedWidthEllipsisProps {
  className?: string;
  style?: Record<string, string | number>;

  children: string | number;
  maxWidth: number;

  fontColor?: 'white' | 'black' | 'inherit';
}

export const FixedWidthEllipsis = ({
  className,
  style = {},
  children,
  maxWidth = 120,
  fontColor = 'inherit',
}: FixedWidthEllipsisProps) => {
  return (
    <Typography.Paragraph
      id="FixedWidthEllipsis"
      className={cn(className)}
      ellipsis={{ tooltip: children }}
      style={{
        maxWidth,
        marginBottom: 0,
        overflow: 'hidden',
        display: 'inline-block',
        color: fontColor,
        ...style,
      }}
    >
      {children}
    </Typography.Paragraph>
  );
};

FixedWidthEllipsis.displayName = 'FixedWidthEllipsis';
