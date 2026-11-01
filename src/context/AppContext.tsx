import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  UserProfile,
  UserRole,
  StudentCategory,
  StudyMaterial,
  MockTest,
  TestResult,
  NotificationItem,
  PaymentTransaction,
  SubscriptionPlan,
} from '../types';
import {
  initialSubscriptionPlans,
  sampleMaterials,
  sampleMockTests,
  initialNotifications,
  sampleTransactions,
  initialStudentsList,
} from '../data/mockData';
import { translations } from '../data/translations';

interface SavedNote {
  id: string;
  materialId: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  viewMode: 'responsive' | 'mobile_frame';
  setViewMode: (mode: 'responsive' | 'mobile_frame') => void;
  currentUser: UserProfile;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  loginAs: (role: UserRole, customDetails?: Partial<UserProfile>) => void;
  logout: () => void;
  activeTab: 'home' | 'courses' | 'tests' | 'chat' | 'profile' | 'admin';
  setActiveTab: (tab: 'home' | 'courses' | 'tests' | 'chat' | 'profile' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (cat: string) => void;
  subscriptionPlans: SubscriptionPlan[];
  setSubscriptionPlans: React.Dispatch<React.SetStateAction<SubscriptionPlan[]>>;
  materials: StudyMaterial[];
  setMaterials: React.Dispatch<React.SetStateAction<StudyMaterial[]>>;
  mockTests: MockTest[];
  setMockTests: React.Dispatch<React.SetStateAction<MockTest[]>>;
  activePdf: StudyMaterial | null;
  setActivePdf: (mat: StudyMaterial | null) => void;
  activeVideo: StudyMaterial | null;
  setActiveVideo: (mat: StudyMaterial | null) => void;
  activeTest: MockTest | null;
  setActiveTest: (test: MockTest | null) => void;
  testResults: TestResult[];
  submitTestResult: (result: TestResult) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  selectedPlanForPayment: SubscriptionPlan | null;
  openPaymentModal: (plan?: SubscriptionPlan) => void;
  processPaymentSuccess: (details: { plan: SubscriptionPlan; paymentMethod: string; paymentId: string; orderId: string }) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isFlutterModalOpen: boolean;
  setIsFlutterModalOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (title: string, message: string, type?: NotificationItem['type'], badge?: string) => void;
  transactions: PaymentTransaction[];
  students: UserProfile[];
  setStudents: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  bookmarkedIds: string[];
  toggleBookmark: (id: string) => void;
  downloadedIds: string[];
  toggleDownload: (id: string) => void;
  savedNotes: SavedNote[];
  addOrUpdateNote: (materialId: string, title: string, content: string) => void;
  isMaterialUnlocked: (material: StudyMaterial) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_STUDENT: UserProfile = {
  id: 'usr_me',
  name: 'Subham Mohapatra',
  email: 'subham.student@gmail.com',
  mobile: '+91 9437123456',
  role: 'student',
  state: 'Odisha',
  district: 'Cuttack',
  category: 'govt_job',
  selectedCourse: 'Odisha Police SI & OSSC CGL',
  planId: 'plan_basic',
  planName: 'Basic Plan',
  subscriptionExpiry: '2026-12-31',
  profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2026-09-10',
  enrolledCourses: ['Odisha Police SI', 'OSSC CGL', 'Class 10 Science'],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('mes_lang') as Language) || 'en';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('mes_theme') as 'light' | 'dark') || 'light';
  });

  const [viewMode, setViewMode] = useState<'responsive' | 'mobile_frame'>('responsive');

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mes_user');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'courses' | 'tests' | 'chat' | 'profile' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(initialSubscriptionPlans);
  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('mes_materials');
    return saved ? JSON.parse(saved) : sampleMaterials;
  });

  const [mockTests, setMockTests] = useState<MockTest[]>(() => {
    const saved = localStorage.getItem('mes_tests');
    return saved ? JSON.parse(saved) : sampleMockTests;
  });

  const [activePdf, setActivePdf] = useState<StudyMaterial | null>(null);
  const [activeVideo, setActiveVideo] = useState<StudyMaterial | null>(null);
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);

  const [testResults, setTestResults] = useState<TestResult[]>(() => {
    const saved = localStorage.getItem('mes_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<SubscriptionPlan | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(sampleTransactions);
  const [students, setStudents] = useState<UserProfile[]>(initialStudentsList);

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mes_bookmarks');
    return saved ? JSON.parse(saved) : ['mat_sch_1', 'mat_gov_1'];
  });

  const [downloadedIds, setDownloadedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('mes_downloads');
    return saved ? JSON.parse(saved) : ['mat_sch_1'];
  });

  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    const saved = localStorage.getItem('mes_notes');
    return saved ? JSON.parse(saved) : [
      {
        id: 'note_1',
        materialId: 'mat_sch_1',
        title: 'Chemical Equations Revision',
        content: 'Remember that mass is conserved. Double check balancing of oxygen and hydrogen in Redox reactions.',
        updatedAt: '2026-10-25',
      },
    ];
  });

  // Sync theme with HTML root class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mes_theme', theme);
  }, [theme]);

  // Sync storage
  useEffect(() => {
    localStorage.setItem('mes_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mes_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mes_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('mes_tests', JSON.stringify(mockTests));
  }, [mockTests]);

  useEffect(() => {
    localStorage.setItem('mes_results', JSON.stringify(testResults));
  }, [testResults]);

  useEffect(() => {
    localStorage.setItem('mes_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('mes_downloads', JSON.stringify(downloadedIds));
  }, [downloadedIds]);

  useEffect(() => {
    localStorage.setItem('mes_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const loginAs = (role: UserRole, customDetails?: Partial<UserProfile>) => {
    let name = 'Student';
    let email = 'student@myeducationsathi.com';
    let plan = 'plan_free';
    let planName = 'Free';

    if (role === 'admin' || role === 'superadmin') {
      name = role === 'superadmin' ? 'Super Admin (Ashutosh)' : 'Admin (Dr. B. K. Jena)';
      email = 'admin@myeducationsathi.com';
      plan = 'plan_premium_plus';
      planName = 'Super Administrator';
    } else if (role === 'teacher') {
      name = 'Prof. Snigdha Mishra (M.Sc, B.Ed)';
      email = 'snigdha.teacher@myeducationsathi.com';
      plan = 'plan_premium';
      planName = 'Faculty Member';
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      role,
      name: customDetails?.name || name,
      email: customDetails?.email || email,
      planId: plan,
      planName: planName,
      ...customDetails,
    };

    setCurrentUser(updatedUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    loginAs('student', {
      name: 'Guest Learner',
      email: 'guest@myeducationsathi.com',
      planId: 'plan_free',
      planName: 'Free',
    });
  };

  const isMaterialUnlocked = (material: StudyMaterial): boolean => {
    if (material.access === 'free') return true;
    if (currentUser.role === 'admin' || currentUser.role === 'superadmin' || currentUser.role === 'teacher') {
      return true;
    }
    // Check if user has active paid subscription
    if (currentUser.planId && currentUser.planId !== 'plan_free') {
      return true;
    }
    return false;
  };

  const submitTestResult = (result: TestResult) => {
    setTestResults((prev) => [result, ...prev]);
  };

  const openPaymentModal = (plan?: SubscriptionPlan) => {
    if (plan) {
      setSelectedPlanForPayment(plan);
    } else {
      // Default to popular premium
      const def = subscriptionPlans.find((p) => p.popular) || subscriptionPlans[2];
      setSelectedPlanForPayment(def);
    }
    setIsPaymentModalOpen(true);
  };

  const processPaymentSuccess = (details: {
    plan: SubscriptionPlan;
    paymentMethod: string;
    paymentId: string;
    orderId: string;
  }) => {
    const invoiceNum = `INV-MES-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: PaymentTransaction = {
      id: `tx_${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      planId: details.plan.id,
      planName: details.plan.name,
      amount: details.plan.price,
      status: 'success',
      paymentMethod: details.paymentMethod,
      orderId: details.orderId,
      paymentId: details.paymentId,
      invoiceNumber: invoiceNum,
      date: new Date().toISOString().split('T')[0],
      durationMonths: details.plan.durationMonths,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update current user's subscription
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + details.plan.durationMonths);

    setCurrentUser((prev) => ({
      ...prev,
      planId: details.plan.id,
      planName: details.plan.name,
      subscriptionExpiry: expiry.toISOString().split('T')[0],
    }));

    setIsPaymentModalOpen(false);

    // Add confirmation notification
    addNotification(
      'Payment Successful & Subscription Activated!',
      `Thank you for subscribing to ${details.plan.name} (Invoice: ${invoiceNum}). All premium notes, videos, and tests are unlocked!`,
      'subscription',
      'Unlocked'
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const addNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'announcement',
    badge?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type,
      date: 'Just now',
      read: false,
      badge,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleDownload = (id: string) => {
    setDownloadedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const addOrUpdateNote = (materialId: string, title: string, content: string) => {
    setSavedNotes((prev) => {
      const existing = prev.find((n) => n.materialId === materialId);
      if (existing) {
        return prev.map((n) => (n.materialId === materialId ? { ...n, title, content, updatedAt: new Date().toISOString().split('T')[0] } : n));
      }
      return [
        {
          id: `note_${Date.now()}`,
          materialId,
          title,
          content,
          updatedAt: new Date().toISOString().split('T')[0],
        },
        ...prev,
      ];
    });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        viewMode,
        setViewMode,
        currentUser,
        setCurrentUser,
        loginAs,
        logout,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        subscriptionPlans,
        setSubscriptionPlans,
        materials,
        setMaterials,
        mockTests,
        setMockTests,
        activePdf,
        setActivePdf,
        activeVideo,
        setActiveVideo,
        activeTest,
        setActiveTest,
        testResults,
        submitTestResult,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        selectedPlanForPayment,
        openPaymentModal,
        processPaymentSuccess,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isFlutterModalOpen,
        setIsFlutterModalOpen,
        notifications,
        markNotificationAsRead,
        addNotification,
        transactions,
        students,
        setStudents,
        bookmarkedIds,
        toggleBookmark,
        downloadedIds,
        toggleDownload,
        savedNotes,
        addOrUpdateNote,
        isMaterialUnlocked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
