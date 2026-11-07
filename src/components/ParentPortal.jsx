import React, { useState } from 'react';
import DownloadAppModal from './DownloadAppModal';
import TimetableModal from './TimetableModal';
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
  Download,
  User,
  Pencil,
  Save,
  ShieldCheck
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
  onUpdateStudent,
  t
}) {
  // Sibling list support & student matching for logged in parent (Section 2.3)
  const matchedChildren = students.filter(
    (s) =>
      (currentSession?.studentId && s.id === currentSession.studentId) ||
      (currentSession?.phone && s.phone && s.phone.replace(/\D/g, '').endsWith(currentSession.phone.replace(/\D/g, '').slice(-10)))
  );

  const parentChildren = matchedChildren.length > 0 ? matchedChildren : students.slice(0, 2);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const student = parentChildren[selectedChildIndex] || parentChildren[0] || students[0];

  // Student Profile Edit State (so students/parents can give/update their own details)
  const [profileEditData, setProfileEditData] = useState({
    phone: student?.phone || '',
    address: student?.address || '',
    bloodGroup: student?.bloodGroup || 'B+',
    email: student?.email || '',
    emergencyContact: student?.emergencyContact || student?.phone || '',
    fatherName: student?.fatherName || '',
    motherName: student?.motherName || ''
  });

  const handleOpenProfileModal = () => {
    if (student) {
      setProfileEditData({
        phone: student.phone || '',
        address: student.address || '',
        bloodGroup: student.bloodGroup || 'B+',
        email: student.email || '',
        emergencyContact: student.emergencyContact || student.phone || '',
        fatherName: student.fatherName || '',
        motherName: student.motherName || ''
      });
    }
    setIsProfileModalOpen(true);
  };

  const handleSaveProfileSubmit = (e) => {
    e.preventDefault();
    if (!student) return;

    const updated = {
      ...student,
      phone: profileEditData.phone,
      address: profileEditData.address,
      bloodGroup: profileEditData.bloodGroup,
      email: profileEditData.email,
      emergencyContact: profileEditData.emergencyContact,
      fatherName: profileEditData.fatherName,
      motherName: profileEditData.motherName
    };

    if (onUpdateStudent) {
      onUpdateStudent(updated);
    }
    alert("✅ आपकी व्यक्तिगत जानकारी स्कूल रिकॉर्ड में सफलतापूर्वक दर्ज कर दी गई है!\n(Your details have been submitted and updated in school records successfully!)");
    setIsProfileModalOpen(false);
  };

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
            <span className="text-[10px] bg-white/20 text-[#B2DFDB] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
              View Only
            </span>
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

        {/* Student Profile & Contact Card (अपनी जानकारी देखें व अपडेट करें) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-xs text-slate-900">{student.name}</h4>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                  Roll #{student.rollNo}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {student.className} (Sec {student.section}) • Phone: {student.phone || 'Not updated'}
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenProfileModal}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition border border-emerald-200"
            title="Click to view & submit student contact details"
          >
            <Pencil className="w-3 h-3" />
            <span>अपडेट करें</span>
          </button>
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

        <button
          onClick={handleOpenProfileModal}
          className="flex flex-col items-center text-slate-400 hover:text-[#05574F]"
          title="My Profile & Contact Details (मेरी जानकारी)"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Profile</span>
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
              {parentChildren.map((sib, idx) => {
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

      {/* TIMETABLE MODAL (समय सारणी) */}
      {activeServiceModal === 'timetable' && (
        <TimetableModal
          className={student.className}
          section={student.section}
          teachers={teachers}
          isEditable={false}
          onClose={() => setActiveServiceModal(null)}
        />
      )}

      {/* HOMEWORK MODAL (गृहकार्य) */}
      {activeServiceModal === 'homework' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">Daily Homework (गृहकार्य)</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-3 space-y-2.5">
              {homework && homework.length > 0 ? (
                homework.map((hw) => (
                  <div key={hw.id} className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-blue-900 text-xs">{hw.subject}</span>
                      <span className="text-[10px] text-blue-700 font-mono">Due: Tomorrow</span>
                    </div>
                    <p className="font-bold text-xs text-slate-800 mt-1">{hw.title}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{hw.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No homework assigned today.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NOTICE MODAL (सूचना) */}
      {activeServiceModal === 'notice' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">Circulars & Notices (सूचना)</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-3 space-y-2.5">
              {notices && notices.length > 0 ? (
                notices.map((n) => (
                  <div key={n.id} className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-rose-900 text-xs">{n.category || 'School Notice'}</span>
                      <span className="text-[10px] text-rose-700 font-mono">{n.date}</span>
                    </div>
                    <p className="font-bold text-xs text-slate-800 mt-1">{n.title}</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 text-center py-4">No new notices posted.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LEAVE RECORD MODAL (अवकाश) */}
      {activeServiceModal === 'leave' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">Student Leave (अवकाश रिकॉर्ड)</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-black text-indigo-950 text-sm">Leave Balance: 5 Days</p>
                  <p className="text-[10px] text-indigo-700">Annual Medical & Casual allowance</p>
                </div>
                <span className="px-2.5 py-1 bg-indigo-200 text-indigo-900 font-bold rounded-lg text-[10px]">Active</span>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Past Leave History</span>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">Fever & Medical Rest</p>
                    <p className="text-[10px] text-slate-500">2 Nov 2026 • 1 Day</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Approved</span>
                </div>
              </div>
              <button
                onClick={() => alert("✅ Leave application request submitted to Class Teacher for approval.")}
                className="w-full py-2.5 bg-[#05574F] hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs text-xs mt-2"
              >
                Apply for New Leave (अवकाश आवेदन करें)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BUS TRACKING MODAL (बस ट्रैकिंग) */}
      {activeServiceModal === 'bustrack' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">School Bus GPS Tracking</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-black text-orange-950 text-sm">Bus Route 4 (DL-01-AB-4921)</span>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white font-bold rounded text-[10px] animate-pulse">LIVE</span>
                </div>
                <p className="text-[11px] text-orange-800 mt-1">Driver: <strong>Ramesh Kumar</strong> • Phone: +91 98765 11223</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-700 font-bold">Current Location: Sector 14 Main Road</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-slate-700 font-bold">Next Stop: Shanti Vihar (ETA: 4 Mins)</span>
                </div>
              </div>

              <a
                href="tel:9876511223"
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Bus Attendant</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGES MODAL (संदेश) */}
      {activeServiceModal === 'messages' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">School Communication</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-3 space-y-2.5 text-xs">
              <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-2xl">
                <p className="font-bold text-cyan-950">{classTeacher.name} (Class Teacher)</p>
                <p className="text-[11px] text-cyan-800 mt-1">
                  "Dear Parent, {student.name} was very attentive in mathematics problem solving today. Please make sure they revise Chapter 4 over the weekend."
                </p>
                <span className="text-[9px] text-slate-400 mt-1 block">Sent Today at 02:30 PM</span>
              </div>
              <a
                href={`https://wa.me/${classTeacher.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs text-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Reply on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY MODAL (फोटो) */}
      {activeServiceModal === 'gallery' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">School Activity Gallery</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-3 space-y-3 text-xs">
              <div className="p-3 bg-pink-50 border border-pink-100 rounded-2xl">
                <span className="font-bold text-pink-950 block">Annual Sports Day Celebration 🏆</span>
                <p className="text-[11px] text-pink-800 mt-0.5">Track & field events with medal ceremony</p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl">
                <span className="font-bold text-purple-950 block">National Science & AI Exhibition 🔬</span>
                <p className="text-[11px] text-purple-800 mt-0.5">Students presenting STEM robotics models</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                <span className="font-bold text-amber-950 block">Independence & Republic Day Parade 🇮🇳</span>
                <p className="text-[11px] text-amber-800 mt-0.5">Cultural songs, march past & flag hoisting</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REMARKS MODAL (टिप्पणी) */}
      {activeServiceModal === 'remarks' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">Teacher Remarks (शिक्षक टिप्पणी)</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-lime-50 border border-lime-200 rounded-2xl">
                <div className="flex items-center gap-1.5 text-lime-900 font-extrabold mb-1">
                  <Award className="w-4 h-4 text-lime-700" />
                  <span>Academic & Behavioral Commendation</span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">
                  "{student.name} shows exemplary dedication in homework submission and exhibits respectful conduct towards teachers and classmates."
                </p>
                <div className="mt-3 pt-2 border-t border-lime-200 flex justify-between items-center text-[10px] text-slate-500">
                  <span>Signed: {classTeacher.name}</span>
                  <span className="font-bold text-lime-800">Grade: A+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOLIDAY & EVENTS MODAL (छुट्टियां) */}
      {activeServiceModal === 'holiday' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#05574F]">Academic Calendar & Holidays</h4>
              <button onClick={() => setActiveServiceModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-3 space-y-2 text-xs">
              <div className="p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-yellow-950">Guru Nanak Jayanti</p>
                  <p className="text-[10px] text-yellow-800">15 November 2026</p>
                </div>
                <span className="text-[10px] font-bold bg-yellow-200 text-yellow-900 px-2 py-0.5 rounded">Gazetted</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Winter Vacation (शीतकालीन अवकाश)</p>
                  <p className="text-[10px] text-slate-500">25 Dec 2026 - 02 Jan 2027</p>
                </div>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">Break</span>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-emerald-950">Republic Day Celebration 🇮🇳</p>
                  <p className="text-[10px] text-emerald-800">26 January 2027</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">National</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STUDENT PROFILE & UPDATE DETAILS MODAL (विद्यार्थी जानकारी प्रविष्टि व सुधार) */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#05574F] text-[#FDBE3E] flex items-center justify-center shadow-md">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  My Profile & Details (विद्यार्थी जानकारी)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {student.name} • {student.className} (Sec {student.section})
                </p>
              </div>
            </div>

            {/* School Registered Info (Fixed) */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl mb-4 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Admission No</span>
                <span className="font-mono font-bold text-slate-800">{student.admissionNo}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Roll Number</span>
                <span className="font-mono font-bold text-slate-800">#{student.rollNo}</span>
              </div>
            </div>

            {/* Editable Profile Information Form */}
            <form onSubmit={handleSaveProfileSubmit} className="space-y-3.5 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>अपनी संपर्क व पारिवारिक जानकारी यहाँ अपडेट करें:</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Parent Mobile / WhatsApp Phone *</label>
                <input
                  type="tel"
                  required
                  value={profileEditData.phone}
                  onChange={(e) => setProfileEditData({ ...profileEditData, phone: e.target.value })}
                  placeholder="+91 98765 00000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={profileEditData.emergencyContact}
                    onChange={(e) => setProfileEditData({ ...profileEditData, emergencyContact: e.target.value })}
                    placeholder="Alternate number"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select
                    value={profileEditData.bloodGroup}
                    onChange={(e) => setProfileEditData({ ...profileEditData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white font-medium"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email ID</label>
                <input
                  type="email"
                  value={profileEditData.email}
                  onChange={(e) => setProfileEditData({ ...profileEditData, email: e.target.value })}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={profileEditData.fatherName}
                    onChange={(e) => setProfileEditData({ ...profileEditData, fatherName: e.target.value })}
                    placeholder="Father Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={profileEditData.motherName}
                    onChange={(e) => setProfileEditData({ ...profileEditData, motherName: e.target.value })}
                    placeholder="Mother Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Residential Home Address *</label>
                <textarea
                  rows="2"
                  required
                  value={profileEditData.address}
                  onChange={(e) => setProfileEditData({ ...profileEditData, address: e.target.value })}
                  placeholder="House number, Street, Area, City..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#05574F] hover:bg-emerald-800 text-white font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-[#FDBE3E]" />
                  <span>Save & Submit Details (सहेजें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
