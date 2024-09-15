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
});
