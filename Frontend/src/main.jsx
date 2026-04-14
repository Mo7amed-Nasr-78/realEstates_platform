import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import PropsProvider from './components/PropsProvider';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <BrowserRouter>
      <PropsProvider>
        <App />
        <ToastContainer />
      </PropsProvider>
    </BrowserRouter>
  // </StrictMode>
)
