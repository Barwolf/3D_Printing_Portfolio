import React, { createContext, useContext, useState, useEffect } from 'react';

/* 
Something new I learned. Since this needs to change over many pages. 
And it needs to occur at App.jsx level. I can create a context manager
and wrap all of the pages within the context manager. This makes it so I
do not have to pass it down many levels and to mutiple components.
*/

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isdark, setIsdark] = useState(() => {
    try {
      const storedValue = localStorage.getItem('isdark');
      return storedValue ? JSON.parse(storedValue) : false;
    } catch (error) {
      console.error("Failed to parse localStorage value, defaulting to false.");
      return false;
    }
  });

  useEffect(() => {
    const theme = isdark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('isdark', JSON.stringify(isdark));
  }, [isdark]);

  return (
    <ThemeContext.Provider value={{ isdark, setIsdark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}