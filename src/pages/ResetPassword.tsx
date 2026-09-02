import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import api from '../api/client';
import logo from '../assets/logo.png';
import bg from '../assets/background.jpg';
import './Login.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('This reset link is missing its token. Please request a new one.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
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
          <h3>Set a new password</h3>
          {success ? (
            <p style={{ marginTop: 10, color: '#2e7d32' }}>
              Password updated successfully. Redirecting you to sign in...
            </p>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-icon-wrap">
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  required
                />
              </div>
              <div className="input-icon-wrap" style={{ marginTop: 12 }}>
                <Lock size={16} className="input-icon" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
              <p className="create-account" style={{ marginTop: 16 }}>
                <Link to="/login">Back to Sign In</Link>
              </p>
            </form>
          )}
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