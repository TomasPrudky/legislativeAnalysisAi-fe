import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LegislativeAnalysisApp from './components/LegislativeAnalysisApp';


const theme = createTheme({
  palette: {
    primary: {
      main: '#A3C636',
    },
    secondary: {
      main: '#00413C',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LegislativeAnalysisApp  />
    </ThemeProvider>
  );
};

export default App;