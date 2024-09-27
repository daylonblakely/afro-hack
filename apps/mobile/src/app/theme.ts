import { extendTheme } from 'native-base';

export const theme = extendTheme({
  config: {
    initialColorMode: 'dark', // Default to dark mode
    useSystemColorMode: false,
  },

  backgroundColor: {
    dark: '#121212',
    light: '#FFFFFF',
  },
  onBackgroundColor: {
    dark: '#2A2A2A',
    light: '#F5F5F5',
  },
  colors: {
    primary: {
      50: '#e5f9e7',
      100: '#c7efca',
      200: '#a6e4aa',
      300: '#84d888',
      400: '#61cb66',
      500: '#45b24d', // Main primary green
      600: '#359040',
      700: '#266f33',
      800: '#174d25',
      900: '#072c17',
    },
    secondary: {
      50: '#ffe5e5',
      100: '#fcb8b8',
      200: '#f28a8a',
      300: '#e75c5c',
      400: '#dc2d2d',
      500: '#c21515', // Main secondary red
      600: '#9a1010',
      700: '#720b0b',
      800: '#4a0505',
      900: '#230202',
    },
  },
});
