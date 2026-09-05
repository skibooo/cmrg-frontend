import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ZohoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } else {
      navigate('/login?error=zoho_failed');
    }
  }, [navigate]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      Signing you in...
    </div>
  );
}