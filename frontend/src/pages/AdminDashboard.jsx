import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Shield, Users, ChefHat, Pencil, Trash2, Save, X } from 'lucide-react';

const parseList = (value) => {
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
};

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editingChef, setEditingChef] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!loading && user?.role === 'admin') {
      fetchUsers();
      fetchChefs();
    }
  }, [loading, user]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setMessage('Failed to load users');
    }
  };

  const fetchChefs = async () => {
    try {
      const res = await api.get('/admin/chefs');
      setChefs(res.data);
    } catch (err) {
      setMessage('Failed to load chefs');
    }
  };

  const saveUser = async () => {
    try {
      await api.patch(`/admin/users/${editingUser._id}`, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        address: editingUser.address,
        city: editingUser.city,
        state: editingUser.state,
        pincode: editingUser.pincode,
        profileImage: editingUser.profileImage
      });
      setMessage('User updated successfully');
      setEditingUser(null);
      fetchUsers();
      fetchChefs();
    } catch (err) {
      setMessage('User update failed');
    }
  };

  const removeUser = async (id) => {
    if (!window.confirm('Delete this user and related records?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setMessage('User deleted successfully');
      fetchUsers();
      fetchChefs();
    } catch (err) {
      setMessage('User deletion failed');
    }
  };

  const saveChef = async () => {
    try {
      await api.patch(`/admin/chefs/${editingChef.userId._id}`, {
        name: editingChef.userId.name,
        email: editingChef.userId.email,
        address: editingChef.userId.address,
        city: editingChef.userId.city,
        state: editingChef.userId.state,
        pincode: editingChef.userId.pincode,
        profileImage: editingChef.userId.profileImage,
        cuisines: parseList(editingChef.cuisinesText),
        experience: Number(editingChef.experience) || 0,
        pricing: Number(editingChef.pricing) || 0,
        availability: parseList(editingChef.availabilityText),
        specialties: parseList(editingChef.specialtiesText),
        timeSlots: parseList(editingChef.timeSlotsText),
        bio: editingChef.bio,
        isVerified: !!editingChef.isVerified
      });
      setMessage('Chef updated successfully');
      setEditingChef(null);
      fetchChefs();
      fetchUsers();
    } catch (err) {
      setMessage('Chef update failed');
    }
  };

  const removeChef = async (userId) => {
    if (!window.confirm('Delete this chef and related records?')) return;
    try {
      await api.delete(`/admin/chefs/${userId}`);
      setMessage('Chef deleted successfully');
      fetchChefs();
      fetchUsers();
    } catch (err) {
      setMessage('Chef deletion failed');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" />;

  return (
    <div className="section min-h-screen bg-background">
      <div className="container">
        <div className="flex justify-between items-center mb-10 border-b border-glass-border pb-8">
          <div>
            <h1 className="text-5xl tracking-tighter text-text mb-3">Admin Command Center</h1>
            <p className="text-text-light">Full control over users and chefs</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Shield size={30} />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Users size={18} /> Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('chefs')}
            className={`btn ${activeTab === 'chefs' ? 'btn-primary' : 'btn-outline'}`}
          >
            <ChefHat size={18} /> Chefs ({chefs.length})
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-primary/10 text-primary font-semibold border border-primary/20">
            {message}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="precious-card p-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border text-sm text-text-light">
                  <th className="py-3">Name</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">City</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-glass-border/60">
                    <td className="py-4">{u.name}</td>
                    <td className="py-4">{u.email}</td>
                    <td className="py-4 uppercase text-xs font-bold">{u.role}</td>
                    <td className="py-4">{u.city || '-'}</td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-2 rounded-lg border border-glass-border hover:border-primary"
                          onClick={() => setEditingUser({ ...u })}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
                          onClick={() => removeUser(u._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'chefs' && (
          <div className="precious-card p-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border text-sm text-text-light">
                  <th className="py-3">Name</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Pricing</th>
                  <th className="py-3">Experience</th>
                  <th className="py-3">Verified</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chefs.map((c) => (
                  <tr key={c._id} className="border-b border-glass-border/60">
                    <td className="py-4">{c.userId?.name}</td>
                    <td className="py-4">{c.userId?.email}</td>
                    <td className="py-4">₹{c.pricing}</td>
                    <td className="py-4">{c.experience} yrs</td>
                    <td className="py-4">{c.isVerified ? 'Yes' : 'No'}</td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="p-2 rounded-lg border border-glass-border hover:border-primary"
                          onClick={() => setEditingChef({
                            ...c,
                            cuisinesText: (c.cuisines || []).join(', '),
                            availabilityText: (c.availability || []).join(', '),
                            specialtiesText: (c.specialties || []).join(', '),
                            timeSlotsText: (c.timeSlots || []).join(', ')
                          })}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"
                          onClick={() => removeChef(c.userId?._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[120] p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl">
              <h3 className="text-3xl mb-6">Edit User</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input value={editingUser.name || ''} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} placeholder="Name" />
                <input value={editingUser.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} placeholder="Email" />
                <select value={editingUser.role || 'user'} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
                  <option value="user">user</option>
                  <option value="chef">chef</option>
                  <option value="admin">admin</option>
                </select>
                <input value={editingUser.city || ''} onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })} placeholder="City" />
                <input value={editingUser.state || ''} onChange={(e) => setEditingUser({ ...editingUser, state: e.target.value })} placeholder="State" />
                <input value={editingUser.pincode || ''} onChange={(e) => setEditingUser({ ...editingUser, pincode: e.target.value })} placeholder="Pincode" />
              </div>
              <textarea value={editingUser.address || ''} onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })} placeholder="Address" className="mb-6" />
              <div className="flex justify-end gap-3">
                <button className="btn btn-outline" onClick={() => setEditingUser(null)}><X size={16} /> Cancel</button>
                <button className="btn btn-primary" onClick={saveUser}><Save size={16} /> Save User</button>
              </div>
            </div>
          </div>
        )}

        {editingChef && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[120] p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-auto">
              <h3 className="text-3xl mb-6">Edit Chef</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input value={editingChef.userId?.name || ''} onChange={(e) => setEditingChef({ ...editingChef, userId: { ...editingChef.userId, name: e.target.value } })} placeholder="Name" />
                <input value={editingChef.userId?.email || ''} onChange={(e) => setEditingChef({ ...editingChef, userId: { ...editingChef.userId, email: e.target.value } })} placeholder="Email" />
                <input type="number" value={editingChef.pricing || 0} onChange={(e) => setEditingChef({ ...editingChef, pricing: e.target.value })} placeholder="Pricing" />
                <input type="number" value={editingChef.experience || 0} onChange={(e) => setEditingChef({ ...editingChef, experience: e.target.value })} placeholder="Experience" />
                <input value={editingChef.userId?.city || ''} onChange={(e) => setEditingChef({ ...editingChef, userId: { ...editingChef.userId, city: e.target.value } })} placeholder="City" />
                <input value={editingChef.userId?.state || ''} onChange={(e) => setEditingChef({ ...editingChef, userId: { ...editingChef.userId, state: e.target.value } })} placeholder="State" />
                <input value={editingChef.cuisinesText || ''} onChange={(e) => setEditingChef({ ...editingChef, cuisinesText: e.target.value })} placeholder="Cuisines (comma separated)" />
                <input value={editingChef.availabilityText || ''} onChange={(e) => setEditingChef({ ...editingChef, availabilityText: e.target.value })} placeholder="Availability (comma separated)" />
                <input value={editingChef.specialtiesText || ''} onChange={(e) => setEditingChef({ ...editingChef, specialtiesText: e.target.value })} placeholder="Specialties (comma separated)" />
                <input value={editingChef.timeSlotsText || ''} onChange={(e) => setEditingChef({ ...editingChef, timeSlotsText: e.target.value })} placeholder="Time slots (comma separated)" />
              </div>
              <textarea value={editingChef.bio || ''} onChange={(e) => setEditingChef({ ...editingChef, bio: e.target.value })} placeholder="Bio" className="mb-4" />
              <label className="flex items-center gap-2 mb-6 text-sm font-semibold">
                <input type="checkbox" checked={!!editingChef.isVerified} onChange={(e) => setEditingChef({ ...editingChef, isVerified: e.target.checked })} />
                Verified chef
              </label>
              <div className="flex justify-end gap-3">
                <button className="btn btn-outline" onClick={() => setEditingChef(null)}><X size={16} /> Cancel</button>
                <button className="btn btn-primary" onClick={saveChef}><Save size={16} /> Save Chef</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
