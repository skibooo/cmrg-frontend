import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import api from '../api/client';
import './Dashboard.css';

export default function Exports() {
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingSav, setExportingSav] = useState(false);

  const handleExport = async (format: 'csv' | 'sav', setLoading: (v: boolean) => void) => {
    setLoading(true);
    try {
      const res = await api.get(`/exports/submissions.${format}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`${format} export failed:`, err);
      alert(`Export failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-container">
      <Sidebar />
      <div className="dash-main">
        <TopBar title="Exports" />
        <div className="dash-content">
          <div className="dash-panel">
            <h4>Export Submissions</h4>
            <p style={{ color: '#888', marginBottom: 16 }}>Download all submission data.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => handleExport('csv', setExportingCsv)}
                disabled={exportingCsv}
                style={{ background: '#c81e2c', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 6, cursor: 'pointer' }}
              >
                {exportingCsv ? 'Exporting...' : 'Export to CSV'}
              </button>
              <button
                onClick={() => handleExport('sav', setExportingSav)}
                disabled={exportingSav}
                style={{ background: 'white', color: '#c81e2c', border: '1px solid #c81e2c', padding: '12px 24px', borderRadius: 6, cursor: 'pointer' }}
              >
                {exportingSav ? 'Exporting...' : 'Export to SPSS (.sav)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}