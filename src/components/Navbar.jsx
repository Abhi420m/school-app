import React, { useState } from 'react';
import DownloadAppModal from './DownloadAppModal';
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
  Smartphone
} from 'lucide-react';

export default function Navbar({
  activeSchool,
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
  // Navigation tabs based on user role
  const adminNavItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'classes', label: t.navClasses, icon: GraduationCap },
    { id: 'students', label: t.navStudents, icon: Users },
    { id: 'teachers', label: t.navTeachers, icon: Contact },
    { id: 'attendance', label: t.navAttendance, icon: CalendarCheck2 },
    { id: 'exams', label: t.navExams, icon: FileSpreadsheet },
    { id: 'notices', label: t.navNotices, icon: BellRing },
    { id: 'parent-view', label: t.navParentView, icon: HeartHandshake, badge: 'Parent View' }
  ];

  const teacherNavItems = [
    { id: 'attendance', label: t.navAttendance, icon: CalendarCheck2 },
    { id: 'exams', label: t.navExams, icon: FileSpreadsheet },
    { id: 'students', label: t.navStudents, icon: Users },
    { id: 'classes', label: t.navClasses, icon: GraduationCap },
    { id: 'notices', label: t.navNotices, icon: BellRing }
  ];

  const parentNavItems = [
    { id: 'parent-view', label: t.navParentView, icon: HeartHandshake }
  ];

  const currentNavItems = currentRole === 'teacher'
    ? teacherNavItems
    : currentRole === 'parent'
    ? parentNavItems
    : adminNavItems;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      {/* Top Banner with Active School Info, User Session Badge, and Logout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        
        {/* School Crest & Active School Name (Strictly private to this logged in school) */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeSchool?.badgeColor || 'from-blue-700 to-indigo-600'} text-white flex items-center justify-center shadow-md shrink-0`}>
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-tight">
                {activeSchool?.name || 'School ERP'}
              </h1>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {activeSchool?.board || 'CBSE'}
              </span>
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
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
              {currentSession?.userName ? currentSession.userName.charAt(0) : 'U'}
            </div>
            <div>
              <p className="font-extrabold text-slate-900 leading-none">{currentSession?.userName || 'Admin'}</p>
              <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">
                {currentSession?.role === 'school_admin' ? 'School Admin' : currentSession?.role}
              </span>
            </div>
          </div>

          {/* Download Mobile App Button */}
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#05574F] hover:bg-[#076c62] text-white text-xs font-bold transition shadow-xs"
            title="Download Android & Apple App"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#FDBE3E]" />
            <span className="hidden sm:inline">Get App</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition border border-red-200"
            title="Log out from this school account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout (लॉगआउट)</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
        <nav className="flex space-x-1 py-1.5">
          {currentNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Search */}
        <div className="hidden lg:flex items-center relative py-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/70 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg outline-none transition w-48 focus:w-64"
          />
        </div>
      </div>

      {/* Download Mobile App Modal */}
      {isDownloadModalOpen && (
        <DownloadAppModal onClose={() => setIsDownloadModalOpen(false)} />
      )}
    </header>
  );
}
