import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function TopBar({ title }: { title: string }) {
  const [user, setUser] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    }
  }, []);

  return (
    <div className="dash-topbar">
      <div className="dash-topbar-title">{title}</div>
      <div className="dash-topbar-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <div className="dash-user-info">
          <div className="dash-user-name">User #{user?.id}</div>
          <div className="dash-user-role" style={{ textTransform: 'capitalize' }}>{user?.role}</div>
        </div>
        <div className="dash-avatar">{user?.role?.[0]?.toUpperCase()}</div>
      </div>
    </div>
  );
}
