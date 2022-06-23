import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import theme from './theme.json';
import { MantineProvider } from '@mantine/core'
import { ServerProvider } from './modules/servercomponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={theme.light}
    >
      <ServerProvider
        host="http://localhost/api"
      >
        <App />
      </ServerProvider>
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();