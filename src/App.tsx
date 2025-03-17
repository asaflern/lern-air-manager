import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './App.css';

// Components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import GlobalView from './components/GlobalView';
import Fleet from './components/Fleet';
import About from './components/About';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  // Render the current page based on selection
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
      case 'global':
        return <GlobalView />;
      case 'fleet':
        return <Fleet />;
      case 'about':
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout currentPage={currentPage} onPageChange={handlePageChange}>
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
};

export default App;
