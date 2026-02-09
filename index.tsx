
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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
  console.log("LoyaltyPro rendered successfully");
} catch (err) {
  console.error("Render error:", err);
  document.body.innerHTML += `<div style="color:red; padding:20px;">Render Error: ${err.message}</div>`;
}
