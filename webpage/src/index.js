import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (typeof window !== "undefined" && window.document) {
  const googleScript = document.createElement("script");
  googleScript.src = "https://accounts.google.com/gsi/client";
  googleScript.async = true;
  googleScript.defer = true;
  document.head.appendChild(googleScript);
}
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
