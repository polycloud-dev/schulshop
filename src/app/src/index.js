import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import reportWebVitals from './reportWebVitals';
import theme from './theme.json';
import { MantineProvider } from '@mantine/core'
import { ServerProvider } from './modules/servercomponent';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import SustainablePage from './pages/Sustainable';
import AboutPage from './pages/About';
import { ShoppingCartProvider } from './modules/shoppingcart';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={theme.light}
    >
      <ServerProvider
        host="http://localhost/api"
      >
        <ShoppingCartProvider>
          <RouteProvider />
        </ShoppingCartProvider>
      </ServerProvider>
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();

function RouteProvider() {
  return (
    <Router>
      <Routes>
        <Route path='/'>
          <Route index element={<HomePage />} />
          <Route path='/nachhaltig' element={<SustainablePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  )
}