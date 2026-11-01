export type Language = 'en' | 'hi' | 'or';

export type UserRole = 'student' | 'teacher' | 'admin' | 'superadmin';

export type StudentCategory = 'school' | 'college' | 'govt_job' | 'ignou';

export type MaterialAccess = 'free' | 'paid' | 'subscription';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  state: string;
  district: string;
  category: StudentCategory;
  selectedCourse: string;
  planId: string;
  planName: string;
  subscriptionExpiry?: string;
  profilePic?: string;
  createdAt: string;
  enrolledCourses: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // In INR
  originalPrice: number;
  durationMonths: number;
  durationLabel: string;
  popular?: boolean;
  features: string[];
}

export type MaterialType = 'pdf' | 'video' | 'qa' | 'pyq' | 'test';

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  courseCategory: StudentCategory;
  subCategory: string; // e.g. 'Class 10', '+2 Science', 'SSC CGL', 'DECE-1'
  semester?: string;
  type: MaterialType;
  access: MaterialAccess;
  fileSize?: string;
  duration?: string;
  videoUrl?: string;
  pdfUrl?: string;
  pages?: number;
  thumbnail?: string;
  uploadedAt: string;
  downloadsCount: number;
  viewsCount: number;
  contentSnippet?: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, 3
  explanation: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  category: StudentCategory;
  subCategory: string; // e.g. 'Class 10 CBSE', 'Odisha Police SI', 'SSC CGL', 'IGNOU DECE'
  durationMinutes: number;
  totalMarks: number;
  negativeMarking: number; // e.g. 0.25 or 0.5
  questions: Question[];
  access: MaterialAccess;
  totalAttempts: number;
  avgScore: number;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  studentId: string;
  studentName: string;
  totalQuestions: number;
  attempted: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattempted: number;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  timeTakenSeconds: number;
  completedAt: string;
  userAnswers: Record<string, number>; // questionId -> selectedIndex
  rank?: number;
  totalParticipants?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'course' | 'exam' | 'offer' | 'announcement' | 'subscription';
  date: string;
  read: boolean;
  actionUrl?: string;
  badge?: string;
}

export interface PaymentTransaction {
  id: string;
  studentId: string;
  studentName: string;
  planId: string;
  planName: string;
  amount: number;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  paymentMethod: string;
  orderId: string;
  paymentId: string;
  invoiceNumber: string;
  date: string;
  durationMonths: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'teacher' | 'support';
  senderName: string;
  text: string;
  timestamp: string;
  channel: 'ai_sathi' | 'doubt_forum' | 'support' | 'teacher';
  subject?: string;
  attachmentUrl?: string;
}

export interface DoubtTicket {
  id: string;
  studentName: string;
  subject: string;
  category: string;
  title: string;
  description: string;
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
  answer?: string;
  answeredBy?: string;
}
