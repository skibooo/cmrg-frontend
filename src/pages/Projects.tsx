import { useEffect, useState } from 'react';
import api from '../api/client';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import './Dashboard.css';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const loadProjects = () => {
    api.get('/projects').then(res => setProjects(res.data));
  };

  useEffect(() => {
    loadProjects();
  }, []);

    const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api.post('/projects', { name });
      setName('');
      loadProjects();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dash-container">
      <Sidebar />
      <div className="dash-main">
        <TopBar title="Projects" />
        <div className="dash-content">
          <div className="dash-panel" style={{ marginBottom: 20 }}>
            <form onSubmit={handleCreate} style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="New project name"
                style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
              />
                            <button
                type="submit"
                disabled={saving}
                style={{ background: '#c81e2c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
              >
                {saving ? 'Adding...' : 'Add Project'}
              </button>
            </form>
          </div>

          <div className="dash-panel">
            {projects.map((p) => (
              <div key={p.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                <strong>{p.name}</strong>
                <div style={{ fontSize: 12, color: '#888' }}>
                  Created {new Date(p.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}