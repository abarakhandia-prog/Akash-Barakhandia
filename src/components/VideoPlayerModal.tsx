import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  ListVideo,
  Settings,
  Sparkles,
} from 'lucide-react';
import { StudyMaterial } from '../types';

export const VideoPlayerModal: React.FC<{
  material: StudyMaterial;
  onClose: () => void;
}> = ({ material, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [quality, setQuality] = useState<'360p' | '720p' | '1080p'>('1080p');
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35); // in percent
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  // Course playlist lessons
  const playlist = [
    { title: 'Lesson 1: Foundational Concepts & Definitions', duration: '18:40', completed: true },
    { title: `Lesson 2: ${material.title}`, duration: material.duration || '24:15', completed: false },
    { title: 'Lesson 3: Formula Derivations & Solved Examples', duration: '32:10', completed: false },
    { title: 'Lesson 4: Previous Year Questions & Shortcut Tricks', duration: '28:50', completed: false },
  ];

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-5xl bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="overflow-hidden">
              <h3 className="font-bold text-xs sm:text-sm truncate">
                {material.title}
              </h3>
              <span className="text-[10px] text-slate-400 block truncate">
                {material.subject} · {material.subCategory} · Quality: {quality}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback speed selector */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg text-xs font-semibold">
              <span className="text-slate-400 text-[10px]">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent text-white text-xs font-mono focus:outline-none cursor-pointer"
              >
                {speeds.map((s) => (
                  <option key={s} value={s} className="bg-slate-800 text-white">
                    {s}x
                  </option>
                ))}
              </select>
            </div>

            {/* Quality selector */}
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg text-xs font-semibold">
              <span className="text-slate-400 text-[10px]">Quality:</span>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as any)}
                className="bg-transparent text-white text-xs font-mono focus:outline-none cursor-pointer"
              >
                <option value="360p" className="bg-slate-800">360p (Data Saver)</option>
                <option value="720p" className="bg-slate-800">720p HD</option>
                <option value="1080p" className="bg-slate-800">1080p Full HD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Video Player + Playlist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-y-auto">
          {/* Main Video Viewport (2 cols) */}
          <div className="lg:col-span-2 bg-black flex flex-col justify-between relative group min-h-[320px] sm:min-h-[420px]">
            {/* Video Canvas Graphic */}
            <div className="relative flex-1 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
              <div className="text-center p-6 space-y-3 z-10">
                <div className="w-16 h-16 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center mx-auto shadow-2xl backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform"
                     onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                </div>
                <h4 className="text-sm font-semibold text-white/90 max-w-md">
                  {material.title}
                </h4>
                <span className="text-xs text-blue-300 font-mono">
                  Lesson 2 of 4 · {playbackSpeed}x Speed · {quality}
                </span>
              </div>
            </div>

            {/* Video Control Bar */}
            <div className="p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800/80 space-y-2">
              {/* Scrub bar */}
              <div
                className="w-full bg-slate-800 h-1.5 rounded-full cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = ((e.clientX - rect.left) / rect.width) * 100;
                  setProgress(Math.round(pos));
                }}
              >
                <div
                  className="bg-blue-600 h-full rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="w-3 h-3 rounded-full bg-white absolute right-0 top-1/2 -translate-y-1/2 shadow" />
                </div>
              </div>

              {/* Controls strip */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 hover:text-blue-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 hover:text-blue-400 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-[11px] font-mono text-slate-400">
                    12:35 / {material.duration || '35:00'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded">
                    Progress Saved
                  </span>
                  <button
                    onClick={() => {
                      if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => {});
                      } else {
                        document.exitFullscreen().catch(() => {});
                      }
                    }}
                    className="p-1 hover:text-blue-400 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Course Playlist Sidebar (1 col) */}
          <div className="bg-slate-900 p-4 border-l border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-3">
                <ListVideo className="w-4 h-4 text-blue-400" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                  Course Playlist & Syllabus
                </h4>
              </div>

              <div className="space-y-2">
                {playlist.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveLessonIndex(idx)}
                    className={`p-3 rounded-xl cursor-pointer transition-all border text-xs flex items-center justify-between gap-2 ${
                      activeLessonIndex === idx
                        ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 overflow-hidden">
                      <div className="mt-0.5 shrink-0">
                        {item.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-500" />
                        )}
                      </div>
                      <span className="truncate">{item.title}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 shrink-0">
                      {item.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick tips card */}
            <div className="mt-4 p-3 bg-blue-950/40 border border-blue-900/60 rounded-xl text-[11px] text-blue-200 space-y-1">
              <span className="font-bold block">Smart Learning Tip:</span>
              <p className="text-blue-300/80">
                You can speed up revision to 1.5x and take instant notes in the PDF reader alongside this lesson.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
