import { useEffect, useState } from 'react';
import api from '../api/client';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import './Dashboard.css';


interface Question {
  key: string;
  label: string;
  type: 'text' | 'gps' | 'choice' | 'date' | 'photo' | 'audio' | 'barcode';
  options?: string[];
}

export default function Forms() {
  const [forms, setForms] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [viewingForm, setViewingForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editQuestions, setEditQuestions] = useState<Question[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadForms = () => {
    api.get('/forms').then(res => setForms(res.data));
  };

  useEffect(() => {
    loadForms();
    api.get('/projects').then(res => setProjects(res.data));
  }, []);

  const addQuestionTo = (
    list: Question[],
    setList: (q: Question[]) => void,
    type: Question['type']
  ) => {
    const key = `q_${Date.now()}`;
    setList([...list, { key, label: '', type, options: type === 'choice' ? ['Option 1'] : undefined }]);
  };

  const updateQuestionIn = (
    list: Question[],
    setList: (q: Question[]) => void,
    index: number,
    patch: Partial<Question>
  ) => {
    const copy = [...list];
    copy[index] = { ...copy[index], ...patch };
    setList(copy);
  };

  const removeQuestionFrom = (
    list: Question[],
    setList: (q: Question[]) => void,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const addOptionTo = (
    list: Question[],
    setList: (q: Question[]) => void,
    qIndex: number
  ) => {
    const copy = [...list];
    copy[qIndex].options = [...(copy[qIndex].options || []), `Option ${(copy[qIndex].options?.length || 0) + 1}`];
    setList(copy);
  };

  const updateOptionIn = (
    list: Question[],
    setList: (q: Question[]) => void,
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const copy = [...list];
    copy[qIndex].options![oIndex] = value;
    setList(copy);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !projectId || questions.length === 0) {
      alert('Add a name, project, and at least one question.');
      return;
    }
    setSaving(true);
    await api.post('/forms', { name, project_id: Number(projectId), question_schema: questions });
    setName('');
    setQuestions([]);
    setBuilderOpen(false);
    setSaving(false);
    loadForms();
  };

  const startEditing = () => {
    setEditName(viewingForm.name);
    setEditQuestions(viewingForm.question_schema ? JSON.parse(JSON.stringify(viewingForm.question_schema)) : []);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditName('');
    setEditQuestions([]);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim() || editQuestions.length === 0) {
      alert('Form needs a name and at least one question.');
      return;
    }
    setSavingEdit(true);
    const res = await api.put(`/forms/${viewingForm.id}`, {
      name: editName,
      question_schema: editQuestions,
    });
    setSavingEdit(false);
    setIsEditing(false);
    setViewingForm(res.data);
    loadForms();
  };

  const projectName = (id: number) => projects.find(p => p.id === id)?.name || 'Unknown';

  return (
    <div className="dash-container">
      <Sidebar />
      <div className="dash-main">
        <TopBar title="Forms" />
        <div className="dash-content">
          {!builderOpen && (
            <button
              onClick={() => setBuilderOpen(true)}
              style={{ background: '#c81e2c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', marginBottom: 20 }}
            >
              + Build New Form
            </button>
          )}

          {builderOpen && (
            <div className="dash-panel" style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 16 }}>New Form</h4>

              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)} style={{ padding: 10, border: '1px solid #ccc', borderRadius: 6 }}>
                  <option value="">Select project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Form name"
                  style={{ flex: 1, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
                />
              </div>

              {questions.map((q, qIndex) => (
                <div key={q.key} style={{ border: '1px solid #eee', borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>{q.type}</span>
                    <input
                      type="text"
                      value={q.label}
                      onChange={(e) => updateQuestionIn(questions, setQuestions, qIndex, { label: e.target.value })}
                      placeholder="Question text"
                      style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
                    />
                    <button type="button" onClick={() => removeQuestionFrom(questions, setQuestions, qIndex)} style={{ color: '#c62828', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                  </div>

                  {q.type === 'choice' && (
                    <div style={{ paddingLeft: 12 }}>
                      {q.options?.map((opt, oIndex) => (
                        <input
                          key={oIndex}
                          type="text"
                          value={opt}
                          onChange={(e) => updateOptionIn(questions, setQuestions, qIndex, oIndex, e.target.value)}
                          style={{ display: 'block', marginBottom: 6, padding: 6, border: '1px solid #ccc', borderRadius: 6, width: '200px' }}
                        />
                      ))}
                      <button type="button" onClick={() => addOptionTo(questions, setQuestions, qIndex)} style={{ fontSize: 12, color: '#c81e2c', border: 'none', background: 'none', cursor: 'pointer' }}>+ Add option</button>
                    </div>
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button type="button" onClick={() => addQuestionTo(questions, setQuestions, 'text')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Text</button>
                <button type="button" onClick={() => addQuestionTo(questions, setQuestions, 'gps')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ GPS</button>
                <button type="button" onClick={() => addQuestionTo(questions, setQuestions, 'choice')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Choice</button>
                <button type="button" onClick={() => addQuestionTo(questions, setQuestions, 'date')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Date</button>
                <button type="button" onClick={() => addQuestionTo(questions, setQuestions, 'photo')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Photo</button>
                <button type="button" onClick={() => addQuestionTo(questions, setQuestions, 'audio')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Audio</button>
                <button type="button" onClick={() => addQuestionTo(questions, setQuestions, 'barcode')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Barcode</button>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleCreate} disabled={saving} style={{ background: '#c81e2c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
                  {saving ? 'Saving...' : 'Save Form'}
                </button>
                <button onClick={() => { setBuilderOpen(false); setQuestions([]); }} style={{ background: 'white', border: '1px solid #ccc', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}

          <div className="dash-panel">
            {forms.map((f) => (
              <div
                key={f.id}
                onClick={() => { setViewingForm(f); setIsEditing(false); }}
                style={{ padding: '12px 0', borderBottom: '1px solid #eee', cursor: 'pointer' }}
              >
                <strong>{f.name}</strong>
                <div style={{ fontSize: 12, color: '#888' }}>
                  Project: {projectName(f.project_id)} · {f.question_schema?.length || 0} question(s) · Created {new Date(f.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {viewingForm && !isEditing && (
            <div className="dash-panel" style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4>{viewingForm.name}</h4>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={startEditing} style={{ background: '#c81e2c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => setViewingForm(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>Close ✕</button>
                </div>
              </div>
              {(!viewingForm.question_schema || viewingForm.question_schema.length === 0) && (
                <p style={{ color: '#888' }}>This form has no questions (created before the form builder existed).</p>
              )}
              {viewingForm.question_schema?.map((q: any, i: number) => (
                <div key={i} style={{ border: '1px solid #eee', borderRadius: 8, padding: 14, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>{q.type} — Question {i + 1}</div>
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{q.label}</div>
                  {q.type === 'choice' && (
                    <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>
                      Options: {q.options?.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {viewingForm && isEditing && (
            <div className="dash-panel" style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4>Editing: {viewingForm.name}</h4>
                <button onClick={cancelEditing} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>Close ✕</button>
              </div>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Form name"
                style={{ width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 6, marginBottom: 16 }}
              />

              {editQuestions.map((q, qIndex) => (
                <div key={q.key} style={{ border: '1px solid #eee', borderRadius: 8, padding: 14, marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>{q.type}</span>
                    <input
                      type="text"
                      value={q.label}
                      onChange={(e) => updateQuestionIn(editQuestions, setEditQuestions, qIndex, { label: e.target.value })}
                      placeholder="Question text"
                      style={{ flex: 1, padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
                    />
                    <button type="button" onClick={() => removeQuestionFrom(editQuestions, setEditQuestions, qIndex)} style={{ color: '#c62828', border: 'none', background: 'none', cursor: 'pointer' }}>Remove</button>
                  </div>

                  {q.type === 'choice' && (
                    <div style={{ paddingLeft: 12 }}>
                      {q.options?.map((opt, oIndex) => (
                        <input
                          key={oIndex}
                          type="text"
                          value={opt}
                          onChange={(e) => updateOptionIn(editQuestions, setEditQuestions, qIndex, oIndex, e.target.value)}
                          style={{ display: 'block', marginBottom: 6, padding: 6, border: '1px solid #ccc', borderRadius: 6, width: '200px' }}
                        />
                      ))}
                      <button type="button" onClick={() => addOptionTo(editQuestions, setEditQuestions, qIndex)} style={{ fontSize: 12, color: '#c81e2c', border: 'none', background: 'none', cursor: 'pointer' }}>+ Add option</button>
                    </div>
                  )}
                </div>
              ))}

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button type="button" onClick={() => addQuestionTo(editQuestions, setEditQuestions, 'text')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Text</button>
                <button type="button" onClick={() => addQuestionTo(editQuestions, setEditQuestions, 'gps')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ GPS</button>
                <button type="button" onClick={() => addQuestionTo(editQuestions, setEditQuestions, 'choice')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Choice</button>
                <button type="button" onClick={() => addQuestionTo(editQuestions, setEditQuestions, 'date')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Date</button>
                <button type="button" onClick={() => addQuestionTo(editQuestions, setEditQuestions, 'photo')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Photo</button>
                <button type="button" onClick={() => addQuestionTo(editQuestions, setEditQuestions, 'audio')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Audio</button>
                <button type="button" onClick={() => addQuestionTo(editQuestions, setEditQuestions, 'barcode')} className="quick-action-btn" style={{ width: 'auto', padding: '8px 14px' }}>+ Barcode</button>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleSaveEdit} disabled={savingEdit} style={{ background: '#c81e2c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={cancelEditing} style={{ background: 'white', border: '1px solid #ccc', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}