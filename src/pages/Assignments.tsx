import { useEffect, useState } from 'react';
import api from '../api/client';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import './Dashboard.css';

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [formId, setFormId] = useState('');
  const [enumeratorId, setEnumeratorId] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get('/assignments').then(res => setAssignments(res.data));
  };

  useEffect(() => {
    load();
    api.get('/forms').then(res => setForms(res.data));
    api.get('/users').then(res => setUsers(res.data.filter((u: any) => u.role === 'enumerator')));
  }, []);

    const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId || !enumeratorId) return;
    setSaving(true);
    try {
      await api.post('/assignments', { form_id: Number(formId), enumerator_id: Number(enumeratorId) });
      load();
    } finally {
      setSaving(false);
    }
  };

  const formName = (id: number) => forms.find(f => f.id === id)?.name || 'Unknown';
  const userName = (id: number) => users.find(u => u.id === id)?.name || 'Unknown';

  return (
    <div className="dash-container">
      <Sidebar />
      <div className="dash-main">
        <TopBar title="Assignments" />
        <div className="dash-content">
          <div className="dash-panel" style={{ marginBottom: 20 }}>
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10 }}>
              <select value={formId} onChange={e => setFormId(e.target.value)} style={{ padding: 10, border: '1px solid #ccc', borderRadius: 6 }}>
                <option value="">Select form</option>
                {forms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <select value={enumeratorId} onChange={e => setEnumeratorId(e.target.value)} style={{ padding: 10, border: '1px solid #ccc', borderRadius: 6 }}>
                <option value="">Select enumerator</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
                <button type="submit" disabled={saving} style={{ background: '#c81e2c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
                {saving ? 'Assigning...' : 'Assign'}
              </button>
            </form>
          </div>

          <div className="dash-panel">
            {assignments.map(a => (
              <div key={a.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <strong>{formName(a.form_id)}</strong> → {userName(a.enumerator_id)}
                <div style={{ fontSize: 12, color: '#888' }}>Assigned {new Date(a.assigned_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}