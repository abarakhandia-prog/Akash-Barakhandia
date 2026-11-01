import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  FileText,
  PlayCircle,
  HelpCircle,
  RotateCcw,
  Download,
  Bookmark,
  BookmarkCheck,
  Lock,
  Unlock,
  CheckCircle,
  Eye,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MaterialType, StudentCategory, StudyMaterial } from '../types';

export const CoursesTab: React.FC = () => {
  const {
    t,
    materials,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    searchQuery,
    setSearchQuery,
    setActivePdf,
    setActiveVideo,
    openPaymentModal,
    isMaterialUnlocked,
    bookmarkedIds,
    toggleBookmark,
    downloadedIds,
    toggleDownload,
  } = useApp();

  const [activeSubFilter, setActiveSubFilter] = useState<string>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');

  // Subcategory lists
  const subCategoryMap: Record<StudentCategory, string[]> = {
    school: ['Class 1-5', 'Class 6-8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
    college: ['+2 Arts', '+2 Science', '+3 UG Arts', '+3 UG Science', 'Semester 1-6'],
    govt_job: ['Odisha Police', 'OSSC', 'OSSSC', 'SSC', 'Railway', 'Banking', 'UPSC', 'OPSC', 'Teaching Exams'],
    ignou: ['DECE-1', 'DECE-2', 'DECE-3', 'DECE-4 Project Guide'],
  };

  const handleOpenMaterial = (mat: StudyMaterial) => {
    const unlocked = isMaterialUnlocked(mat);
    if (!unlocked) {
      openPaymentModal();
      return;
    }

    if (mat.type === 'video') {
      setActiveVideo(mat);
    } else {
      setActivePdf(mat);
    }
  };

  // Filter materials based on search, category, subcategory, type
  const filteredMaterials = materials.filter((mat) => {
    // 1. Category
    if (selectedCategoryFilter !== 'all' && mat.courseCategory !== selectedCategoryFilter) {
      return false;
    }
    // 2. Subcategory
    if (activeSubFilter !== 'all') {
      if (!mat.subCategory.toLowerCase().includes(activeSubFilter.toLowerCase())) {
        return false;
      }
    }
    // 3. Format/Type
    if (activeTypeFilter !== 'all' && mat.type !== activeTypeFilter) {
      return false;
    }
    // 4. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = mat.title.toLowerCase().includes(q);
      const matchSubject = mat.subject.toLowerCase().includes(q);
      const matchDesc = mat.description.toLowerCase().includes(q);
      const matchSub = mat.subCategory.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchDesc && !matchSub) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('exploreCourses')} & Study Repository
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse syllabus-mapped notes, video lectures, Q&A books, and previous year papers
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by subject, topic or exam..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Category Selector Tabs */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategoryFilter('all');
              setActiveSubFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategoryFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('allCategories')}
          </button>
          <button
            onClick={() => {
              setSelectedCategoryFilter('school');
              setActiveSubFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategoryFilter === 'school'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('schoolStudents')}
          </button>
          <button
            onClick={() => {
              setSelectedCategoryFilter('college');
              setActiveSubFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategoryFilter === 'college'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('collegeStudents')}
          </button>
          <button
            onClick={() => {
              setSelectedCategoryFilter('govt_job');
              setActiveSubFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategoryFilter === 'govt_job'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('govtJobExams')}
          </button>
          <button
            onClick={() => {
              setSelectedCategoryFilter('ignou');
              setActiveSubFilter('all');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategoryFilter === 'ignou'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            {t('ignouSection')}
          </button>
        </div>

        {/* Subcategory pills if specific category selected */}
        {selectedCategoryFilter !== 'all' && (
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap mr-1">Class/Course:</span>
            <button
              onClick={() => setActiveSubFilter('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap ${
                activeSubFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Levels
            </button>
            {subCategoryMap[selectedCategoryFilter as StudentCategory]?.map((sub) => (
              <button
                key={sub}
                onClick={() => setActiveSubFilter(sub)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap ${
                  activeSubFilter === sub
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* Format Selector: PDF, Video, QA, PYQ */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Format:</span>
          {(['all', 'pdf', 'video', 'qa', 'pyq'] as (MaterialType | 'all')[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setActiveTypeFilter(fmt)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                activeTypeFilter === fmt
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {fmt === 'all'
                ? 'All Formats'
                : fmt === 'pdf'
                ? '📄 PDF Notes'
                : fmt === 'video'
                ? '🎬 Video Lectures'
                : fmt === 'qa'
                ? '❓ Q&A Books'
                : '⏳ Previous Year (PYQ)'}
            </button>
          ))}
        </div>
      </div>

      {/* Materials List / Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
          <span>Showing {filteredMaterials.length} study items</span>
          <span>Click any card to open Reader or Player</span>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-700">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm">No materials found</h4>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filters or search keywords.</p>
            <button
              onClick={() => {
                setSelectedCategoryFilter('all');
                setActiveSubFilter('all');
                setActiveTypeFilter('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((mat) => {
              const unlocked = isMaterialUnlocked(mat);
              const isBookmarked = bookmarkedIds.includes(mat.id);
              const isDownloaded = downloadedIds.includes(mat.id);

              return (
                <div
                  key={mat.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-5">
                    {/* Header info */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                          {mat.subject}
                        </span>
                        <span className="text-[10px] text-slate-400">·</span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                          {mat.subCategory}
                        </span>
                      </div>

                      {/* Access tag */}
                      {mat.access === 'free' ? (
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          Free
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Premium</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4
                      onClick={() => handleOpenMaterial(mat)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2 mb-2 transition-colors"
                    >
                      {mat.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {mat.description}
                    </p>

                    {/* Metadata strip */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>{mat.type === 'video' ? `⏱ ${mat.duration}` : `📄 ${mat.pages || 32} Pages`}</span>
                      <span>·</span>
                      <span>{mat.fileSize || 'HD 1080p'}</span>
                      <span>·</span>
                      <span>👁 {mat.viewsCount}</span>
                    </div>
                  </div>

                  {/* Card bottom bar */}
                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      {/* Bookmark button */}
                      <button
                        onClick={() => toggleBookmark(mat.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked
                            ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark for Revision'}
                      >
                        {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      {/* Offline Download button */}
                      <button
                        onClick={() => toggleDownload(mat.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isDownloaded
                            ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                            : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                        title={isDownloaded ? 'Downloaded to Device (Offline)' : 'Download for Offline Reading'}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenMaterial(mat)}
                      className={`py-1.5 px-3.5 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-all ${
                        unlocked
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/20'
                      }`}
                    >
                      {unlocked ? (
                        mat.type === 'video' ? (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>{t('watchVideo')}</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5" />
                            <span>{t('readPdf')}</span>
                          </>
                        )
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock Content</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
