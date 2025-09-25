'use client';

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

const ThemeContext = createContext<{theme: string, setTheme: Dispatch<SetStateAction<string>>}>({
  theme: 'auto',
  setTheme: () => {}
});

export default function ThemeProvider({ 
  children 
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'auto') {
      document.documentElement.dataset.theme = theme;
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    document.documentElement.dataset.theme = mediaQuery.matches ? 'dark' : 'light';

    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    }

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return 'auto';
  }
  return localStorage.getItem('theme') || 'auto';
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('Color Theme must be provided by ThemeProvider');
  }
  return context;
}