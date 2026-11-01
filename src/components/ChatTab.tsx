import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  HelpCircle,
  MessageSquare,
  UserCheck,
  Paperclip,
  CheckCircle2,
  Clock,
  ShieldAlert,
  GraduationCap,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage, DoubtTicket } from '../types';

export const ChatTab: React.FC = () => {
  const { language, currentUser, t } = useApp();

  const [activeChannel, setActiveChannel] = useState<'ai_sathi' | 'doubt_forum' | 'support' | 'faqs'>('ai_sathi');

  // AI Assistant Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      senderName: 'Education Sathi AI',
      text:
        language === 'or'
          ? 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ଏଆଇ ଶିକ୍ଷା ସାଥୀ। ଗଣିତ, ବିଜ୍ଞାନ, ଓଡ଼ିଶା ସାଧାରଣ ଜ୍ଞାନ, ବ୍ୟାକରଣ କିମ୍ବା IGNOU DECE ବିଷୟରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ!'
          : language === 'hi'
          ? 'नमस्ते! मैं आपका एआई शिक्षा साथी हूँ। गणित, विज्ञान, सामान्य ज्ञान या इग्नू DECE प्रोजेक्ट से जुड़ा कोई भी सवाल पूछें!'
          : 'Hello Student! I am your AI Education Sathi. Ask me any concept doubt, formula derivation, PYQ explanation, or IGNOU DECE guidance in English, Hindi, or Odia!',
      timestamp: 'Just now',
      channel: 'ai_sathi',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('General');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Doubt forum ticket form
  const [doubtTitle, setDoubtTitle] = useState('');
  const [doubtDesc, setDoubtDesc] = useState('');
  const [doubtSubject, setDoubtSubject] = useState('Mathematics');
  const [hasAttachedFile, setHasAttachedFile] = useState(false);
  const [doubtSuccess, setDoubtSuccess] = useState('');

  // Sample FAQs
  const faqs = [
    {
      q: 'How do I download PDF notes for offline reading?',
      a: 'Open any PDF material from the Courses section and click the Download icon at the top right. Once downloaded, the document is accessible anytime in your Profile > My Downloads without an active internet connection.',
    },
    {
      q: 'What is the DECE-4 Project Work submission format for IGNOU?',
      a: 'The DECE-4 project requires a 30-day activity plan comprising 5 days of observation, 20 days of structured play activities (language + motor skills), and 5 days of report drafting with the supervisor rating form.',
    },
    {
      q: 'How does negative marking work in online mock tests?',
      a: 'For competitive exams (e.g., Odisha Police SI or OSSC), each correct question awards +4 marks, while an incorrect response deducts 0.25 or 0.5 marks as per the official notification.',
    },
    {
      q: 'Can I change my preferred language between English, Hindi, and Odia?',
      a: 'Yes! Click the Globe icon on the top navigation bar at any time to switch the entire application interface and AI assistant responses between English, Hindi (हिन्दी), and Odia (ଓଡ଼ିଆ).',
    },
  ];

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  // Handle AI ask
  const handleSendAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isAiLoading) return;

    const userMsgText = inputPrompt.trim();
    setInputPrompt('');

    const newMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      senderName: currentUser.name || 'Student',
      text: userMsgText,
      timestamp: 'Just now',
      channel: 'ai_sathi',
      subject: selectedSubject,
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsgText,
          language,
          subject: selectedSubject,
          studentClass: currentUser.selectedCourse || 'Class 10',
        }),
      });

      const data = await res.json();
      const botReply = data.reply || 'Thank you for your question. Here is the step-by-step concept breakdown.';

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          senderName: 'Education Sathi AI',
          text: botReply,
          timestamp: 'Just now',
          channel: 'ai_sathi',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'assistant',
          senderName: 'Education Sathi AI',
          text:
            'Here is a quick concept tip: Break down the problem into known formulas, write down the given parameters, and revise the corresponding chapter notes in the Courses tab.',
          timestamp: 'Just now',
          channel: 'ai_sathi',
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmitDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtTitle || !doubtDesc) return;

    setDoubtSuccess('Your doubt has been submitted to faculty mentors. You will receive a notification once answered!');
    setDoubtTitle('');
    setDoubtDesc('');
    setHasAttachedFile(false);
    setTimeout(() => setDoubtSuccess(''), 4000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Channel Switcher */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveChannel('ai_sathi')}
          className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all ${
            activeChannel === 'ai_sathi'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Education Sathi</span>
        </button>

        <button
          onClick={() => setActiveChannel('doubt_forum')}
          className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all ${
            activeChannel === 'doubt_forum'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Submit Doubt to Teachers</span>
        </button>

        <button
          onClick={() => setActiveChannel('support')}
          className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all ${
            activeChannel === 'support'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Student Support Desk</span>
        </button>

        <button
          onClick={() => setActiveChannel('faqs')}
          className={`py-2 px-4 rounded-xl flex items-center gap-2 transition-all ${
            activeChannel === 'faqs'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & FAQs</span>
        </button>
      </div>

      {/* CHANNEL 1: AI EDUCATION SATHI CHAT */}
      {activeChannel === 'ai_sathi' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Education Sathi AI Assistant</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Online 24/7
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Step-by-step explanations in English, Hindi & Odia
                </p>
              </div>
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="py-1 px-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="General">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science (Physics/Chem/Bio)</option>
                <option value="Odisha GK">Odisha GK & Polity</option>
                <option value="IGNOU DECE">IGNOU DECE</option>
                <option value="English">English Grammar</option>
              </select>
            </div>
          </div>

          {/* Chat Message Scroll Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/15'
                        : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-blue-600 dark:text-blue-400 mb-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Education Sathi</span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <span
                      className={`block text-[10px] mt-2 font-mono ${
                        isUser ? 'text-blue-100 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {isAiLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none p-3.5 text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    Sathi is formulating explanation...
                  </span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-400 font-medium whitespace-nowrap">Try asking:</span>
            <button
              onClick={() => setInputPrompt('Explain Pythagoras theorem with a practical example')}
              className="py-1 px-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-lg text-slate-700 dark:text-slate-300 whitespace-nowrap border border-slate-200 dark:border-slate-700"
            >
              📐 Pythagoras Theorem
            </button>
            <button
              onClick={() => setInputPrompt('What are the key eligibility rules for Odisha Police SI exam?')}
              className="py-1 px-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-lg text-slate-700 dark:text-slate-300 whitespace-nowrap border border-slate-200 dark:border-slate-700"
            >
              👮 Odisha Police SI Rules
            </button>
            <button
              onClick={() => setInputPrompt('IGNOU DECE-4 project format and how to prepare 30-day activity plan')}
              className="py-1 px-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 rounded-lg text-slate-700 dark:text-slate-300 whitespace-nowrap border border-slate-200 dark:border-slate-700"
            >
              🧸 IGNOU DECE-4 Project
            </button>
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendAiPrompt} className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                language === 'or'
                  ? 'ଆପଣଙ୍କ ପ୍ରଶ୍ନ ଏଠାରେ ଲେଖନ୍ତୁ (ଯଥା: ଗଣିତ ସୂତ୍ର, IGNOU ନୋଟ୍ସ)...'
                  : language === 'hi'
                  ? 'अपना प्रश्न यहाँ लिखें (उदा. भौतिक विज्ञान, ओडिशा GK)...'
                  : 'Type your academic question (e.g., balance chemical reaction, DECE notes)...'
              }
              className="flex-1 py-2.5 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <button
              type="submit"
              disabled={isAiLoading || !inputPrompt.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* CHANNEL 2: DOUBT FORUM & TEACHER SUBMISSION */}
      {activeChannel === 'doubt_forum' && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ask Faculty Mentors & Doubt Resolution Forum
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Submit complex homework questions or assignment problems directly to certified teachers.
            </p>
          </div>

          {doubtSuccess && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{doubtSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmitDoubt} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Subject Category
                </label>
                <select
                  value={doubtSubject}
                  onChange={(e) => setDoubtSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Botany / Zoology</option>
                  <option value="Polity">Polity & Constitution</option>
                  <option value="IGNOU DECE">IGNOU DECE Project</option>
                  <option value="Reasoning">Reasoning & Aptitude</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Chapter Title
                </label>
                <input
                  type="text"
                  required
                  value={doubtTitle}
                  onChange={(e) => setDoubtTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Quadratic Equation Q.8"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Describe Your Question in Detail
              </label>
              <textarea
                rows={4}
                required
                value={doubtDesc}
                onChange={(e) => setDoubtDesc(e.target.value)}
                placeholder="Write your doubt, steps you attempted, and where you are getting stuck..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Simulated Attachment */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <span>
                  {hasAttachedFile ? 'Question_Photo_Attached.jpg (1.8 MB)' : 'Attach Photo / Screenshot of the problem'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHasAttachedFile(!hasAttachedFile)}
                className="py-1 px-3 bg-slate-200 dark:bg-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300 transition-colors"
              >
                {hasAttachedFile ? 'Remove' : 'Select Photo'}
              </button>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all"
            >
              Submit Doubt to Faculty
            </button>
          </form>
        </div>
      )}

      {/* CHANNEL 3: STUDENT SUPPORT DESK */}
      {activeChannel === 'support' && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Official Student Helpline & Support
              </h3>
              <p className="text-xs text-slate-500">
                Operational Monday to Saturday: 9:00 AM – 7:00 PM IST
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Email Support</span>
              <p className="text-slate-500 text-[11px] mb-2">Replies within 4 business hours</p>
              <a href="mailto:support@myeducationsathi.com" className="text-blue-600 font-semibold">
                support@myeducationsathi.com
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">WhatsApp Helpline</span>
              <p className="text-slate-500 text-[11px] mb-2">Direct admission & notes support</p>
              <span className="text-emerald-600 font-semibold font-mono">+91 94371-23456</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">Regional Office</span>
              <p className="text-slate-500 text-[11px] mb-2">Odisha State Education Center</p>
              <span className="text-slate-700 dark:text-slate-300">Saheed Nagar, Bhubaneswar, Odisha</span>
            </div>
          </div>
        </div>
      )}

      {/* CHANNEL 4: FAQS */}
      {activeChannel === 'faqs' && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
            Frequently Asked Questions (FAQs)
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              >
                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{faq.q}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
