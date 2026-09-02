import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import api from '../api/client';
import logo from '../assets/logo.png';
import bg from '../assets/background.jpg';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="CMRG Ltd" className="login-logo-img" />
        <div className="login-tagline">CMRG DATA COLLECTION</div>
        <p className="login-subtitle">Collect Better. Decide Smarter.</p>
        <div className="login-card">
          <h3>Sign in to your account</h3>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@cmrgltd.com" required />
            </div>
            <div className="password-row">
              <label>Password</label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
            </div>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="divider"><span>or</span></div>
          <button className="zoho-btn" type="button">Sign in with Zoho</button>
          <p className="create-account">Don't have an account? <a href="#">Create Account</a></p>
        </div>
      </div>
      <div className="login-right" style={{ backgroundImage: `url(${bg})` }}>
        <div className="login-right-overlay">
          <h1>Smart Data Collection<br/>Smarter Decisions</h1>
          <p>Power your field operations with real-time insights, data quality and complete visibility.</p>
        </div>
      </div>
    </div>
  );
}