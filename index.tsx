
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Target container 'root' not found");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("Application initialized successfully");
} catch (err) {
  console.error("Initialization error:", err);
  const debug = document.getElementById('debug-console');
  if (debug) {
    debug.style.display = 'block';
    debug.innerText += "\nRender Error: " + err.message;
  }
}
