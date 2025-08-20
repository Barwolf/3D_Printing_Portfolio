import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'

import Home from './pages/Home.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

import { ThemeProvider } from './context/ThemeContext.jsx';

function App() {
  document.documentElement.setAttribute('data-theme', 'light');

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Define a route for each page */}
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
