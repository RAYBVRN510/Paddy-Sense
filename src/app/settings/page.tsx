"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, isAuthReady, deleteAccount, logout } = useAuth();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHistoryDeleteConfirm, setShowHistoryDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push("/login");
    }
  }, [isAuthReady, user, router]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const success = await deleteAccount();
    if (success) {
      router.push("/");
    }
    setIsDeleting(false);
  };

  const handleDeleteHistory = () => {
    localStorage.setItem("scanHistory", "[]");
    setShowHistoryDeleteConfirm(false);
    alert("Scan history has been cleared");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthReady) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="surface p-6 text-sm text-slate-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <section className="surface p-5 sm:p-6">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-slate-600">Manage profile, preferences, and account actions.</p>
      </section>

      <section className="surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-medium text-slate-500">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-medium text-slate-500">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium text-slate-500">Member since:</span> {new Date().toLocaleDateString()}
          </p>
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
        <div className="mt-4 space-y-4">
          <ToggleRow label="Notifications" enabled={notifications} onToggle={() => setNotifications(!notifications)} />
          <ToggleRow label="Offline Mode" enabled={offlineMode} onToggle={() => setOfflineMode(!offlineMode)} />
          <div>
            <label htmlFor="language" className="mb-2 block text-sm font-medium text-slate-700">
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="es">Espanol</option>
              <option value="fr">Francais</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>
      </section>

      <section className="surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Data Management</h2>
        <button onClick={() => setShowHistoryDeleteConfirm(true)} className="btn-secondary mt-4 w-full">
          Delete Scan History
        </button>
      </section>

      <section className="surface p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900">Account</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button onClick={handleLogout} className="btn-secondary w-full">
            Logout
          </button>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger w-full">
            Delete Account
          </button>
        </div>
      </section>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center">
          <div className="surface w-full max-w-sm p-5">
            <h3 className="text-lg font-semibold text-slate-900">Delete Account</h3>
            <p className="mt-2 text-sm text-slate-600">
              This permanently removes your account and all associated data.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={handleDeleteAccount} disabled={isDeleting} className="btn-danger w-full">
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary w-full">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistoryDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 sm:items-center">
          <div className="surface w-full max-w-sm p-5">
            <h3 className="text-lg font-semibold text-slate-900">Clear History</h3>
            <p className="mt-2 text-sm text-slate-600">Delete all scan history from this device?</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button onClick={handleDeleteHistory} className="btn-danger w-full">
                Delete
              </button>
              <button onClick={() => setShowHistoryDeleteConfirm(false)} className="btn-secondary w-full">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  enabled,
  onToggle,
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-green-700" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
