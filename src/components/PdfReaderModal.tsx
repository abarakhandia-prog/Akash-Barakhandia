import React, { useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  Search,
  Bookmark,
  BookmarkCheck,
  Download,
  Share2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Save,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StudyMaterial } from '../types';

export const PdfReaderModal: React.FC<{
  material: StudyMaterial;
  onClose: () => void;
}> = ({ material, onClose }) => {
  const {
    bookmarkedIds,
    toggleBookmark,
    downloadedIds,
    toggleDownload,
    savedNotes,
    addOrUpdateNote,
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = material.pages || 32;
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [noteText, setNoteText] = useState(() => {
    const found = savedNotes.find((n) => n.materialId === material.id);
    return found ? found.content : '';
  });
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [noteSavedBadge, setNoteSavedBadge] = useState(false);

  const isBookmarked = bookmarkedIds.includes(material.id);
  const isDownloaded = downloadedIds.includes(material.id);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(175, Math.max(75, prev + delta)));
  };

  const handleSaveNote = () => {
    addOrUpdateNote(material.id, material.title, noteText);
    setNoteSavedBadge(true);
    setTimeout(() => setNoteSavedBadge(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
      <div
        className={`relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border transition-colors ${
          isDarkMode
            ? 'bg-slate-950 text-slate-100 border-slate-800'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Top Toolbar */}
        <div
          className={`px-4 py-3 flex items-center justify-between border-b gap-3 shrink-0 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* Left: Document Info */}
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
              title="Close PDF Reader"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-hidden">
              <h3 className="font-bold text-xs sm:text-sm truncate leading-tight">
                {material.title}
              </h3>
              <span className="text-[10px] text-slate-400 block truncate">
                {material.subject} · {material.subCategory} · {material.fileSize}
              </span>
            </div>
          </div>

          {/* Right: PDF Reader Controls */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search Input toggle */}
            <div className="relative">
              {isSearching ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search in PDF..."
                    className="w-32 sm:w-44 px-2 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearching(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearching(true)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                  title="Search in Text"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-200 dark:bg-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => handleZoom(-15)}
                className="p-1.5 hover:bg-slate-300 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono px-1 font-semibold text-slate-600 dark:text-slate-300">
                {zoomLevel}%
              </span>
              <button
                onClick={() => handleZoom(15)}
                className="p-1.5 hover:bg-slate-300 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dark Reading Mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
              title={isDarkMode ? 'Switch to Normal Mode' : 'Switch to Dark Reading Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Bookmark page */}
            <button
              onClick={() => toggleBookmark(material.id)}
              className={`p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors ${
                isBookmarked ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300'
              }`}
              title="Bookmark Page"
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Download for offline */}
            <button
              onClick={() => toggleDownload(material.id)}
              className={`p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors ${
                isDownloaded ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-300'
              }`}
              title={isDownloaded ? 'Saved for Offline Reading' : 'Save Offline'}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Notes Toggle */}
            <button
              onClick={() => setShowNotesDrawer(!showNotesDrawer)}
              className="py-1 px-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notes</span>
            </button>
          </div>
        </div>

        {/* Reader Body Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100 dark:bg-slate-900/50">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className={`w-full max-w-3xl min-h-[640px] rounded-2xl p-6 sm:p-10 shadow-lg border transition-all ${
              isDarkMode
                ? 'bg-slate-900 text-slate-100 border-slate-800'
                : 'bg-white text-slate-800 border-slate-200'
            }`}
          >
            {/* Document Header Page */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                <span>MY EDUCATION SATHI OFFICIAL COURSEWARE</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                {material.title}
              </h1>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Subject: {material.subject}</span>
                <span>·</span>
                <span>Category: {material.subCategory}</span>
              </div>
            </div>

            {/* Document Educational Text Content */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-serif">
              {material.contentSnippet ? (
                <div className="whitespace-pre-wrap font-sans">
                  {material.contentSnippet}
                </div>
              ) : (
                <>
                  <p>
                    <strong>1. Core Theoretical Framework & Principles</strong><br />
                    This chapter provides a detailed, rigorous breakdown of the syllabus mapped directly to the current examination guidelines. Students must thoroughly memorize the foundational definitions and practice the step-by-step illustrations provided below.
                  </p>
                  <p>
                    <strong>2. Detailed Step-by-Step Derivations:</strong><br />
                    Let us consider the system in dynamic equilibrium. Applying the fundamental conservation law:
                    <br />
                    <code className="block bg-slate-100 dark:bg-slate-800 p-3 rounded-lg font-mono text-xs my-2">
                      Total Energy E = Kinetic Energy + Potential Energy = Constant
                    </code>
                  </p>
                  <p>
                    <strong>3. Examination Tips & Frequently Asked Questions (PYQs):</strong><br />
                    Over the last 5 years, questions from this topic have consistently carried between 4 to 8 marks in the final board and state competitive examinations. Review the formula sheet and memorize the key exceptions.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Side Notes Drawer */}
        {showNotesDrawer && (
          <div className="absolute right-0 top-14 bottom-14 w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-2xl p-4 flex flex-col justify-between z-20">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-700">
                <span className="font-bold text-xs">My Personal Revision Notes</span>
                <button
                  onClick={() => setShowNotesDrawer(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <textarea
                rows={12}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Jot down formulas, doubts, key points for fast revision..."
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
              />
            </div>

            <div className="pt-3">
              <button
                onClick={handleSaveNote}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                {noteSavedBadge ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Note to Profile</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Page Navigation Bar */}
        <div
          className={`px-4 py-3 flex items-center justify-between border-t gap-3 shrink-0 ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="py-1 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Page</span>
          </button>

          <span className="text-xs font-medium text-slate-500 font-mono">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="py-1 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
          >
            <span>Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
