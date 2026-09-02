import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../pages/Dashboard.css';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Projects', path: '/projects' },
  { label: 'Forms', path: '/forms' },
  { label: 'Submissions', path: '/submissions' },
  { label: 'Users & Teams', path: '/users' },
  { label: 'Assignments', path: '/assignments' },
  { label: 'Exports', path: '/exports' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dash-sidebar">
      <img src={logo} alt="CMRG Ltd" className="sidebar-logo-img" />
      {navItems.map((item) => (
        <div
          key={item.path}
          className={`dash-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </div>
      ))}
      <div style={{ marginTop: 'auto', borderTop: '1px solid #222', paddingTop: 16 }}>
        <div onClick={handleLogout} style={{ padding: '12px 20px', color: '#ff5252', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
          Logout
        </div>
      </div>
    </div>
  );
}