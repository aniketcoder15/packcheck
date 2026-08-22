import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  UserPlus,
  Activity,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  FileCheck,
  Building,
  Key,
} from 'lucide-react';
import { User, UserRole, AuditLogEntry } from '../types';
import { StorageRepository } from '../utils/storage';
import { useToast } from './Toast';

export const AdminUsersView: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>(StorageRepository.getUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(StorageRepository.getAuditLogs());
  const [showAddModal, setShowAddModal] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('inspector');
  const [newDesignation, setNewDesignation] = useState('Legal Metrology Inspector');
  const [newBadge, setNewBadge] = useState(`LMO/NZ/2026/${Math.floor(100 + Math.random() * 900)}`);
  const [newZone, setNewZone] = useState('North Zone, Delhi');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      showToast({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Name and Email are required to register an enforcement officer.',
      });
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      designation: newDesignation,
      badgeNumber: newBadge,
      jurisdictionZone: newZone,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    StorageRepository.saveUser(newUser);
    setUsers(StorageRepository.getUsers());
    setAuditLogs(StorageRepository.getAuditLogs());
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');

    showToast({
      type: 'success',
      title: 'Officer Registered',
      message: `${newUser.name} added as ${newUser.role}.`,
    });
  };

  const handleToggleActive = (user: User) => {
    const updated = { ...user, isActive: !user.isActive };
    StorageRepository.saveUser(updated);
    setUsers(StorageRepository.getUsers());
    setAuditLogs(StorageRepository.getAuditLogs());
    showToast({
      type: 'info',
      title: 'Officer Status Updated',
      message: `${user.name} is now ${updated.isActive ? 'Active' : 'Deactivated'}.`,
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Enforcement Personnel &amp; System Audit</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Officers &amp; Role Management
          </h1>
          <p className="text-xs text-slate-500">
            Manage authorized inspection personnel, roles, jurisdictions, and review system-wide audit logs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white text-xs font-bold shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Officer</span>
        </button>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className={`bg-white border rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between ${
              user.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                    user.role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : user.role === 'supervisor'
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    user.isActive ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {user.isActive ? '● Active' : '○ Inactive'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <div className="text-xs text-slate-500">{user.designation}</div>
              <div className="text-xs font-mono font-semibold text-blue-700 mt-1">{user.badgeNumber}</div>

              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div>Email: <span className="text-slate-700">{user.email}</span></div>
                <div>Zone: <span className="text-slate-700">{user.jurisdictionZone}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(user)}
                className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold transition-colors"
              >
                {user.isActive ? 'Deactivate Account' : 'Activate Account'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* System Audit Logs */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Enforcement Activity &amp; Audit Trail ({auditLogs.length})</span>
          </div>
          <span className="text-xs text-slate-500">Tamper-evident record</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor / Officer</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400 font-sans">
                    No audit records logged yet.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 font-sans font-medium">
                      {log.actor} ({log.role})
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-sans">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Register Inspection Officer</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Officer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inspector Ramesh Verma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="officer@consumeraffairs.nic.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role / Authorization</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="inspector">Inspector (Field Audits)</option>
                    <option value="supervisor">Supervisor (Review &amp; Notice)</option>
                    <option value="admin">Administrator (Full Control)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge ID</label>
                  <input
                    type="text"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jurisdiction Zone</label>
                <input
                  type="text"
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold shadow-xs"
                >
                  Register Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
