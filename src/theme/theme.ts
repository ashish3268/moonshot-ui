import { createTheme } from '@mui/material/styles';

/* ------------------------------------------------------------------ */
/*  Module augmentation for custom palette + typography                 */
/* ------------------------------------------------------------------ */

declare module '@mui/material/styles' {
  interface Palette {
    brand: string;
    custom: {
      navBg: string;
      navBorder: string;
      navHover: string;
      navText: string;
      navTextMuted: string;
      navSeparator: string;
      tableHeader: string;
      tableRowAlt: string;
      tableRowHover: string;
      formBg: string;
      hoverItem: string;
      labelGray: string;
      borderGray: string;
      borderLight: string;
      inputBorder: string;
      badgeRed: string;
      badgeRedText: string;
      badgeRedBorder: string;
      badgeAmber: string;
      badgeAmberText: string;
      badgeAmberBorder: string;
      badgeGreen: string;
      badgeGreenText: string;
      badgeGreenBorder: string;
      badgeBlue: string;
      badgeBlueText: string;
      badgeBlueBorder: string;
      badgeYellow: string;
      badgeYellowText: string;
      badgeYellowBorder: string;
      badgeOrange: string;
      badgeOrangeText: string;
      badgeOrangeBorder: string;
    };
  }
  interface PaletteOptions {
    brand?: string;
    custom?: Partial<Palette['custom']>;
  }
  interface TypographyVariants {
    headerMeta: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    headerMeta?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headerMeta: true;
  }
}

/* ------------------------------------------------------------------ */
/*  Theme                                                              */
/* ------------------------------------------------------------------ */

const theme = createTheme({
  palette: {
    brand: '#4f46e5',
    primary: {
      main: '#4f46e5',
    },
    success: {
      main: '#059669',
    },
    warning: {
      main: '#d97706',
    },
    error: {
      main: '#dc2626',
    },
    background: {
      default: '#f8fafc',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    custom: {
      navBg: '#ffffff',
      navBorder: '#e2e8f0',
      navHover: '#f1f5f9',
      navText: '#0f172a',
      navTextMuted: '#94a3b8',
      navSeparator: '#e2e8f0',
      tableHeader: '#f8fafc',
      tableRowAlt: '#f8fafc',
      tableRowHover: '#eef2ff',
      formBg: '#f8fafc',
      hoverItem: '#f8fafc',
      labelGray: '#64748b',
      borderGray: '#e2e8f0',
      borderLight: '#e2e8f0',
      inputBorder: '#cbd5e1',
      badgeRed: '#fef2f2',
      badgeRedText: '#991b1b',
      badgeRedBorder: '#fecaca',
      badgeAmber: '#fff7ed',
      badgeAmberText: '#9a3412',
      badgeAmberBorder: '#fed7aa',
      badgeGreen: '#f0fdf4',
      badgeGreenText: '#166534',
      badgeGreenBorder: '#bbf7d0',
      badgeBlue: '#eff6ff',
      badgeBlueText: '#1e40af',
      badgeBlueBorder: '#bfdbfe',
      badgeYellow: '#fefce8',
      badgeYellowText: '#854d0e',
      badgeYellowBorder: '#fef08a',
      badgeOrange: '#fff7ed',
      badgeOrangeText: '#c2410c',
      badgeOrangeBorder: '#fdba74',
    },
  },
  typography: {
    fontSize: 16,
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
    caption: { fontSize: '0.8rem' },
    headerMeta: { fontSize: '0.72rem' },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
        },
        head: ({ theme: t }) => ({
          backgroundColor: t.palette.custom.tableHeader,
          fontWeight: 700,
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          fontSize: '0.875rem',
          textTransform: 'none',
          paddingTop: 6,
          paddingBottom: 6,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 36,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

export default theme;
