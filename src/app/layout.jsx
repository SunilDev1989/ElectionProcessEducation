'use client';

import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageHeader from '@/components/LanguageHeader';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Election Process Assistant</title>
        <meta name="description" content="Your interactive guide to the election process, timelines, and polling locations." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
              <Sidebar />
              <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <LanguageHeader />
                <Box sx={{ flexGrow: 1 }}>
                  {children}
                </Box>
              </Box>
            </Box>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
