import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  FileText,
  Video,
  Award,
  CreditCard,
  Bell,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Search,
  DollarSign,
  TrendingUp,
  Download,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentCategory, StudyMaterial, MockTest, UserProfile, SubscriptionPlan } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    students,
    setStudents,
    materials,
    setMaterials,
    mockTests,
    setMockTests,
    transactions,
    subscriptionPlans,
    setSubscriptionPlans,
    addNotification,
    currentUser,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'stats' | 'students' | 'courses' | 'pdfs' | 'videos' | 'tests' | 'payments' | 'notifications'
  >('stats');

  // Search in student manager
  const [studentSearch, setStudentSearch] = useState('');

  // Course / Material Creator Form State
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubject, setNewSubject] = useState('Science');
  const [newCategory, setNewCategory] = useState<StudentCategory>('school');
  const [newSubCategory, setNewSubCategory] = useState('Class 10');
  const [newType, setNewType] = useState<'pdf' | 'video' | 'qa' | 'pyq'>('pdf');
  const [newAccess, setNewAccess] = useState<'free' | 'subscription' | 'paid'>('subscription');
  const [newPages, setNewPages] = useState(25);
  const [newDuration, setNewDuration] = useState('25:00 mins');
  const [newContentSnippet, setNewContentSnippet] = useState('');

  // Mock Test Creator State
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [testTitle, setTestTitle] = useState('');
  const [testCategory, setTestCategory] = useState<StudentCategory>('govt_job');
  const [testSubCategory, setTestSubCategory] = useState('Odisha Police');
  const [testDuration, setTestDuration] = useState(15);
  const [testMarks, setTestMarks] = useState(20);
  const [testNegMark, setTestNegMark] = useState(0.25);
  const [testQ1Text, setTestQ1Text] = useState('');
  const [testOptA, setTestOptA] = useState('');
  const [testOptB, setTestOptB] = useState('');
  const [testOptC, setTestOptC] = useState('');
  const [testOptD, setTestOptD] = useState('');
  const [testCorrectIdx, setTestCorrectIdx] = useState(0);
  const [testExplanation, setTestExplanation] = useState('');

  // Notification Broadcast Form
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifType, setNotifType] = useState<'exam' | 'course' | 'offer' | 'announcement'>('exam');
  const [notifBadge, setNotifBadge] = useState('Exam Update');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');

  // Compute KPI statistics
  const totalStudents = students.length + 42350;
  const activeStudents = Math.round(totalStudents * 0.72);
  const totalPdfs = materials.filter((m) => m.type === 'pdf' || m.type === 'qa' || m.type === 'pyq').length + 480;
  const totalVideos = materials.filter((m) => m.type === 'video').length + 210;
  const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0) + 482900;
  const monthlyRevenue = 84500;

  // Handle Add Material
  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newMat: StudyMaterial = {
      id: `mat_custom_${Date.now()}`,
      title: newTitle,
      description: newDesc || 'Comprehensive educational study resource curated by faculty.',
      subject: newSubject,
      courseCategory: newCategory,
      subCategory: newSubCategory,
      type: newType,
      access: newAccess,
      pages: newPages,
      duration: newDuration,
      fileSize: `${(Math.random() * 5 + 2).toFixed(1)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadsCount: 0,
      viewsCount: 0,
      contentSnippet: newContentSnippet || `Chapter Notes for ${newTitle}.\nKey formulas and solved previous year questions for exam revision.`,
    };

    setMaterials((prev) => [newMat, ...prev]);
    setShowAddMaterialModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewContentSnippet('');
  };

  // Handle Add Mock Test
  const handleCreateMockTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle || !testQ1Text) return;

    const newTest: MockTest = {
      id: `test_custom_${Date.now()}`,
      title: testTitle,
      description: `Comprehensive examination series for ${testSubCategory}.`,
      category: testCategory,
      subCategory: testSubCategory,
      durationMinutes: testDuration,
      totalMarks: testMarks,
      negativeMarking: testNegMark,
      access: 'subscription',
      totalAttempts: 0,
      avgScore: 0,
      questions: [
        {
          id: `q_cust_1`,
          questionText: testQ1Text,
          options: [testOptA || 'Option A', testOptB || 'Option B', testOptC || 'Option C', testOptD || 'Option D'],
          correctIndex: testCorrectIdx,
          explanation: testExplanation || 'The correct option aligns with standard syllabus fundamentals.',
          subject: testSubCategory,
          difficulty: 'medium',
        },
      ],
    };

    setMockTests((prev) => [newTest, ...prev]);
    setShowAddTestModal(false);
    setTestTitle('');
    setTestQ1Text('');
  };

  // Handle Broadcast Notification
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMsg) return;

    addNotification(notifTitle, notifMsg, notifType, notifBadge);
    setBroadcastSuccess('Notification successfully broadcast to all registered students!');
    setNotifTitle('');
    setNotifMsg('');
    setTimeout(() => setBroadcastSuccess(''), 3000);
  };

  const handleDeleteMaterial = (id: string) => {
    if (confirm('Are you sure you want to delete this study resource?')) {
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleGrantPremium = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              planId: 'plan_premium',
              planName: 'Premium (Admin Granted)',
              subscriptionExpiry: '2027-12-31',
            }
          : s
      )
    );
  };

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-bold">
              Admin & Academic Control Center
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Logged in as: <strong className="text-amber-300">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddMaterialModal(true)}
            className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Course Material</span>
          </button>

          <button
            onClick={() => setShowAddTestModal(true)}
            className="py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Mock Test</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm gap-1 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'stats', label: '📊 Statistics', icon: TrendingUp },
          { id: 'students', label: '👥 Students', icon: Users },
          { id: 'courses', label: '📚 Study Materials', icon: BookOpen },
          { id: 'tests', label: '📝 Mock Tests', icon: Award },
          { id: 'payments', label: '💳 Revenue & Plans', icon: CreditCard },
          { id: 'notifications', label: '📢 Broadcast Push', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`py-2 px-4 rounded-xl whitespace-nowrap transition-all ${
              activeAdminTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: DASHBOARD STATISTICS */}
      {activeAdminTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Students</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                {totalStudents.toLocaleString()}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Active Learners</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {activeStudents.toLocaleString()}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">PDF Notes</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-blue-600 dark:text-blue-400 tabular-nums">
                {totalPdfs}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Video Classes</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-purple-600 dark:text-purple-400 tabular-nums">
                {totalVideos}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Total Revenue</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-amber-500 tabular-nums">
                ₹{totalRevenue.toLocaleString()}
              </span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Monthly Recurring</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                ₹{monthlyRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Recent Transactions Feed */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">
              Recent Online Fee Transactions (Razorpay Gateway)
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-700 text-xs">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {tx.studentName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {tx.planName} · Invoice: {tx.invoiceNumber} · {tx.paymentMethod}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white block">
                      ₹{tx.amount}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT MANAGEMENT */}
      {activeAdminTab === 'students' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Registered Student Directory
              </h3>
              <p className="text-xs text-slate-500">
                Manage accounts, assign courses, verify subscriptions, and grant premium access.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Category / Course</th>
                  <th className="py-3 px-3">Current Plan</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {students
                  .filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.email.toLowerCase().includes(studentSearch.toLowerCase()))
                  .map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                        {std.name}
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        <div>{std.email}</div>
                        <div className="font-mono text-[10px]">{std.mobile}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-500">
                        {std.district}, {std.state}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-blue-600 block">{std.selectedCourse}</span>
                        <span className="text-[10px] text-slate-400 uppercase">{std.category}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-amber-500">{std.planName}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleGrantPremium(std.id)}
                          className="py-1 px-2.5 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold rounded-lg text-[11px] hover:bg-blue-100"
                        >
                          Grant Premium
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STUDY MATERIALS MANAGER */}
      {activeAdminTab === 'courses' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Courseware, PDF Notes & Video Library
              </h3>
              <p className="text-xs text-slate-500">
                Manage syllabus files, free/paid status, and preview content.
              </p>
            </div>
            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-3">Resource Title</th>
                  <th className="py-3 px-3">Subject</th>
                  <th className="py-3 px-3">Course / Class</th>
                  <th className="py-3 px-3">Format</th>
                  <th className="py-3 px-3">Access</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {materials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {mat.title}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {mat.subject}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {mat.subCategory}
                    </td>
                    <td className="py-3 px-3 uppercase font-mono text-[10px]">
                      {mat.type}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          mat.access === 'free'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {mat.access}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteMaterial(mat.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Material"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MOCK TESTS MANAGER */}
      {activeAdminTab === 'tests' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Online Examination & Mock Test Creator
              </h3>
              <p className="text-xs text-slate-500">
                Configure question banks, negative marking ratios, and exam durations.
              </p>
            </div>
            <button
              onClick={() => setShowAddTestModal(true)}
              className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Test</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTests.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase">
                    {test.subCategory}
                  </span>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm my-1">
                    {test.title}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] mb-3">
                    <span>{test.questions.length} Questions</span>
                    <span>·</span>
                    <span>{test.durationMinutes} mins</span>
                    <span>·</span>
                    <span>{test.totalMarks} Marks</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-[11px]">
                  <span className="text-emerald-600 font-semibold">{test.totalAttempts} Attempts</span>
                  <span className="text-slate-400">Neg: -{test.negativeMarking}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PAYMENTS & SUBSCRIPTIONS */}
      {activeAdminTab === 'payments' && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Configurable Membership Plans
            </h3>
            <p className="text-xs text-slate-500">
              Update plan prices and duration periods anytime without altering client binaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{plan.name}</h4>
                  <div className="text-2xl font-black font-mono my-2 text-blue-600">
                    ₹{plan.price}
                  </div>
                  <span className="text-slate-400 text-[11px]">Duration: {plan.durationLabel}</span>
                  <ul className="mt-3 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                    {plan.features.map((f, i) => (
                      <li key={i}>✓ {f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: BROADCAST NOTIFICATIONS */}
      {activeAdminTab === 'notifications' && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 max-w-xl">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Broadcast Push Notification to Students
            </h3>
            <p className="text-xs text-slate-500">
              Send exam date updates, new study notes notifications, and promotional deals.
            </p>
          </div>

          {broadcastSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{broadcastSuccess}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Notification Headline
              </label>
              <input
                type="text"
                required
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="e.g. OSSC CGL Exam Date Announced"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Type
                </label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="exam">Exam Alert</option>
                  <option value="course">New Courseware</option>
                  <option value="offer">Special Offer</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={notifBadge}
                  onChange={(e) => setNotifBadge(e.target.value)}
                  placeholder="e.g. Urgent"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                Detailed Message
              </label>
              <textarea
                rows={3}
                required
                value={notifMsg}
                onChange={(e) => setNotifMsg(e.target.value)}
                placeholder="Enter message details for students..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-600/20"
            >
              Broadcast to All Students
            </button>
          </form>
        </div>
      )}

      {/* MODAL: ADD MATERIAL */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Upload Study Resource / PDF / Video
            </h3>
            <form onSubmit={handleCreateMaterial} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern Indian History - Freedom Movement"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  >
                    <option value="school">School (Class 1-12)</option>
                    <option value="college">College (+2/+3)</option>
                    <option value="govt_job">Govt Exam</option>
                    <option value="ignou">IGNOU DECE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    placeholder="e.g. Class 10 or OSSC CGL"
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">Format</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  >
                    <option value="pdf">PDF Notes</option>
                    <option value="video">Video Lecture</option>
                    <option value="qa">Q&A Book</option>
                    <option value="pyq">Previous Year Questions</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">Access Level</label>
                  <select
                    value={newAccess}
                    onChange={(e) => setNewAccess(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  >
                    <option value="free">Free for All</option>
                    <option value="subscription">Subscription Required</option>
                    <option value="paid">Direct Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Content Text Snippet / Syllabus Notes</label>
                <textarea
                  rows={4}
                  value={newContentSnippet}
                  onChange={(e) => setNewContentSnippet(e.target.value)}
                  placeholder="Paste or write notes preview for the PDF reader..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="py-1.5 px-3 bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MOCK TEST */}
      {showAddTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Create New CBT Mock Examination
            </h3>
            <form onSubmit={handleCreateMockTest} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g. Odisha Police SI - General Studies Mock 02"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-medium mb-1">Duration (Min)</label>
                  <input
                    type="number"
                    value={testDuration}
                    onChange={(e) => setTestDuration(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={testMarks}
                    onChange={(e) => setTestMarks(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Neg. Mark</label>
                  <input
                    type="number"
                    step="0.05"
                    value={testNegMark}
                    onChange={(e) => setTestNegMark(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">Question 1</label>
                <input
                  type="text"
                  required
                  value={testQ1Text}
                  onChange={(e) => setTestQ1Text(e.target.value)}
                  placeholder="e.g. Who was the founder of Utkal Sammilani?"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={testOptA}
                  onChange={(e) => setTestOptA(e.target.value)}
                  placeholder="Option A: Madhusudan Das"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
                <input
                  type="text"
                  value={testOptB}
                  onChange={(e) => setTestOptB(e.target.value)}
                  placeholder="Option B: Gopabandhu Das"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
                <input
                  type="text"
                  value={testOptC}
                  onChange={(e) => setTestOptC(e.target.value)}
                  placeholder="Option C: Fakir Mohan Senapati"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
                <input
                  type="text"
                  value={testOptD}
                  onChange={(e) => setTestOptD(e.target.value)}
                  placeholder="Option D: Harekrushna Mahatab"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTestModal(false)}
                  className="py-1.5 px-3 bg-slate-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Save Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
