import React from 'react';
import logo from './logo.svg';
import './App.css';
import styles from './App.module.less';
import { Counter } from '@/components/Counter';
import 'reset.css';
function App() {
    return (React.createElement("div", { className: "App" },
        React.createElement("header", { className: "App-header" },
            React.createElement("img", { src: logo, className: styles.logo, alt: "logo" }),
            React.createElement("p", null, "Hello Vite + React!"),
            React.createElement(Counter, null),
            React.createElement("p", null,
                "Edit ",
                React.createElement("code", null, "App.tsx"),
                " and save to test HMR updates."),
            React.createElement("p", null,
                React.createElement("a", { className: "App-link", href: "https://reactjs.org", target: "_blank", rel: "noopener noreferrer" }, "Learn React"),
                ' | ',
                React.createElement("a", { className: "App-link", href: "https://vitejs.dev/guide/features.html", target: "_blank", rel: "noopener noreferrer" }, "Vite Docs")))));
}
export default App;
//# sourceMappingURL=App.js.map