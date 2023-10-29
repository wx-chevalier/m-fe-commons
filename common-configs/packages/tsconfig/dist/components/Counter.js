import cn from 'classnames';
import React from 'react';
import styles from './Counter.module.less';
export const Counter = ({ className, style }) => {
    const [count, setCount] = React.useState(0);
    return (React.createElement("div", { className: cn(className, styles.container), style: style },
        React.createElement("p", null,
            React.createElement("button", { onClick: () => setCount(count => count + 1) },
                "count is: ",
                React.createElement("span", { className: styles.count }, count)))));
};
//# sourceMappingURL=Counter.js.map