import { TypographyOptions } from '@mui/material/styles/createTypography';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    widgetText: true;
    smallText: true;
  }
}

interface ExtendedTypographyOptions extends TypographyOptions {
  widgetText: React.CSSProperties;
  smallText: React.CSSProperties;
}

declare module '@mui/material/styles' {
  interface PaletteOptions {
    textGrey: React.CSSProperties['color'];
  }
}

declare module '@mui/material' {
  interface PalettePropsVariantOverrides {
    textGrey: true;
  }
}

export const lightTheme = {
  typography: {
    h1: {
      fontSize: '3rem',
    },
    h3: {
      fontSize: '1.5rem',
    },
    widgetText: {
      fontSize: '1rem',
    },
    smallText: {
      fontSize: '0.8rem',
    },
  } as ExtendedTypographyOptions,
  palette: {
    primary: {
      main: '#96C6FF',
    },
    secondary: {
      main: '#FF8A8A',
    },
    textGrey: '#9D9D9D',
    accent1: '#96C6FF',
    accent2: '#FF8A8A',
    accent3: '#FFFCB7',
    widgetBg: '#FFFFFF80',
    primaryText: '#000000',
  },
  overrides: {
    MuiButton: {
      iconSizeSmall: {
        '& > *:first-child': {
          fontSize: 12,
        },
      },
    },
  },
};

export const darkTheme = {
  typography: {
    h1: {
      fontSize: '3rem',
    },
    h3: {
      fontSize: '1.5rem',
    },
    widgetText: {
      fontSize: '1rem',
    },
    smallText: {
      fontSize: '0.8rem',
    },
  } as ExtendedTypographyOptions,
  palette: {
    primary: {
      main: '#857DE4',
    },
    secondary: {
      main: '#E48181',
    },
    textGrey: '#9D9D9D',
    accent1: '#857DE4',
    accent2: '#E48181',
    accent3: '#F5D19B',
    widgetBg: '#454B60',
    primaryText: '#FFFFFF',
  },
  overrides: {
    MuiButton: {
      iconSizeSmall: {
        '& > *:first-child': {
          fontSize: 12,
        },
      },
    },
  },
};
