import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './global.css';
import reportWebVitals from './reportWebVitals';
import theme from './theme.json';
import { MantineProvider } from '@mantine/core'
import { ServerProvider } from './modules/servercomponent';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ShoppingCartProvider } from './modules/shoppingcart';
import { NotificationsProvider } from '@mantine/notifications';

import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import SustainablePage from './pages/Sustainable';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import ShoppingCartPage from './pages/ShoppingCart';
import OrderedPage from './pages/Ordered';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={theme.light}
    >
      <ServerProvider
        host={`${process.env.REACT_APP_API_HOST}/data`}
      >
        <ShoppingCartProvider>
          <NotificationsProvider>
            <RouteProvider />
          </NotificationsProvider>
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
          <Route path='/kontakt' element={<ContactPage />} />
          <Route path='/einkaufswagen' element={<ShoppingCartPage />} />
          <Route path='/bestellt' element={<OrderedPage />} />
          <Route path='/printer' element={<PrinterEasterEgg />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

function PrinterEasterEgg() {
  useEffect(() => {
    window.location.href = 'https://www.youtube.com/watch?v=jeg_TJvkSjg&t=42s'
  }, [])
  return "How did you find me??"
}