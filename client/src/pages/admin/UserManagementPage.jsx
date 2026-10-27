import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, ShieldCheck, UserCheck, Trash2, Shield, ArrowUpDown } from 'lucide-react';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserManagementPage = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRole, setNewRole] = useState('farmer');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await api.get(`/admin/users${params}`);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('[AdminUsers] Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/admin/users/${selectedUser._id}/role`, { role: newRole });
      setIsRoleModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('[AdminUsers] Error updating role:', err);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await api.delete(`/admin/users/${selectedUser._id}`);
      setIsDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('[AdminUsers] Error deleting user:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading user directory..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
        <div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase">
            Administrative Access
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
            User Accounts & Role Permissions
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Audit registered farmers, manage administrator authorizations, and maintain access security.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, district..."
            className="px-3.5 py-2 text-xs rounded-xl border border-gray-200 outline-none w-56 focus:border-emerald-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-100">
              <tr>
                <th className="p-4 sm:p-5">User</th>
                <th className="p-4 sm:p-5">Contact</th>
                <th className="p-4 sm:p-5">Location</th>
                <th className="p-4 sm:p-5">Role</th>
                <th className="p-4 sm:p-5">Joined</th>
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => {
                const isSelf = u._id === currentAdmin?._id;
                return (
                  <tr key={u._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase">
                          {u.fullName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p>{u.fullName}</p>
                          <p className="text-[11px] text-gray-400 font-normal">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 text-gray-600">{u.mobileNumber}</td>
                    <td className="p-4 sm:p-5 text-gray-600">
                      {u.district}, {u.state}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4 sm:p-5 text-right space-x-1">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setNewRole(u.role === 'admin' ? 'farmer' : 'admin');
                          setIsRoleModalOpen(true);
                        }}
                        disabled={isSelf}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-700 font-bold text-[11px] rounded-lg transition-colors disabled:opacity-30"
                        title="Change User Role"
                      >
                        Change Role
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setIsDeleteModalOpen(true);
                        }}
                        disabled={isSelf}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-30"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Modify User Role & Privileges"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Update role permissions for <strong className="text-gray-900">{selectedUser?.fullName}</strong> ({selectedUser?.email}).
          </p>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">New Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none bg-white"
            >
              <option value="farmer">Farmer (Standard Access)</option>
              <option value="admin">Administrator (Full Admin Access)</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateRole}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              Confirm Role Update
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm User Account Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to permanently delete the account of{' '}
            <strong className="text-gray-900">{selectedUser?.fullName}</strong>?
          </p>
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800">
            <strong>Warning:</strong> This will delete all associated farms, crops, soil cards, and pest surveillance records.
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="px-5 py-2 text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs"
            >
              Delete User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagementPage;
