import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Flag,
  Share2,
  Trophy,
  BarChart3,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MockTest, Question, TestResult } from '../types';
import confetti from 'canvas-confetti';

export const MockTestsTab: React.FC = () => {
  const {
    mockTests,
    activeTest,
    setActiveTest,
    submitTestResult,
    currentUser,
    openPaymentModal,
    isMaterialUnlocked,
    t,
  } = useApp();

  // Test Runner State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);

  // Category filter for mock test directory
  const [testCategoryFilter, setTestCategoryFilter] = useState('all');

  // Start test
  const handleStartTest = (test: MockTest) => {
    const unlocked = test.access === 'free' || currentUser.planId !== 'plan_free';
    if (!unlocked) {
      openPaymentModal();
      return;
    }

    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setMarkedForReview([]);
    setSecondsRemaining(test.durationMinutes * 60);
    setIsTestActive(true);
    setShowResultModal(false);
  };

  // Timer countdown
  useEffect(() => {
    if (!isTestActive || secondsRemaining <= 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTestActive, secondsRemaining]);

  // Finish and compute test results
  const handleFinishTest = () => {
    if (!activeTest) return;

    let correct = 0;
    let wrong = 0;
    const questions = activeTest.questions;

    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected !== undefined) {
        if (selected === q.correctIndex) {
          correct += 1;
        } else {
          wrong += 1;
        }
      }
    });

    const attempted = correct + wrong;
    const unattempted = questions.length - attempted;
    const marksPerQ = activeTest.totalMarks / questions.length;
    const rawScore = correct * marksPerQ - wrong * activeTest.negativeMarking;
    const marksObtained = Math.max(0, Math.round(rawScore * 100) / 100);
    const percentage = Math.round((marksObtained / activeTest.totalMarks) * 100);
    const timeTaken = activeTest.durationMinutes * 60 - secondsRemaining;

    const result: TestResult = {
      id: `res_${Date.now()}`,
      testId: activeTest.id,
      testTitle: activeTest.title,
      studentId: currentUser.id,
      studentName: currentUser.name,
      totalQuestions: questions.length,
      attempted,
      correctAnswers: correct,
      wrongAnswers: wrong,
      unattempted,
      marksObtained,
      totalMarks: activeTest.totalMarks,
      percentage,
      timeTakenSeconds: timeTaken,
      completedAt: new Date().toISOString(),
      userAnswers: { ...userAnswers },
      rank: Math.floor(Math.random() * 25) + 3,
      totalParticipants: activeTest.totalAttempts + 1,
    };

    submitTestResult(result);
    setLatestResult(result);
    setIsTestActive(false);
    setShowResultModal(true);

    if (percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleClearOption = (questionId: string) => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const toggleMarkForReview = (questionId: string) => {
    setMarkedForReview((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredTests = mockTests.filter((test) => {
    if (testCategoryFilter === 'all') return true;
    return test.category === testCategoryFilter;
  });

  // --- VIEW 1: ACTIVE LIVE CBT TEST ENGINE ---
  if (isTestActive && activeTest) {
    const currentQ: Question = activeTest.questions[currentQuestionIndex];
    const isAnswered = userAnswers[currentQ.id] !== undefined;
    const isReview = markedForReview.includes(currentQ.id);

    return (
      <div className="max-w-5xl mx-auto space-y-4 pb-16">
        {/* Exam Top Status Bar */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
              Live CBT Examination
            </span>
            <h3 className="font-bold text-sm sm:text-base text-white mt-1 line-clamp-1">
              {activeTest.title}
            </h3>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl font-mono text-sm sm:text-base font-bold text-amber-300 tabular-nums">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <button
              onClick={handleFinishTest}
              className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Main Exam Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Question Display Column (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between min-h-[460px]">
            <div>
              {/* Question Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4 text-xs">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  Question {currentQuestionIndex + 1} of {activeTest.questions.length}
                </span>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>Subject: {currentQ.subject}</span>
                  <span>·</span>
                  <span className="text-rose-500 font-medium">-{activeTest.negativeMarking} Marks Neg</span>
                </div>
              </div>

              {/* Question Body */}
              <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed mb-6">
                {currentQ.questionText}
              </p>

              {/* 4 Answer Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  const isSelected = userAnswers[currentQ.id] === idx;
                  const optionLetters = ['A', 'B', 'C', 'D'];

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(currentQ.id, idx)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 text-xs sm:text-sm ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-600 text-blue-900 dark:text-blue-100 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {optionLetters[idx]}
                      </div>
                      <span className="font-medium leading-snug">{option}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Question Controls */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleMarkForReview(currentQ.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isReview
                      ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{isReview ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>

                {isAnswered && (
                  <button
                    type="button"
                    onClick={() => handleClearOption(currentQ.id)}
                    className="py-2 px-3 text-xs text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    Clear Response
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="py-2 px-3.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < activeTest.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinishTest}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1"
                  >
                    <span>Finish Exam</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (1 col) */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Question Palette
            </h4>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-purple-500" />
                <span>Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                <span>Not Visited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border border-blue-600 text-blue-600 font-bold" />
                <span>Current</span>
              </div>
            </div>

            {/* Question numbers grid */}
            <div className="grid grid-cols-4 gap-2">
              {activeTest.questions.map((q, idx) => {
                const ans = userAnswers[q.id] !== undefined;
                const rev = markedForReview.includes(q.id);
                const isCurr = currentQuestionIndex === idx;

                let bgClass = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
                if (rev) {
                  bgClass = 'bg-purple-600 text-white font-bold';
                } else if (ans) {
                  bgClass = 'bg-emerald-600 text-white font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg text-xs font-semibold transition-all ${bgClass} ${
                      isCurr ? 'ring-2 ring-blue-600 ring-offset-2' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: POST-EXAM RESULTS MODAL ---
  if (showResultModal && latestResult && activeTest) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16">
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
          {/* Header */}
          <div className="text-center max-w-md mx-auto mb-8">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center mb-3">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Test Completed!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {latestResult.testTitle}
            </p>
          </div>

          {/* Performance Summary KPI Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-mono tabular-nums">
                {latestResult.marksObtained}/{latestResult.totalMarks}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Marks Obtained</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {latestResult.percentage}%
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Percentage Score</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 font-mono tabular-nums">
                #{latestResult.rank}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">State Rank</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-700 dark:text-slate-300 font-mono tabular-nums">
                {formatTime(latestResult.timeTakenSeconds)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Time Taken</div>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
            <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full">
              ✓ {latestResult.correctAnswers} Correct
            </span>
            <span className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full">
              ✗ {latestResult.wrongAnswers} Incorrect
            </span>
            <span className="text-slate-500 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
              ⊘ {latestResult.unattempted} Unattempted
            </span>
          </div>

          {/* Question by question solution analysis */}
          <div className="space-y-4 mb-8">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Detailed Answer Key & Solutions
            </h3>

            {activeTest.questions.map((q, qIndex) => {
              const userAns = latestResult.userAnswers[q.id];
              const isCorrect = userAns === q.correctIndex;
              const isSkipped = userAns === undefined;

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Q{qIndex + 1}. {q.questionText}
                    </span>
                    {isCorrect ? (
                      <span className="font-bold text-emerald-600 whitespace-nowrap">✓ Correct (+4)</span>
                    ) : isSkipped ? (
                      <span className="text-slate-400 whitespace-nowrap">⊘ Skipped (0)</span>
                    ) : (
                      <span className="font-bold text-rose-600 whitespace-nowrap">✗ Incorrect (-{activeTest.negativeMarking})</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                    {q.options.map((opt, oIdx) => {
                      let style = 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300';
                      if (oIdx === q.correctIndex) {
                        style = 'bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (userAns === oIdx) {
                        style = 'bg-rose-100 dark:bg-rose-950/60 border border-rose-500 text-rose-800 dark:text-rose-200 line-through';
                      }

                      return (
                        <div key={oIdx} className={`p-2 rounded-lg ${style}`}>
                          <span className="font-mono mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 p-2.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl text-blue-900 dark:text-blue-200 border border-blue-100 dark:border-blue-900/50">
                    <span className="font-bold block mb-0.5">Explanation:</span>
                    <span>{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={() => {
                setShowResultModal(false);
                setActiveTest(null);
              }}
              className="py-2.5 px-5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-slate-200 transition-colors"
            >
              Back to Test Series
            </button>

            <button
              onClick={() => handleStartTest(activeTest)}
              className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake This Mock Test</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 3: MOCK TEST CATALOGUE / DIRECTORY ---
  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('mockTests')} & Examination Portal
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Experience real CBT online exam simulation with timers, negative marking, instant answer keys & state rankings.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setTestCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              testCategoryFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Tests
          </button>
          <button
            onClick={() => setTestCategoryFilter('govt_job')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              testCategoryFilter === 'govt_job'
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Govt Exams
          </button>
          <button
            onClick={() => setTestCategoryFilter('school')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              testCategoryFilter === 'school'
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            School (Class 1-12)
          </button>
          <button
            onClick={() => setTestCategoryFilter('ignou')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              testCategoryFilter === 'ignou'
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            IGNOU DECE
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTests.map((test) => {
          const unlocked = test.access === 'free' || currentUser.planId !== 'plan_free';

          return (
            <div
              key={test.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                    {test.subCategory}
                  </span>
                  {test.access === 'free' ? (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      Free Attempt
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Premium</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-2 leading-snug">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {test.description}
                </p>

                {/* Exam Specs Strip */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl text-center text-xs mb-4">
                  <div>
                    <span className="block text-slate-400 text-[10px]">Questions</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{test.questions.length}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px]">Duration</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{test.durationMinutes}m</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px]">Total Marks</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{test.totalMarks}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-4">
                  <span>Neg. Marking: -{test.negativeMarking}</span>
                  <span>Attempted by {test.totalAttempts} students</span>
                </div>
              </div>

              {unlocked ? (
                <button
                  onClick={() => handleStartTest(test)}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Start CBT Examination</span>
                </button>
              ) : (
                <button
                  onClick={() => openPaymentModal()}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock with Subscription</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
