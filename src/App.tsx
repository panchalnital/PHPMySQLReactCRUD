import React, { useState, useEffect, useCallback } from 'react';
import { User, UserFormData } from './types';
import { api } from './services/api';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import DeleteConfirm from './components/DeleteConfirm';
import PHPCodeViewer from './components/PHPCodeViewer';
import Toast from './components/Toast';

type ViewMode = 'app' | 'code';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('app');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ show: true, message, type });
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAll();
      setUsers(data);
    } catch (error) {
      showToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: UserFormData) => {
    setFormLoading(true);
    try {
      if (editingUser) {
        await api.update(editingUser.id, data);
        showToast('User updated successfully!', 'success');
      } else {
        await api.create(data);
        showToast('User created successfully!', 'success');
      }
      setShowForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      showToast('Operation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    setFormLoading(true);
    try {
      await api.delete(deletingUser.id);
      showToast('User deleted successfully!', 'success');
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      showToast('Delete failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Toast Notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CRUD Application</h1>
                <p className="text-xs text-gray-500">React + PHP + MySQL</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('app')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'app'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📱 App Demo
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  viewMode === 'code'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💻 PHP Code
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'app' ? (
          <>
            {/* Architecture Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-700 font-medium">React Frontend</span>
                </div>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="text-purple-700 font-medium">PHP REST API</span>
                </div>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-green-700 font-medium">MySQL Database</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search users by name, email, phone, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition font-medium flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                    <p className="text-xs text-gray-500">Total Users</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
                    <p className="text-xs text-gray-500">Showing</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">CRUD</p>
                    <p className="text-xs text-gray-500">Operations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <UserTable
                users={filteredUsers}
                onEdit={handleEdit}
                onDelete={(id) => {
                  const user = users.find(u => u.id === id);
                  if (user) setDeletingUser(user);
                }}
                loading={loading}
              />
            </div>
          </>
        ) : (
          <>
            {/* Code View */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">PHP + MySQL Backend Code</h2>
              <p className="text-gray-600">
                Below is the complete PHP backend code for the CRUD operations. Copy these files to your server
                to connect the React frontend to a real MySQL database.
              </p>
            </div>

            {/* Setup Instructions */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-amber-800 mb-2">📋 Setup Instructions</h3>
              <ol className="list-decimal list-inside text-sm text-amber-700 space-y-1">
                <li>Install XAMPP/WAMP or similar PHP + MySQL server</li>
                <li>Create the database using the SQL schema (MySQL Schema tab)</li>
                <li>Place PHP files in your server's htdocs directory</li>
                <li>Update the API URL in the React frontend to point to your PHP server</li>
                <li>Start the PHP server and run the React app</li>
              </ol>
            </div>

            <PHPCodeViewer />
          </>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <UserForm
          user={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          loading={formLoading}
        />
      )}

      {deletingUser && (
        <DeleteConfirm
          userName={deletingUser.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingUser(null)}
          loading={formLoading}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              CRUD Application — React Frontend + PHP REST API + MySQL Database
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                React
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                PHP
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                MySQL
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
