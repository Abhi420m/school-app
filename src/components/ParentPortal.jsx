import React, { useState } from 'react';
import DownloadAppModal from './DownloadAppModal';
import {
  Calendar,
  Wallet,
  Trophy,
  BookOpen,
  Bell,
  CalendarX,
  Clock,
  Bus,
  MessageCircle,
  Image,
  Award,
  PartyPopper,
  CheckCircle2,
  XCircle,
  PhoneCall,
  MessageSquare,
  Printer,
  ChevronRight,
  Sun,
  Settings,
  Users,
  X,
  FileText,
  DollarSign,
  Smartphone,
  Download
} from 'lucide-react';
import { getStudentAttendanceSummary } from '../data/storage';

export default function ParentPortal({
  activeSchool,
  currentSession,
  students,
  teachers,
  attendance,
  exams,
  homework,
  notices,
  todayDate,
  onOpenReportCard,
  t
}) {
  // Sibling list support (Section 2.3: "siblings ek account mein")
  const defaultSiblings = students.slice(0, 2);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState(null);

  const student = defaultSiblings[selectedChildIndex] || students[0];

  // Class teacher for this child
  const classTeacher = teachers.find(
    (tch) => tch.classInCharge && tch.classInCharge.includes(student?.className?.replace('Class ', ''))
  ) || teachers[0] || {
    name: "Dr. Rajesh Sharma",
    phone: "+91 98765 43210",
    subject: "Mathematics HOD"
  };

  // Attendance summary
  const attendanceSummary = student ? getStudentAttendanceSummary(student.id, attendance) : null;
  const todayStatus = (attendance[todayDate] && student) ? (attendance[todayDate][student.id] || 'Present') : 'Present';

  // 12 Services matching Design Guide Section 3
  const services = [
    { id: 'attendance', title: 'Attendance', hi: 'हाजिरी', icon: Calendar, bg: 'bg-emerald-50 text-emerald-700', badge: 'Live' },
    { id: 'fees', title: 'Fees', hi: 'फीस', icon: Wallet, bg: 'bg-amber-50 text-amber-700', badge: '₹0 Due' },
    { id: 'results', title: 'Results', hi: 'रिजल्ट', icon: Trophy, bg: 'bg-purple-50 text-purple-700', badge: 'Term 1' },
    { id: 'homework', title: 'Homework', hi: 'गृहकार्य', icon: BookOpen, bg: 'bg-blue-50 text-blue-700', count: homework.length },
    { id: 'notice', title: 'Notice', hi: 'सूचना', icon: Bell, bg: 'bg-rose-50 text-rose-700', count: notices.length },
    { id: 'leave', title: 'Leave', hi: 'अवकाश', icon: CalendarX, bg: 'bg-indigo-50 text-indigo-700' },
    { id: 'timetable', title: 'Time Table', hi: 'समय सारणी', icon: Clock, bg: 'bg-teal-50 text-teal-700' },
    { id: 'bustrack', title: 'Bus Track', hi: 'बस ट्रैकिंग', icon: Bus, bg: 'bg-orange-50 text-orange-700', badge: 'Route 4' },
    { id: 'messages', title: 'Messages', hi: 'संदेश', icon: MessageCircle, bg: 'bg-cyan-50 text-cyan-700' },
    { id: 'gallery', title: 'Gallery', hi: 'फोटो', icon: Image, bg: 'bg-pink-50 text-pink-700' },
    { id: 'remarks', title: 'Remarks', hi: 'टिप्पणी', icon: Award, bg: 'bg-lime-50 text-lime-700', badge: 'Good' },
    { id: 'holiday', title: 'Holiday/Events', hi: 'छुट्टियां', icon: PartyPopper, bg: 'bg-yellow-50 text-yellow-700' },
  ];

  if (!student) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
        <p className="text-slate-500 text-sm">No child enrolled in this school.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-[85vh] rounded-[36px] shadow-2xl border-4 border-slate-900 overflow-hidden relative pb-24">
      
      {/* 1. TOP DARK GREEN HEADER (#05574F) matching Section 3 */}
      <div className="bg-[#05574F] text-white pt-6 pb-12 px-5 rounded-b-[32px] relative shadow-md">
        {/* Top Profile & School Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FDBE3E] text-[#05574F] font-black text-xl flex items-center justify-center border-2 border-white shadow-md">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base leading-tight">
                  Hi, {student.name.split(' ')[0]}
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#FDBE3E]"></span>
              </div>
              <p className="text-[11px] text-[#B2DFDB] font-medium truncate max-w-[190px]">
                {activeSchool?.name || "St. Xavier's Academy"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-[#FDBE3E] hover:bg-amber-400 text-[#05574F] text-[11px] font-black flex items-center gap-1 shadow-sm transition active:scale-95"
              title="Download Android APK & Apple iOS App"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Get App</span>
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 text-white relative">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-[#FDBE3E] absolute top-2 right-2"></span>
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 text-white">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Good Morning & Date Subheader */}
        <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-white/80">
            <Sun className="w-4 h-4 text-[#FDBE3E]" />
            <span>Good Morning, Parents</span>
          </div>
          <span className="text-[#B2DFDB] font-semibold text-[11px]">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* 2. BODY CONTENT (Overlapping white card with 3-column icon grid) */}
      <div className="-mt-7 px-4 space-y-4">
        
        {/* Core Flow Banner: Live Attendance Notification Alert */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-[#05574F]">
                {student.name} is marked {todayStatus}
              </h4>
              <p className="text-[11px] text-slate-500">
                School arrival confirmed at 08:15 AM
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md animate-pulse">
            LIVE
          </span>
        </div>

        {/* WHITE ROUNDED CARD: 3-COLUMN ICON GRID (#05574F Title) */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-extrabold text-sm text-[#05574F]">School Services</h4>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {student.className} - {student.section}
            </span>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-3 gap-3">
            {services.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveServiceModal(item.id)}
                  className="flex flex-col items-center justify-center p-2.5 rounded-2xl hover:bg-slate-50 transition group"
                >
                  <div className={`w-13 h-13 rounded-full flex items-center justify-center mb-1.5 shadow-xs group-hover:scale-105 transition ${item.bg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 text-center leading-tight">
                    {item.title}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    {item.hi}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Teacher Connect Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#05574F] text-white flex items-center justify-center font-bold text-sm">
              {classTeacher.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{classTeacher.name}</p>
              <p className="text-[10px] text-slate-500">{classTeacher.subject} • Class Teacher</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${classTeacher.phone}`}
              className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center hover:bg-emerald-200 transition"
              title="Call Teacher"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${classTeacher.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition"
              title="WhatsApp Message"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Homework Preview */}
        {homework.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#05574F]">Today's Homework</span>
              <span className="text-[10px] text-slate-400">Due: Tomorrow</span>
            </div>
            <p className="text-xs font-bold text-slate-800">{homework[0].title}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{homework[0].description}</p>
          </div>
        )}
      </div>

      {/* 3. BOTTOM NAV BAR WITH CENTER BIG YELLOW BUTTON (#FDBE3E) FOR "CHILD SWITCH" */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-6 flex items-center justify-between shadow-lg">
        <button className="flex flex-col items-center text-[#05574F]">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </button>

        <button className="flex flex-col items-center text-slate-400 hover:text-[#05574F]">
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Group</span>
        </button>

        {/* Center Big Yellow Floating Action Button (#FDBE3E) */}
        <div className="-mt-8">
          <button
            onClick={() => setIsSwitchModalOpen(true)}
            className="w-14 h-14 rounded-full bg-[#FDBE3E] text-[#05574F] flex flex-col items-center justify-center shadow-xl border-4 border-white hover:scale-105 active:scale-95 transition"
            title="Switch Child (बच्चा बदलें)"
          >
            <Users className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        <button
          onClick={() => setActiveServiceModal('results')}
          className="flex flex-col items-center text-slate-400 hover:text-[#05574F]"
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Reports</span>
        </button>

        <button className="flex flex-col items-center text-slate-400 hover:text-[#05574F]">
          <Award className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Profile</span>
        </button>
      </div>

      {/* SIBLING SWITCH MODAL (Child Switch Bottom Sheet) */}
      {isSwitchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-[#05574F] text-base">
                Switch Child / बच्चा बदलें
              </h4>
              <button
                onClick={() => setIsSwitchModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 my-2">
              Siblings linked under one parent account (Project Plan Section 2.3):
            </p>

            <div className="space-y-2 mt-3">
              {defaultSiblings.map((sib, idx) => {
                const isSelected = selectedChildIndex === idx;
                return (
                  <button
                    key={sib.id}
                    onClick={() => {
                      setSelectedChildIndex(idx);
                      setIsSwitchModalOpen(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition border text-left ${
                      isSelected
                        ? 'bg-emerald-50 border-[#05574F] text-[#05574F]'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#05574F] text-white font-bold flex items-center justify-center">
                        {sib.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xs">{sib.name}</p>
                        <p className="text-[11px] text-slate-500">{sib.className} - {sib.section} • Roll #{sib.rollNo}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-[#05574F]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SERVICE MODAL VIEWS (Attendance, Fees, Results, etc.) */}
      {activeServiceModal === 'results' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">Academic Performance</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-2 font-black text-2xl">
                92%
              </div>
              <h5 className="font-black text-slate-900 text-base">{student.name}</h5>
              <p className="text-xs text-slate-500">Overall Grade: A1 • Rank #2</p>
              <button
                onClick={() => {
                  setActiveServiceModal(null);
                  onOpenReportCard(student);
                }}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#05574F] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4" />
                <span>View Official Marksheet</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeServiceModal === 'fees' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">Fee Dues & Payment</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Annual Tuition Fee:</span>
                <span className="font-bold">₹{student.feeAmount?.toLocaleString() || '36,000'}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-600">₹{student.feePaid?.toLocaleString() || '36,000'}</span>
              </div>
              <div className="flex justify-between py-1 font-bold">
                <span>Balance Due:</span>
                <span className="text-emerald-700">₹0 (All Clear)</span>
              </div>
              <button
                onClick={() => alert("Receipt downloaded.")}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Download Fee Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeServiceModal === 'attendance' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">Attendance Record</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 text-center">
              <p className="text-3xl font-black text-emerald-700">
                {attendanceSummary ? attendanceSummary.rate : student.attendancePercentage}%
              </p>
              <p className="text-xs text-slate-500 mt-1">Eligible for Annual CBSE Board Examinations</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <span className="font-bold text-emerald-800">26 Days Present</span>
                </div>
                <div className="p-2.5 bg-red-50 rounded-xl">
                  <span className="font-bold text-red-800">1 Day Leave</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD MOBILE APP MODAL (Android & Apple iOS) */}
      {isDownloadModalOpen && (
        <DownloadAppModal onClose={() => setIsDownloadModalOpen(false)} />
      )}
    </div>
  );
}
