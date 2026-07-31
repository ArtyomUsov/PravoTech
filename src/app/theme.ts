import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    priority0: Palette['primary']
    priority1: Palette['primary']
    priority2: Palette['primary']
    priority3: Palette['primary']
  }
  interface PaletteOptions {
    priority0: PaletteOptions['primary']
    priority1: PaletteOptions['primary']
    priority2: PaletteOptions['primary']
    priority3: PaletteOptions['primary']
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
      light: '#534bae',
      dark: '#000051',
    },
    secondary: {
      main: '#00897b',
      light: '#4ebaaa',
      dark: '#005b4f',
    },
    priority0: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#fff',
    },
    priority1: {
      main: '#f57c00',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#fff',
    },
    priority2: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    priority3: {
      main: '#757575',
      light: '#bdbdbd',
      dark: '#424242',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 500,
    },
    body2: {
      color: '#555',
    },
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 1,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
})