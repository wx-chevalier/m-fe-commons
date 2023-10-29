import cn from 'classnames';
import React from 'react';

import styles from './Counter.module.less';

export interface CounterProps {
  className?: string;
  style?: Record<string, string | number>;
}

export const Counter = ({ className, style }: CounterProps) => {
  const [count, setCount] = React.useState(0);

  return (
    <div className={cn(className, styles.container)} style={style}>
      <p>
        <button onClick={() => setCount(count => count + 1)}>
          count is: <span className={styles.count}>{count}</span>
        </button>
      </p>
    </div>
  );
};
