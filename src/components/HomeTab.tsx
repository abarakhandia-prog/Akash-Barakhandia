import React from 'react';
import {
  Search,
  BookOpen,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  FileText,
  PlayCircle,
  Award,
  ChevronRight,
  TrendingUp,
  Download,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudentCategory, StudyMaterial } from '../types';

export const HomeTab: React.FC = () => {
  const {
    t,
    language,
    currentUser,
    setActiveTab,
    setSelectedCategoryFilter,
    materials,
    mockTests,
    setActivePdf,
    setActiveVideo,
    setActiveTest,
    openPaymentModal,
    isMaterialUnlocked,
  } = useApp();

  // Upcoming examinations schedule
  const upcomingExams = [
    {
      id: 'ex_1',
      title: 'Odisha Police SI Written Examination',
      date: 'Nov 22, 2026',
      daysLeft: '22 Days Left',
      category: 'govt_job',
      target: 'Odisha Police',
    },
    {
      id: 'ex_2',
      title: 'OSSC Combined Graduate Level (CGL) Prelims',
      date: 'Dec 14, 2026',
      daysLeft: '44 Days Left',
      category: 'govt_job',
      target: 'OSSC',
    },
    {
      id: 'ex_3',
      title: 'IGNOU Term-End Examination (TEE) & DECE Project',
      date: 'Dec 05, 2026',
      daysLeft: '35 Days Left',
      category: 'ignou',
      target: 'IGNOU DECE',
    },
    {
      id: 'ex_4',
      title: 'Class 10 CBSE & State Board Pre-Board Exams',
      date: 'Jan 10, 2027',
      daysLeft: '70 Days Left',
      category: 'school',
      target: 'Class 10',
    },
  ];

  // Continue learning item
  const continueItem = materials.find((m) => m.id === 'mat_gov_1') || materials[0];

  const handleCategoryClick = (cat: StudentCategory) => {
    setSelectedCategoryFilter(cat);
    setActiveTab('courses');
  };

  const handleMaterialClick = (mat: StudyMaterial) => {
    if (mat.type === 'video') {
      setActiveVideo(mat);
    } else {
      setActivePdf(mat);
    }
  };

  const freeMaterials = materials.filter((m) => m.access === 'free').slice(0, 4);
  const popularMaterials = materials.slice(0, 4);

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. Student Welcome Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-600/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {t('welcomeBack')}
              </span>
              <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                {currentUser.planName || 'Free Plan'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
              {currentUser.name}
            </h2>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            onClick={() => setActiveTab('courses')}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer placeholder:text-slate-400"
            readOnly
          />
        </div>
      </div>

      {/* 2. Hero Education Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl shadow-blue-900/15 border border-blue-800/50">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/hero_education_banner_1793505372269.jpg"
            alt="Education Sathi Header"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-950/60" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart All-in-One Learning Portal</span>
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
              {language === 'or'
                ? 'ଓଡ଼ିଶା ଓ ସମଗ୍ର ଭାରତର ଶ୍ରେଷ୍ଠ ଶିକ୍ଷା ସାଥୀ'
                : language === 'hi'
                ? 'स्कूल, कॉलेज एवं सरकारी परीक्षाओं की सम्पूर्ण तैयारी'
                : 'Empowering School, College & Competitive Aspirants'}
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm font-normal leading-relaxed">
              Access high-yield PDF notes, full HD video classes, previous 10-year solved questions (PYQ), and real-time computer-based mock tests.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('courses')}
                className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>{t('exploreCourses')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('tests')}
                className="py-2.5 px-5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2"
              >
                <span>{t('startTest')}</span>
                <ClipboardCheck className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick metric pill stack */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">500+</div>
              <div className="text-[11px] text-blue-200 mt-1">PDF Study Notes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 font-mono tabular-nums">120+</div>
              <div className="text-[11px] text-blue-200 mt-1">Live Mock Tests</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">40k+</div>
              <div className="text-[11px] text-blue-200 mt-1">Active Students</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">4.9 ★</div>
              <div className="text-[11px] text-blue-200 mt-1">Play Store Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Four Core Educational Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'or' ? 'ଅଧ୍ୟୟନ ବିଭାଗ ବାଛନ୍ତୁ' : 'Choose Your Study Stream'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tailored curriculum for schools, universities, competitive tests, and distance learning
            </p>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: School */}
          <div
            onClick={() => handleCategoryClick('school')}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="h-32 overflow-hidden relative">
              <img
                src="/src/assets/images/school_study_illustration_1793505373086.jpg"
                alt="School Section"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white">
                Class 1 to 12
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t('schoolStudents')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                CBSE & State Board syllabus, NCERT solutions, chapter-wise notes and sample papers.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-700">
                <span>Notes & Tests</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: College */}
          <div
            onClick={() => handleCategoryClick('college')}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="h-32 overflow-hidden relative bg-blue-900">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-indigo-800 p-4 flex flex-col justify-end text-white">
                <div className="text-xs font-semibold text-blue-200">+2 & +3 UG</div>
                <div className="text-base font-bold text-white">Arts & Science</div>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t('collegeStudents')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Physics, Chemistry, Botany, Zoology, History, Political Science & semester question banks.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-700">
                <span>Semester Notes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 3: Govt Exams */}
          <div
            onClick={() => handleCategoryClick('govt_job')}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="h-32 overflow-hidden relative">
              <img
                src="/src/assets/images/govt_exam_prep_1793505373577.jpg"
                alt="Govt Exam Section"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white">
                SSC · Police · OSSC · Railway
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t('govtJobExams')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Odisha Police SI, OSSC CGL, OSSSC, Railway, Banking, OPSC OAS & Daily Current Affairs.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-700">
                <span>Mock Tests & PYQs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 4: IGNOU DECE */}
          <div
            onClick={() => handleCategoryClick('ignou')}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
          >
            <div className="h-32 overflow-hidden relative">
              <img
                src="/src/assets/images/ignou_dece_study_1793505372973.jpg"
                alt="IGNOU DECE Section"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <span className="absolute bottom-2.5 left-3 text-xs font-bold text-white">
                DECE 1, 2, 3 & Project DECE-4
              </span>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {t('ignouSection')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                Diploma in Early Childhood Care, assignment guidance, project activity formats and video tutorials.
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold pt-2 border-t border-slate-100 dark:border-slate-700">
                <span>Project & Notes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Continue Learning & Upcoming Examinations Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Card */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {t('continueLearning')}
              </span>
              <span className="text-[11px] text-slate-400">65% Completed</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-2">
              {continueItem.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
              <span>{continueItem.subject}</span>
              <span>·</span>
              <span>{continueItem.subCategory}</span>
              <span>·</span>
              <span>{continueItem.pages ? `${continueItem.pages} Pages` : continueItem.duration}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-4">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '65%' }} />
            </div>
          </div>

          <button
            onClick={() => handleMaterialClick(continueItem)}
            className="w-full py-2.5 px-4 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            {continueItem.type === 'video' ? <PlayCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            <span>Resume Where You Left</span>
          </button>
        </div>

        {/* Upcoming Examinations Alerts */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                {t('upcomingExams')}
              </h4>
            </div>
            <span className="text-[11px] text-slate-500">Official Exam Timetable</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcomingExams.map((exam) => (
              <div
                key={exam.id}
                onClick={() => {
                  setSelectedCategoryFilter(exam.category);
                  setActiveTab('tests');
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {exam.title}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded whitespace-nowrap">
                    {exam.daysLeft}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {exam.date}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Practice Test →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Free Study Materials Spotlight */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('freeMaterials')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Downloadable notes & question banks accessible to all learners
            </p>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {freeMaterials.map((mat) => (
            <div
              key={mat.id}
              onClick={() => handleMaterialClick(mat)}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Free Access
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {mat.fileSize || mat.duration}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-2 mb-1.5">
                  {mat.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {mat.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{mat.subCategory}</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  {mat.type === 'video' ? 'Watch' : 'Read'} →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Popular Online Mock Tests Section */}
      <div className="bg-slate-100 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Live CBT Online Examination Practice
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exam timers, real-time negative marking, ranking leaderboards, and instant explanations.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('tests')}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm self-start sm:self-auto"
          >
            All Mock Tests
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockTests.map((test) => {
            const unlocked = test.access === 'free' || currentUser.planId !== 'plan_free';
            return (
              <div
                key={test.id}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded uppercase">
                      {test.subCategory}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {test.durationMinutes} mins
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                    {test.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {test.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span>{test.questions.length} Questions</span>
                    <span>·</span>
                    <span>{test.totalMarks} Marks</span>
                    <span>·</span>
                    <span className="text-rose-500 font-medium">-{test.negativeMarking} Neg</span>
                  </div>
                </div>

                {unlocked ? (
                  <button
                    onClick={() => {
                      setActiveTest(test);
                      setActiveTab('tests');
                    }}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>{t('startTest')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openPaymentModal()}
                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock with Premium</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Premium Membership Promotion Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest bg-slate-950/15 px-3 py-1 rounded-full text-slate-950">
            Special Student Discount Plans
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-950">
            {t('premiumBannerTitle')}
          </h3>
          <p className="text-slate-900/80 text-xs sm:text-sm max-w-xl font-medium">
            Starting from just ₹49/month. Unlock all School, College +2/+3, IGNOU DECE projects and Govt job examinations with 100% money-back guarantee.
          </p>
        </div>

        <button
          onClick={() => openPaymentModal()}
          className="py-3 px-6 bg-slate-950 hover:bg-slate-900 text-amber-300 font-bold text-sm rounded-xl shadow-lg active:scale-[0.98] transition-transform whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>View All Plans & Upgrade</span>
        </button>
      </div>
    </div>
  );
};
