import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [active, setActive] = useState('users');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    try {
      const [usersRes, chefsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/chefs')
      ]);
      setUsers(usersRes.data);
      setChefs(chefsRes.data);
    } catch (err) {
      setMessage('Failed to load admin data');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateUser = async (u) => {
    const name = window.prompt('Name', u.name);
    if (name === null) return;
    const role = window.prompt('Role (user/chef/admin)', u.role);
    if (role === null) return;

    try {
      await api.patch(`/admin/users/${u._id}`, { name, role });
      setMessage('User updated');
      load();
    } catch {
      setMessage('User update failed');
    }
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`Delete user ${u.email}?`)) return;
    try {
      await api.delete(`/admin/users/${u._id}`);
      setMessage('User deleted');
      load();
    } catch {
      setMessage('User delete failed');
    }
  };

  const updateChef = async (c) => {
    const pricing = window.prompt('Pricing', String(c.pricing || 0));
    if (pricing === null) return;
    const experience = window.prompt('Experience', String(c.experience || 0));
    if (experience === null) return;

    try {
      await api.patch(`/admin/chefs/${c.userId._id}`, {
        pricing: Number(pricing),
        experience: Number(experience)
      });
      setMessage('Chef updated');
      load();
    } catch {
      setMessage('Chef update failed');
    }
  };

  const deleteChef = async (c) => {
    if (!window.confirm(`Delete chef ${c.userId?.email}?`)) return;
    try {
      await api.delete(`/admin/chefs/${c.userId._id}`);
      setMessage('Chef deleted');
      load();
    } catch {
      setMessage('Chef delete failed');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      onLogout();
      navigate('/login');
    }
  };

  return (
    <div className="screen dashboard-shell">
      <header className="topbar card topbar-card">
        <div>
          <p className="kicker">Private Reserve Control</p>
          <h1 className="admin-title">ChefKart Admin Portal</h1>
          <p className="muted">Logged in as {user.email}</p>
        </div>
        <div className="actions">
          <button className={active === 'users' ? 'active' : ''} onClick={() => setActive('users')}>Users</button>
          <button className={active === 'chefs' ? 'active' : ''} onClick={() => setActive('chefs')}>Chefs</button>
          <button onClick={load}>Refresh</button>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {message && <div className="notice">{message}</div>}

      {active === 'users' ? (
        <section className="card table-card">
          <div className="section-head">
            <h2>All Users</h2>
            <span className="count-pill">{users.length}</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="role-chip">{u.role}</span></td>
                  <td className="row-actions">
                    <button onClick={() => updateUser(u)}>Edit</button>
                    <button className="danger" onClick={() => deleteUser(u)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <section className="card table-card">
          <div className="section-head">
            <h2>All Chefs</h2>
            <span className="count-pill">{chefs.length}</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Pricing</th>
                <th>Experience</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chefs.map((c) => (
                <tr key={c._id}>
                  <td>{c.userId?.name}</td>
                  <td>{c.userId?.email}</td>
                  <td>₹{c.pricing}</td>
                  <td>{c.experience} yrs</td>
                  <td className="row-actions">
                    <button onClick={() => updateChef(c)}>Edit</button>
                    <button className="danger" onClick={() => deleteChef(c)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
