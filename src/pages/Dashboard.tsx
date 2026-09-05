import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../api/client';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import './Dashboard.css';

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    api.get('/projects').then(res => setProjects(res.data));
    api.get('/forms').then(res => setForms(res.data));
    api.get('/submissions').then(res => setSubmissions(res.data));
  }, []);

  const synced = submissions.filter(s => s.status === 'synced').length;
  const pending = submissions.filter(s => s.status === 'pending').length;
  const rejected = submissions.filter(s => s.status === 'rejected').length;

  const donutData = [
    { name: 'Synced', value: synced, color: '#2e7d32' },
    { name: 'Pending', value: pending, color: '#f9a825' },
    { name: 'Rejected', value: rejected, color: '#c62828' },
  ];

   const chartData = submissions
    .slice()
    .sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime())
    .map((_, i) => ({ name: `#${i + 1}`, count: i + 1 }));
    
  return (
    <div className="dash-container">
      <Sidebar />
      <div className="dash-main">
        <TopBar title="Dashboard" />
        <div className="dash-content">
          <div className="dash-stats">
            <div className="dash-stat-card">
              <div className="dash-stat-number">{projects.length}</div>
              <div className="dash-stat-label">Projects</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-number">{forms.length}</div>
              <div className="dash-stat-label">Forms</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-number">-</div>
              <div className="dash-stat-label">Enumerators</div>
            </div>
            <div className="dash-stat-card">
              <div className="dash-stat-number">{submissions.length}</div>
              <div className="dash-stat-label">Submissions</div>
            </div>
          </div>

          <div className="dash-panels-row">
            <div className="dash-panel">
              <div className="panel-header"><h4>Submissions Overview</h4></div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" />
                  <Line type="monotone" dataKey="count" stroke="#c81e2c" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="dash-panel">
              <div className="panel-header"><h4>Submission Status</h4></div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={donutData} dataKey="value" innerRadius={50} outerRadius={70}>
                    {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-legend">
                {donutData.map((d) => (
                  <div key={d.name} className="donut-legend-item">
                    <span className="legend-dot" style={{ background: d.color }}></span>
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dash-panels-row2">
            <div className="dash-panel">
              <div className="panel-header">
                <h4>Recent Submissions</h4>
                <span className="view-all-link">View all</span>
              </div>
              {submissions.slice(0, 5).map((s) => (
                <div key={s.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                  Submission #{s.id} — {s.status}
                </div>
              ))}
            </div>
            <div className="dash-panel">
              <div className="panel-header"><h4>Quick Actions</h4></div>
              <button className="quick-action-btn">+ Create Project</button>
              <button className="quick-action-btn">+ Add Form</button>
              <button className="quick-action-btn">+ Add Enumerator</button>
              <button className="quick-action-btn">Import Form (XLSForm)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}