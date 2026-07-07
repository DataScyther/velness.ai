export interface ThemeTokens {
  background: {
    primary: string;
    secondary: string;
  };
  surface: {
    primary: string;
    secondary: string;
  };
  text: {
    tertiary?: string;
    primary: string;
    secondary: string;
  };
  border: {
    default: string;
  };
  brand: {
    primary: string;
    secondary: string;
    contrastText: string;
  };
  success: string;
  warning: string;
  danger: string;
}

export const lightTheme: ThemeTokens = {
  background: {
    primary: '#F8F9FC',
    secondary: '#F1F4F9',
  },
  surface: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
  },
  text: {
    primary: '#111827',
    secondary: '#4B5563',
  },
  border: {
    default: '#E5E7EB',
  },
  brand: {
    primary: '#6C4CF1',
    secondary: '#8B5CF6',
    contrastText: '#FFFFFF',
  },
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
};
