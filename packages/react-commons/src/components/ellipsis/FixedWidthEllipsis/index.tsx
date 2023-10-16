import Typography from 'antd/lib/typography';
import cn from 'classnames';
import React from 'react';

export interface FixedWidthEllipsisProps {
  className?: string;
  style?: React.CSSProperties;

  children: string;
  maxWidth: number;
  suffixCount?: number;

  fontColor?: 'white' | 'black' | 'inherit';
}

export const FixedWidthEllipsis = ({
  className,
  style = {},
  children,
  suffixCount,
  maxWidth = 120,
  fontColor = 'inherit',
}: FixedWidthEllipsisProps) => {
  const [content, setContent] = React.useState(children);
  const [suffix, setSuffix] = React.useState('');

  return (
    <Typography.Paragraph
      id="FixedWidthEllipsis"
      className={cn(className)}
      ellipsis={{
        tooltip: children,
        suffix,
        onEllipsis: () => {
          const start = children.slice(0, children.length - suffixCount).trim();
          const suffix = children.slice(-suffixCount).trim();
          setContent(start);
          setSuffix(suffix);
        },
      }}
      style={{
        maxWidth,
        marginBottom: 0,
        overflow: 'hidden',
        display: 'inline-block',
        color: fontColor,
        ...style,
      }}
    >
      {content}
    </Typography.Paragraph>
  );
};

FixedWidthEllipsis.displayName = 'FixedWidthEllipsis';
