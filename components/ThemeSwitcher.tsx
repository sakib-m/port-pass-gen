import React, { useState, useEffect, useCallback } from 'react';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);

const SystemIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
);

type Theme = 'light' | 'dark' | 'system';

const ThemeSwitcher: React.FC = () => {
    const [theme, setTheme] = useState<Theme>('system');

    const applyTheme = useCallback((themeToApply: 'light' | 'dark') => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(themeToApply);
    }, []);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        const initialTheme = storedTheme || 'system';
        setTheme(initialTheme);
    }, []);

    useEffect(() => {
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme(mediaQuery.matches ? 'dark' : 'light');
            handleChange(); // apply initial system theme
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            applyTheme(theme);
        }
    }, [theme, applyTheme]);
    
    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="theme-switcher">
            <button 
                onClick={() => handleThemeChange('light')} 
                className={theme === 'light' ? 'active' : ''}
                title="Light Mode"
            >
                <SunIcon />
            </button>
            <button 
                onClick={() => handleThemeChange('dark')} 
                className={theme === 'dark' ? 'active' : ''}
                title="Dark Mode"
            >
                <MoonIcon />
            </button>
            <button 
                onClick={() => handleThemeChange('system')} 
                className={theme === 'system' ? 'active' : ''}
                title="System Preference"
            >
                <SystemIcon />
            </button>
        </div>
    );
}

export default ThemeSwitcher;