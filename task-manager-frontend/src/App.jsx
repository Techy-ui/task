import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './App.css'; 

function App() {
  // Authentication states
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const [authMessage, setAuthMessage] = useState('');

  // Collaborative Task states
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState(''); 

  const API_TASKS_URL = 'https://task-42nt.onrender.com/api/tasks';
  const API_AUTH_URL = 'https://task-42nt.onrender.com/api/auth';

  useEffect(() => {
    if (token) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [token]);

  useEffect(() => {
    const socket = io('https://task-42nt.onrender.com');
    
    socket.on('task_changed', () => {
      if (token) fetchTasks();
    });
    
    return () => socket.disconnect();
  }, [token]);

  const getAuthConfig = () => ({
    headers: { 'Authorization': token }
  });

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_TASKS_URL, getAuthConfig());
      setTasks(response.data);
    } catch (error) {
      if (error.response?.status === 401) handleLogout();
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage('');
    if (!authUsername.trim() || !authPassword.trim()) return;

    const endpoint = isLoginView ? '/login' : '/signup';
    try {
      const response = await axios.post(`${API_AUTH_URL}${endpoint}`, {
        username: authUsername,
        password: authPassword
      });

      if (isLoginView) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        setToken(response.data.token);
        setUsername(response.data.username);
        setAuthUsername('');
        setAuthPassword('');
      } else {
        setAuthMessage('Registration successful! Please log in.');
        setIsLoginView(true);
        setAuthPassword('');
      }
    } catch (error) {
      setAuthMessage(error.response?.data?.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
    setUsername('');
    setAuthMessage('');
  };

  // Upgraded task handler that logs payloads and handles click events directly
  const handleAddTask = async () => {
    if (!title.trim() || !assignedTo.trim()) {
      alert("Please enter both a Title and an Assignee!");
      return;
    }

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedTo.trim()
    };

    console.log("== FRONTEND ATTEMPTING ACTION ==");
    console.log("Payload Package Content:", taskPayload);
    console.log("Using Auth Headers:", getAuthConfig());

    try {
      const response = await axios.post(
        API_TASKS_URL, 
        taskPayload, 
        getAuthConfig()
      );
      console.log("Server Response Received successfully:", response.data);
      setTitle('');
      setDescription('');
      setAssignedTo('');
    } catch (error) {
      console.error('Network Error Dispatching Task:', error.response?.data || error.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    let nextStatus = 'Pending';
    if (currentStatus === 'Pending') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Completed';

    try {
      const response = await axios.put(`${API_TASKS_URL}/${id}`, { status: nextStatus }, getAuthConfig());
      setTasks(tasks.map(task => task._id === id ? response.data : task));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_TASKS_URL}/${id}`, getAuthConfig());
      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  const getBadgeClass = (status) => {
    if (status === 'In Progress') return 'badge-progress';
    if (status === 'Completed') return 'badge-completed';
    return 'badge-pending';
  };

  // --- AUTHENTICATION VIEW ---
  if (!token) {
    return (
      <div className="auth-wrapper">
        <div className="auth-container">
          <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>Team Workspace</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', marginTop: 0, marginBottom: '24px' }}>
            {isLoginView ? 'Sign in to access corporate task flows' : 'Create a secure team member account'}
          </p>
          
          {authMessage && (
            <div style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              fontSize: '14px',
              marginBottom: '16px',
              background: authMessage.includes('successful') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: authMessage.includes('successful') ? '#34d399' : '#f43f5e',
              border: authMessage.includes('successful') ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)'
            }}>
              {authMessage}
            </div>
          )}
          
          <form onSubmit={handleAuthSubmit} className="form-group">
            <input 
              type="text" 
              placeholder="Username" 
              value={authUsername} 
              className="input-field"
              onChange={(e) => setAuthUsername(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={authPassword} 
              className="input-field"
              onChange={(e) => setAuthPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
              {isLoginView ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={{ marginTop: '24px', fontSize: '14px', textAlign: 'center', color: 'var(--text-muted)' }}>
            {isLoginView ? "New to the team?" : "Already have an account?"}{' '}
            <span 
              onClick={() => { setIsLoginView(!isLoginView); setAuthMessage(''); }} 
              style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}
            >
              {isLoginView ? 'Register here' : 'Sign in here'}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // --- COLLABORATIVE MAIN DASHBOARD ---
  return (
    <div className="app-container">
      {/* Top Navbar */}
      <div className="navbar">
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Organization /</span>
          <strong style={{ marginLeft: '6px', color: 'var(--text-main)' }}>Shared Workspace</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Operator: <strong style={{ color: 'var(--text-main)' }}>{username}</strong></span>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid split */}
      <div className="workspace-grid">
        
        {/* LEFT COMPONENT: Task Deployment Panel (Bypasses Native Form Submit reloads) */}
        <div className="form-card">
          <h3 style={{ marginBottom: '20px' }}>Deploy New Task</h3>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Task Title " 
              value={title} 
              className="input-field"
              onChange={(e) => setTitle(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Assign To " 
              value={assignedTo} 
              className="input-field"
              onChange={(e) => setAssignedTo(e.target.value)}
            />
            <textarea 
              placeholder="Provide clean instructions or deployment notes..." 
              value={description} 
              className="input-field"
              rows="4"
              style={{ resize: 'none' }}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button 
              type="button" 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={handleAddTask}
            >
              Add to Shared Board
            </button>
          </div>
        </div>

        {/* RIGHT COMPONENT: Filtered Workspace Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>My Action Items Feed</h3>
            <span style={{ fontSize: '12px', color: 'var(--success-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', background: 'var(--success-color)', borderRadius: '50%', display: 'inline-block' }}></span> 
              Live Team Sync Active
            </span>
          </div>
          
          {tasks.length === 0 ? (
            <div style={{ background: 'rgba(30, 41, 59, 0.4)', border: '1px dashed var(--border-color)', padding: '60px 40px', borderRadius: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No tasks currently tracked in this workspace. Assign a task to get started!
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map(task => (
                <li key={task._id} className="task-card">
                  <div className="task-header">
                    <h4 className="task-title">{task.title}</h4>
                    <span className={`badge ${getBadgeClass(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <p className="task-desc">{task.description || 'No descriptive criteria provided.'}</p>
                  
                  {/* Dynamic Assignment Metadata Banner with safe conditional fallbacks */}
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>
                      🎯 Assignees:{' '}
                      <span style={{ color: 'var(--primary-color)', fontWeight: '600' }}>
                        {task.assignedTo && Array.isArray(task.assignedTo) ? (
                          task.assignedTo.map(name => `@${name}`).join(', ')
                        ) : typeof task.assignedTo === 'string' ? (
                          `@${task.assignedTo}`
                        ) : (
                          '@Unassigned'
                        )}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.7 }}>
                      🔨 Created by: @{task.creatorName || 'System'}
                    </div>
                  </div>

                  <div className="actions-row">
                    <button onClick={() => handleToggleStatus(task._id, task.status)} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }}>
                      Update Status
                    </button>
                    <button onClick={() => handleDeleteTask(task._id)} className="btn btn-danger" style={{ padding: '6px 14px', fontSize: '13px' }}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;