import { useEffect, useState } from 'react';
import api from '../api/client';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import './Dashboard.css';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('enumerator');
  const [saving, setSaving] = useState(false);

  const loadUsers = () => {
    api.get('/users').then(res => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

   const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setSaving(true);
    try {
      await api.post('/users', { name, email, password, role });
      setName(''); setEmail(''); setPassword('');
      loadUsers();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-container">
      <Sidebar />
      <div className="dash-main">
        <TopBar title="Users & Teams" />
        <div className="dash-content">
          <div className="dash-panel" style={{ marginBottom: 20 }}>
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" style={{ padding: 10, border: '1px solid #ccc', borderRadius: 6 }} />
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ padding: 10, border: '1px solid #ccc', borderRadius: 6 }} />
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" style={{ padding: 10, border: '1px solid #ccc', borderRadius: 6 }} />
              <select value={role} onChange={e => setRole(e.target.value)} style={{ padding: 10, border: '1px solid #ccc', borderRadius: 6 }}>
                <option value="enumerator">Enumerator</option>
                <option value="admin">Admin</option>
              </select>
                <button type="submit" disabled={saving} style={{ background: '#c81e2c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
                {saving ? 'Adding...' : 'Add User'}
              </button>
            </form>
          </div>

          <div className="dash-panel">
            {users.map((u) => (
              <div key={u.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{u.name}</strong>
                  <div style={{ fontSize: 12, color: '#888' }}>{u.email}</div>
                </div>
                <span style={{ textTransform: 'capitalize', color: u.role === 'admin' ? '#c81e2c' : '#555' }}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}