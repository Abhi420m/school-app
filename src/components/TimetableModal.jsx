import React, { useState } from 'react';
import {
  Clock,
  X,
  Printer,
  Calendar,
  BookOpen,
  User,
  Coffee,
  CheckCircle2,
  Pencil,
  Save,
  Sparkles,
  School,
  LayoutGrid,
  FileSpreadsheet
} from 'lucide-react';

export default function TimetableModal({
  className = "Class 10",
  section = "A",
  teachers = [],
  activeSchool,
  isEditable = false,
  onClose
}) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday
  const defaultDay = todayDayIndex >= 1 && todayDayIndex <= 6 ? days[todayDayIndex - 1] : 'Monday';

  const [activeDay, setActiveDay] = useState(defaultDay);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'weekly_grid'

  // Default smart periods schedule for all 6 days
  const [scheduleData, setScheduleData] = useState({
    Monday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "English Literature", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "Science (Physics)", teacher: "Mrs. Sunita Rao", room: "Science Lab" },
      { id: 4, isBreak: true, period: "Recess", time: "10:45 - 11:15 AM", subject: "Tiffin & Lunch Break", teacher: "Campus Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "Social Science", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Hindi Sahitya", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Computer Science", teacher: "Dr. Anand Verma", room: "IT Lab" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "Physical Education", teacher: "Mr. Vikram Singh", room: "Playground" }
    ],
    Tuesday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Science (Biology)", teacher: "Mrs. Sunita Rao", room: "Bio Lab" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "Hindi Course-A", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 4, isBreak: true, period: "Recess", time: "10:45 - 11:15 AM", subject: "Tiffin & Lunch Break", teacher: "Campus Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "English Grammar", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Social Science", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Library & Reading", teacher: "Mrs. Neelam Kapoor", room: "Library" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "Music & Cultural", teacher: "Mr. Ashish Kumar", room: "Activity Hall" }
    ],
    Wednesday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Science (Chemistry)", teacher: "Mrs. Sunita Rao", room: "Chem Lab" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "Social Science", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 4, isBreak: true, period: "Recess", time: "10:45 - 11:15 AM", subject: "Tiffin & Lunch Break", teacher: "Campus Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "English Language", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Hindi Vyakaran", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Maths Doubt Session", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "GK & Ethics", teacher: "Mrs. Neelam Kapoor", room: "Room 101" }
    ],
    Thursday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "English Literature", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "Science (Physics)", teacher: "Mrs. Sunita Rao", room: "Physics Lab" },
      { id: 4, isBreak: true, period: "Recess", time: "10:45 - 11:15 AM", subject: "Tiffin & Lunch Break", teacher: "Campus Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "Social Science", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Hindi Sahitya", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Computer Lab (AI)", teacher: "Dr. Anand Verma", room: "IT Lab" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "Yoga & Health", teacher: "Mr. Vikram Singh", room: "Yoga Hall" }
    ],
    Friday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Science Practical", teacher: "Mrs. Sunita Rao", room: "Science Lab" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "English Writing", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 4, isBreak: true, period: "Recess", time: "10:45 - 11:15 AM", subject: "Tiffin & Lunch Break", teacher: "Campus Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "Social Science", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Hindi Vyakaran", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Debate & Oratory", teacher: "Mrs. Priya Joshi", room: "Auditorium" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "Outdoor Sports", teacher: "Mr. Vikram Singh", room: "Playground" }
    ],
    Saturday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Maths Weekly Test", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Science Quiz", teacher: "Mrs. Sunita Rao", room: "Room 101" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "English Spoken & Drama", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 4, isBreak: true, period: "Recess", time: "10:45 - 11:15 AM", subject: "Tiffin & Lunch Break", teacher: "Campus Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "Club & Scouts Activity", teacher: "Mr. Sanjay Mishra", room: "Activity Hall" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Values & Life Skills", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Inter-House Matches", teacher: "Mr. Vikram Singh", room: "Ground" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "Class Teacher Assembly", teacher: "Dr. Rajesh Sharma", room: "Room 101" }
    ]
  });

  const currentPeriods = scheduleData[activeDay] || scheduleData.Monday;

  const handlePeriodChange = (id, field, value) => {
    setScheduleData(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const schoolName = activeSchool?.name || "St. Xavier's International Academy";
  const schoolAffiliation = activeSchool?.affiliation || "Affiliated to CBSE, New Delhi | Affiliation No: 20491";
  const schoolPhone = activeSchool?.phone || "+91 74549 96566";
  const schoolAddress = activeSchool?.address || "School Campus, Institutional Area";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/75 backdrop-blur-xs modal-overlay animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto printable-card">
        
        {/* Close Button (Hidden in print) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Controls Bar (Hidden in print) */}
        <div className="no-print flex items-center justify-between pb-3 border-b border-slate-100 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#05574F] text-[#FDBE3E] flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight">
                  Class Time Table (समय सारणी)
                </h3>
                <span className="text-xs font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  {className} {section ? `- Sec ${section}` : ''}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Official School Schedule • Weekly 6-Day Period Table
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'daily'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Daily View (दैनिक)</span>
              </button>
              <button
                onClick={() => setViewMode('weekly_grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'weekly_grid'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Weekly Sheet (साप्ताहिक)</span>
              </button>
            </div>

            {isEditable && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isEditing
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isEditing ? <Save className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                <span>{isEditing ? 'Save' : 'Edit'}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#05574F] hover:bg-[#076c62] text-white text-xs font-bold transition shadow-xs"
              title="Print Timetable directly or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#FDBE3E]" />
              <span>Print / Save as PDF (प्रिंट व पीडीएफ लें)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINTABLE OFFICIAL TIMETABLE SHEET (Always printed, clean, zero website clutter) */}
        {/* ========================================================================= */}
        <div className="printable-sheet border-2 border-slate-700 rounded-xl p-4 sm:p-5 bg-white text-slate-900">
          
          {/* Official Letterhead Header */}
          <div className="text-center border-b-2 border-slate-800 pb-3 mb-3">
            <div className="flex items-center justify-center gap-3 mb-1">
              {activeSchool?.logoUrl ? (
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  <img src={activeSchool.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#05574F] text-[#FDBE3E] flex items-center justify-center font-bold">
                  <School className="w-6 h-6" />
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 leading-tight">
                  {schoolName}
                </h1>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  {schoolAffiliation}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500">
              {schoolAddress} • Helpline: <span className="font-mono font-bold text-slate-700">{schoolPhone}</span>
            </p>
            <div className="mt-1.5 inline-block px-3 py-0.5 rounded-full bg-slate-100 text-slate-900 border border-slate-300 text-[11px] font-black uppercase tracking-widest">
              OFFICIAL CLASS TIME TABLE • SESSION 2026-2027 (समय-सारणी)
            </div>
          </div>

          {/* Particulars Bar */}
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex items-center justify-between flex-wrap gap-2 mb-3">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Class & Section</span>
              <span className="font-black text-slate-900 text-sm">{className} - Section {section}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Class Teacher</span>
              <span className="font-bold text-slate-800 text-xs">Dr. Rajesh Sharma</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Class Room</span>
              <span className="font-bold text-slate-800 text-xs font-mono">Room 101 (Main Wing)</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Timings</span>
              <span className="font-bold text-slate-800 text-xs">08:30 AM to 02:15 PM</span>
            </div>
          </div>

          {/* FULL WEEKLY MASTER TIMETABLE GRID (Monday to Saturday) */}
          <div className="overflow-x-auto rounded-lg border border-slate-300 mb-3">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="py-2 px-2.5 border-r border-slate-300 w-20 text-center uppercase">Day</th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center">P1<br /><span className="font-normal text-[9px] text-slate-500">08:30-09:15</span></th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center">P2<br /><span className="font-normal text-[9px] text-slate-500">09:15-10:00</span></th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center">P3<br /><span className="font-normal text-[9px] text-slate-500">10:00-10:45</span></th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center bg-amber-50/80 text-amber-900">Break<br /><span className="font-normal text-[9px] text-amber-700">10:45-11:15</span></th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center">P4<br /><span className="font-normal text-[9px] text-slate-500">11:15-12:00</span></th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center">P5<br /><span className="font-normal text-[9px] text-slate-500">12:00-12:45</span></th>
                  <th className="py-2 px-2 border-r border-slate-300 text-center">P6<br /><span className="font-normal text-[9px] text-slate-500">12:45-01:30</span></th>
                  <th className="py-2 px-2 text-center">P7<br /><span className="font-normal text-[9px] text-slate-500">01:30-02:15</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {days.map((dayName) => {
                  const daySchedule = scheduleData[dayName] || [];
                  const p1 = daySchedule.find(p => p.period === "Period 1") || {};
                  const p2 = daySchedule.find(p => p.period === "Period 2") || {};
                  const p3 = daySchedule.find(p => p.period === "Period 3") || {};
                  const p4 = daySchedule.find(p => p.period === "Period 4") || {};
                  const p5 = daySchedule.find(p => p.period === "Period 5") || {};
                  const p6 = daySchedule.find(p => p.period === "Period 6") || {};
                  const p7 = daySchedule.find(p => p.period === "Period 7") || {};

                  return (
                    <tr key={dayName} className="hover:bg-slate-50/60">
                      <td className="py-2 px-2 border-r border-slate-300 font-black text-slate-900 bg-slate-50 text-center">
                        {dayName.slice(0, 3)}
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200 text-center">
                        <span className="font-bold text-slate-900 block leading-tight">{p1.subject}</span>
                        <span className="text-[9px] text-slate-500">{p1.teacher?.split(' ')[1] || p1.teacher}</span>
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200 text-center">
                        <span className="font-bold text-slate-900 block leading-tight">{p2.subject}</span>
                        <span className="text-[9px] text-slate-500">{p2.teacher?.split(' ')[1] || p2.teacher}</span>
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200 text-center">
                        <span className="font-bold text-slate-900 block leading-tight">{p3.subject}</span>
                        <span className="text-[9px] text-slate-500">{p3.teacher?.split(' ')[1] || p3.teacher}</span>
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200 text-center bg-amber-50/50 text-amber-900 font-bold text-[9px]">
                        Recess
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200 text-center">
                        <span className="font-bold text-slate-900 block leading-tight">{p4.subject}</span>
                        <span className="text-[9px] text-slate-500">{p4.teacher?.split(' ')[1] || p4.teacher}</span>
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200 text-center">
                        <span className="font-bold text-slate-900 block leading-tight">{p5.subject}</span>
                        <span className="text-[9px] text-slate-500">{p5.teacher?.split(' ')[1] || p5.teacher}</span>
                      </td>
                      <td className="py-1.5 px-2 border-r border-slate-200 text-center">
                        <span className="font-bold text-slate-900 block leading-tight">{p6.subject}</span>
                        <span className="text-[9px] text-slate-500">{p6.teacher?.split(' ')[1] || p6.teacher}</span>
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <span className="font-bold text-slate-900 block leading-tight">{p7.subject}</span>
                        <span className="text-[9px] text-slate-500">{p7.teacher?.split(' ')[1] || p7.teacher}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Timetable Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-5 text-center text-xs font-bold text-slate-700 border-t border-slate-300">
            <div>
              <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
              <span className="text-[10px]">Class Teacher Signature</span>
            </div>
            <div>
              <div className="h-6 border-b border-dashed border-slate-400 mb-1 flex items-center justify-center">
                <span className="text-[9px] font-mono text-slate-400">[Official School Stamp]</span>
              </div>
              <span className="text-[10px]">Institutional Seal</span>
            </div>
            <div>
              <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
              <span className="text-[10px]">Principal / Director</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ON-SCREEN INTERACTIVE DAY-BY-DAY VIEW (Preserved exactly as user loved!) */}
        {/* ========================================================================= */}
        {viewMode === 'daily' && (
          <div className="no-print mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-[#05574F] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#FDBE3E]" />
                <span>Interactive Daily Schedule (दैनिक पीरियड कार्ड्स):</span>
              </span>
              <span className="text-[11px] text-slate-400">Select any day to view periods</span>
            </div>

            {/* Days of Week Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
              {days.map((day) => {
                const isToday = day === defaultDay;
                const isActive = day === activeDay;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#05574F] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{day}</span>
                    {isToday && (
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#FDBE3E]' : 'bg-emerald-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Schedule Table / Period Cards */}
            <div className="space-y-2">
              {currentPeriods.map((item) => {
                if (item.isBreak) {
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center justify-between text-amber-950 font-bold text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-amber-600" />
                        <span>{item.subject}</span>
                      </div>
                      <span className="font-mono text-[11px] text-amber-700">{item.time}</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition flex items-center justify-between flex-wrap gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center shrink-0">
                        {item.period.replace('Period ', 'P')}
                      </div>
                      <div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.subject}
                            onChange={(e) => handlePeriodChange(item.id, 'subject', e.target.value)}
                            className="font-bold text-slate-900 border border-slate-300 rounded px-1.5 py-0.5 text-xs outline-none"
                          />
                        ) : (
                          <span className="font-bold text-slate-900 block text-xs">{item.subject}</span>
                        )}
                        <span className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{item.teacher}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">{item.room}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                        {item.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
