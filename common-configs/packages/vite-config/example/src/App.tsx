import React from 'react';
import logo from './logo.svg';
import './App.css';
import styles from './App.module.less';
import { Counter } from '@/components/Counter';
import 'reset.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className={styles.logo} alt="logo" />
        <p>Hello Vite + React!</p>
        <Counter />
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
