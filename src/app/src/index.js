import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import theme from './theme.json';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={theme}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();