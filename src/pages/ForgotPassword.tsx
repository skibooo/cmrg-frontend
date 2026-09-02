import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import api from '../api/client';
import logo from '../assets/logo.png';
import bg from '../assets/background.jpg';
import './Login.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message);
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
          <h3>Reset your password</h3>
          {submitted ? (
            <div>
              <p style={{ marginTop: 10 }}>{message}</p>
              <p className="create-account" style={{ marginTop: 16 }}>
                <Link to="/login">Back to Sign In</Link>
              </p>
            </div>
          ) : (
            <form className="login-form" onSubmit={handleSubmit}>
              <p style={{ marginBottom: 16, color: '#666', fontSize: 14 }}>
                Enter your email and we'll send you a link to reset your password.
              </p>
              <div className="input-icon-wrap">
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@cmrgltd.com"
                  required
                />
              </div>
              {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
              <button className="login-btn" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
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