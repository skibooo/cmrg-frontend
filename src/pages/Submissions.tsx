import { useEffect, useState } from 'react';
import api from '../api/client';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import './Dashboard.css';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    api.get('/submissions').then(res => setSubmissions(res.data));
    api.get('/forms').then(res => setForms(res.data));
  }, []);

  const formName = (id: number) => forms.find(f => f.id === id)?.name || 'Unknown';

  const statusColor = (status: string) => {
    if (status === 'synced') return '#2e7d32';
    if (status === 'pending') return '#f9a825';
    return '#c62828';
  };

  return (
    <div className="dash-container">
      <Sidebar />
      <div className="dash-main">
        <TopBar title="Submissions" />
        <div className="dash-content">
          <div className="dash-panel">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '10px 0' }}>ID</th>
                  <th>Form</th>
                  <th>Status</th>
                  <th>GPS</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 0' }}>#{s.id}</td>
                    <td>{formName(s.form_id)}</td>
                    <td>
                      <span style={{ color: statusColor(s.status), fontWeight: 600 }}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      {s.gps_lat && s.gps_lng ? `${s.gps_lat}, ${s.gps_lng}` : '—'}
                    </td>
                    <td>{new Date(s.submitted_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}