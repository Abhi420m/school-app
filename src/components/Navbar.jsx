import React, { useState } from 'react';
import DownloadAppModal from './DownloadAppModal';
import SchoolSettingsModal from './SchoolSettingsModal';
import {
  School,
  LayoutDashboard,
  GraduationCap,
  Users,
  Contact,
  CalendarCheck2,
  FileSpreadsheet,
  BellRing,
  HeartHandshake,
  Globe,
  Search,
  LogOut,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Smartphone,
  Settings,
  Wallet
} from 'lucide-react';

export default function Navbar({
  activeSchool,
  onUpdateSchool,
  currentSession,
  onLogout,
  currentRole,
  activeTab,
  setActiveTab,
  lang,
  setLang,
  t,
  searchTerm,
  setSearchTerm
}) {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // RBAC Navigation items:
  // 1. School Admin: Full institutional controls (Parent view button is completely hidden from school portal)
  const adminNavItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'classes', label: t.navClasses, icon: GraduationCap },
    { id: 'students', label: t.navStudents, icon: Users },
    { id: 'teachers', label: t.navTeachers, icon: Contact },
    { id: 'attendance', label: t.navAttendance, icon: CalendarCheck2 },
    { id: 'exams', label: t.navExams, icon: FileSpreadsheet },
    { id: 'notices', label: t.navNotices, icon: BellRing }
  ];

  // 2. Teacher: ONLY teacher section (Attendance, Test & Exam Marks, Classes/Timetable, Homework/Notices)
  const teacherNavItems = [
    { id: 'attendance', label: 'दैनिक उपस्थिति (Attendance)', icon: CalendarCheck2 },
    { id: 'exams', label: 'टेस्ट व परीक्षा परिणाम (Marks Entry)', icon: FileSpreadsheet },
    { id: 'classes', label: 'कक्षाएं व समय सारणी (Classes)', icon: GraduationCap },
    { id: 'notices', label: 'सूचना व गृहकार्य (Notices)', icon: BellRing }
  ];

  // 3. Fee Counter / Accountant: ONLY fee section (Student directory with fee collection & receipts)
  const accountantNavItems = [
    { id: 'students', label: 'फीस काउंटर व रसीदें (Fee Counter)', icon: Wallet },
    { id: 'notices', label: 'फीस परिपत्र (Notices)', icon: BellRing }
  ];

  // 4. Parent / Student App
  const parentNavItems = [
    { id: 'parent-view', label: t.navParentView, icon: HeartHandshake }
  ];

  const currentNavItems = currentRole === 'teacher'
    ? teacherNavItems
    : currentRole === 'accountant'
    ? accountantNavItems
    : currentRole === 'parent'
    ? parentNavItems
    : adminNavItems;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Banner with Active School Info, User Session Badge, and Logout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        
        {/* School Crest & Active School Name (Strictly private to this logged in school) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => currentSession?.role === 'school_admin' && setIsSettingsOpen(true)}
            className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeSchool?.badgeColor || 'from-[#05574F] to-teal-700'} text-white flex items-center justify-center shadow-md shrink-0 hover:scale-105 transition cursor-pointer overflow-hidden p-0.5`}
            title="Click to edit school settings & upload logo"
          >
            {activeSchool?.logoUrl ? (
              <img src={activeSchool.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-lg bg-white" />
            ) : (
              <School className="w-5 h-5" />
            )}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-tight">
                {activeSchool?.name || 'School ERP'}
              </h1>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {activeSchool?.board || 'CBSE'}
              </span>
              {currentSession?.role === 'school_admin' && (
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition"
                  title="Edit School Details & Upload Logo / सेटिंग्स बदलें"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {activeSchool?.city || 'Campus'} • Code: <span className="font-mono font-bold text-slate-700">{activeSchool?.code}</span>
            </p>
          </div>
        </div>

        {/* Right Controls: User Profile, Language, Logout */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Logged in User Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <div className={`w-6 h-6 rounded-full text-white font-bold flex items-center justify-center text-[10px] ${
              currentSession?.role === 'school_admin'
                ? 'bg-blue-600'
                : currentSession?.role === 'teacher'
                ? 'bg-purple-600'
                : currentSession?.role === 'accountant'
                ? 'bg-amber-600'
                : 'bg-emerald-600'
            }`}>
              {currentSession?.userName ? currentSession.userName.charAt(0) : 'U'}
            </div>
            <div>
              <p className="font-extrabold text-slate-900 leading-none">{currentSession?.userName || 'User'}</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                {currentSession?.role === 'school_admin'
                  ? '👑 Principal / Admin'
                  : currentSession?.role === 'teacher'
                  ? '👩‍🏫 Teacher (शिक्षक)'
                  : currentSession?.role === 'accountant'
                  ? '💰 Fee Counter (लेखाकार)'
                  : currentSession?.role}
              </span>
            </div>
          </div>

          {/* School Settings Button (Only for School Admin) */}
          {currentSession?.role === 'school_admin' && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs"
              title="Edit School Details & Logo (स्कूल विवरण व लोगो बदलें)"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Settings & Logo</span>
            </button>
          )}

          {/* Download Mobile App Button */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#05574F] hover:bg-[#076c62] text-white text-xs font-bold transition shadow-xs"
            title="Download Android & Apple App"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#FDBE3E]" />
            <span className="hidden sm:inline">Get App</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition shadow-xs"
            title="Sign out of this school session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      {currentRole === 'parent' ? (
        <div className="bg-emerald-50/80 border-t border-emerald-100 py-2 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Parent & Student Portal • Read-Only View (केवल विद्यार्थी व अभिभावक दृश्य)</span>
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full font-semibold hidden sm:inline">
              🔒 School editing controls are protected
            </span>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <nav className="flex space-x-1 py-1.5">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#05574F] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FDBE3E]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Search for Admin and Staff */}
          <div className="hidden lg:flex items-center relative py-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-lg outline-none transition w-48 focus:w-64"
            />
          </div>
        </div>
      )}

      {/* Download Mobile App Modal */}
      {isDownloadModalOpen && (
        <DownloadAppModal onClose={() => setIsDownloadModalOpen(false)} />
      )}

      {/* School Settings & Details Modal */}
      {isSettingsOpen && (
        <SchoolSettingsModal
          school={activeSchool}
          onSave={onUpdateSchool}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </header>
  );
}
