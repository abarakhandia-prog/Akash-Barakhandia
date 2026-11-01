import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Sparkles,
  BookOpen,
  Download,
  ClipboardCheck,
  CreditCard,
  FileText,
  LogOut,
  Edit2,
  Lock,
  CheckCircle,
  HelpCircle,
  Code2,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileTab: React.FC<{ onOpenApkModal: () => void }> = ({ onOpenApkModal }) => {
  const {
    currentUser,
    setCurrentUser,
    logout,
    openPaymentModal,
    materials,
    downloadedIds,
    testResults,
    transactions,
    savedNotes,
    setActivePdf,
    setIsAuthModalOpen,
    setIsFlutterModalOpen,
    t,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'overview' | 'downloads' | 'results' | 'payments' | 'notes'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editMobile, setEditMobile] = useState(currentUser.mobile);
  const [editCourse, setEditCourse] = useState(currentUser.selectedCourse);
  const [editState, setEditState] = useState(currentUser.state);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const downloadedMaterials = materials.filter((m) => downloadedIds.includes(m.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name: editName,
      mobile: editMobile,
      selectedCourse: editCourse,
      state: editState,
    }));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* 1. Profile Overview Card */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-lg shadow-blue-600/20">
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {currentUser.name}
                </h2>
                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentUser.email}</p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <span>{currentUser.mobile}</span>
                <span>·</span>
                <span>{currentUser.selectedCourse || 'All Courses'}</span>
                <span>·</span>
                <span>{currentUser.state || 'Odisha'}</span>
              </div>
            </div>
          </div>

          {/* Membership Badge & Upgrade Action */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left sm:text-right w-full sm:w-auto">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Current Membership
            </span>
            <div className="text-sm font-bold text-amber-500 flex items-center sm:justify-end gap-1 my-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentUser.planName || 'Free Plan'}</span>
            </div>
            <span className="text-[11px] text-slate-500 block">
              Valid until: {currentUser.subscriptionExpiry || 'Lifetime Free'}
            </span>

            {(!currentUser.planId || currentUser.planId === 'plan_free') && (
              <button
                onClick={() => openPaymentModal()}
                className="mt-2.5 w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition-all"
              >
                Upgrade to Premium
              </button>
            )}
          </div>
        </div>

        {/* Quick actions strip */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="py-1.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
            </button>

            <button
              onClick={() => onOpenApkModal()}
              className="py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold rounded-lg flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install Android APK</span>
            </button>

            <button
              onClick={() => setIsFlutterModalOpen(true)}
              className="py-1.5 px-3 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Flutter Source Code</span>
            </button>
          </div>

          <button
            onClick={logout}
            className="py-1.5 px-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>

        {/* Inline Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Mobile</label>
              <input
                type="text"
                value={editMobile}
                onChange={(e) => setEditMobile(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Target Course</label>
              <input
                type="text"
                value={editCourse}
                onChange={(e) => setEditCourse(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">State</label>
              <input
                type="text"
                value={editState}
                onChange={(e) => setEditState(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-1.5 px-3 bg-slate-100 text-slate-700 rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {saveSuccess && (
          <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Profile details updated successfully!</span>
          </div>
        )}
      </div>

      {/* 2. Secondary Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs font-semibold gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSection('overview')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
            activeSection === 'overview'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Enrolled Courses
        </button>
        <button
          onClick={() => setActiveSection('downloads')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
            activeSection === 'downloads'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          My Downloads ({downloadedMaterials.length})
        </button>
        <button
          onClick={() => setActiveSection('results')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
            activeSection === 'results'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          My Test Results ({testResults.length})
        </button>
        <button
          onClick={() => setActiveSection('payments')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
            activeSection === 'payments'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Payment History & Invoices
        </button>
        <button
          onClick={() => setActiveSection('notes')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors ${
            activeSection === 'notes'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Saved Notes ({savedNotes.length})
        </button>
      </div>

      {/* 3. Section Content */}

      {/* ENROLLED COURSES */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(currentUser.enrolledCourses || ['Odisha Police SI', 'OSSC CGL']).map((course, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded uppercase">
                  Active Enrollment
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2 mb-1">
                  {course}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full syllabus covered with PDF notes, video masterclasses, and CBT test series.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs text-blue-600 font-semibold">
                <span>Resume Learning</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MY DOWNLOADS */}
      {activeSection === 'downloads' && (
        <div className="space-y-3">
          {downloadedMaterials.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
              No offline downloads saved yet. Click the download icon on any study material to read offline.
            </div>
          ) : (
            downloadedMaterials.map((mat) => (
              <div
                key={mat.id}
                onClick={() => setActivePdf(mat)}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 cursor-pointer flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                    PDF
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1">
                      {mat.title}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {mat.subject} · {mat.subCategory} · Saved for Offline Reading
                    </span>
                  </div>
                </div>

                <button className="py-1.5 px-3 bg-blue-600 text-white rounded-lg text-xs font-semibold shrink-0">
                  Read Offline
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TEST RESULTS */}
      {activeSection === 'results' && (
        <div className="space-y-3">
          {testResults.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500">
              No tests attempted yet. Visit the Mock Tests tab to take your first online diagnostic exam!
            </div>
          ) : (
            testResults.map((res) => (
              <div
                key={res.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                    {res.testTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span>Score: {res.marksObtained}/{res.totalMarks}</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-semibold">{res.percentage}%</span>
                    <span>·</span>
                    <span>Rank: #{res.rank}</span>
                    <span>·</span>
                    <span>{new Date(res.completedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">
                    {res.correctAnswers} Correct, {res.wrongAnswers} Wrong
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* PAYMENT HISTORY & INVOICES */}
      {activeSection === 'payments' && (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {tx.planName}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded uppercase">
                    {tx.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Invoice No: <span className="font-mono font-semibold">{tx.invoiceNumber}</span> · Method: {tx.paymentMethod} · Date: {tx.date}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold font-mono text-base text-slate-900 dark:text-white">
                  ₹{tx.amount}
                </span>
                <button
                  onClick={() => alert(`Official GST Tax Invoice\n\nInvoice No: ${tx.invoiceNumber}\nStudent: ${tx.studentName}\nPlan: ${tx.planName}\nAmount Paid: ₹${tx.amount} (Incl. 18% GST)\nPayment ID: ${tx.paymentId}\nStatus: Verified & Active`)}
                  className="py-1 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 dark:text-slate-200 text-xs"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SAVED NOTES */}
      {activeSection === 'notes' && (
        <div className="space-y-3">
          {savedNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {note.title}
                </h4>
                <span className="text-[10px] text-slate-400">{note.updatedAt}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {note.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
