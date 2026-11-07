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
  School
} from 'lucide-react';

export default function TimetableModal({
  className = "Class 10",
  section = "A",
  teachers = [],
  isEditable = false,
  onClose
}) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday
  const defaultDay = todayDayIndex >= 1 && todayDayIndex <= 6 ? days[todayDayIndex - 1] : 'Monday';

  const [activeDay, setActiveDay] = useState(defaultDay);
  const [isEditing, setIsEditing] = useState(false);

  // Default smart periods schedule
  const [scheduleData, setScheduleData] = useState({
    Monday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "English Language & Lit", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "Science (Physics / Chem)", teacher: "Mrs. Sunita Rao", room: "Science Lab" },
      { id: 4, isBreak: true, period: "Break", time: "10:45 - 11:15 AM", subject: "Recess / Tiffin Break", teacher: "Staff Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "Social Science", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Hindi Sahitya", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Computer Science & AI", teacher: "Dr. Anand Verma", room: "IT Lab 2" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "Sports & Physical Ed", teacher: "Mr. Vikram Singh", room: "Playground" }
    ],
    Tuesday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Science (Biology)", teacher: "Mrs. Sunita Rao", room: "Bio Lab" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "Hindi Course-A", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 4, isBreak: true, period: "Break", time: "10:45 - 11:15 AM", subject: "Recess / Tiffin Break", teacher: "Staff Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "English Grammar", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Social Science (Civics)", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Library & Reading", teacher: "Mrs. Neelam Kapoor", room: "Library" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "Art & Music", teacher: "Mr. Ashish Kumar", room: "Music Room" }
    ],
    Wednesday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Science (Chemistry)", teacher: "Mrs. Sunita Rao", room: "Chem Lab" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "Social Science (History)", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 4, isBreak: true, period: "Break", time: "10:45 - 11:15 AM", subject: "Recess / Tiffin Break", teacher: "Staff Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "English Literature", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Hindi Vyakaran", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Mathematics Problem Lab", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "General Knowledge & Ethics", teacher: "Mrs. Neelam Kapoor", room: "Room 101" }
    ],
    Thursday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "English Language", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "Science (Physics)", teacher: "Mrs. Sunita Rao", room: "Room 101" },
      { id: 4, isBreak: true, period: "Break", time: "10:45 - 11:15 AM", subject: "Recess / Tiffin Break", teacher: "Staff Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "Social Science (Geography)", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Hindi Sahitya", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Computer Coding", teacher: "Dr. Anand Verma", room: "IT Lab" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "Yoga & Meditation", teacher: "Mr. Vikram Singh", room: "Yoga Hall" }
    ],
    Friday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Mathematics", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Science Practical", teacher: "Mrs. Sunita Rao", room: "Physics Lab" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "English Creative Writing", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 4, isBreak: true, period: "Break", time: "10:45 - 11:15 AM", subject: "Recess / Tiffin Break", teacher: "Staff Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "Social Science", teacher: "Mr. Sanjay Mishra", room: "Room 101" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Hindi", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Debate & Public Speaking", teacher: "Mrs. Priya Joshi", room: "Auditorium" },
      { id: 8, period: "Period 7", time: "01:30 - 02:15 PM", subject: "Sports Club", teacher: "Mr. Vikram Singh", room: "Playground" }
    ],
    Saturday: [
      { id: 1, period: "Period 1", time: "08:30 - 09:15 AM", subject: "Mathematics Weekly Test", teacher: "Dr. Rajesh Sharma", room: "Room 101" },
      { id: 2, period: "Period 2", time: "09:15 - 10:00 AM", subject: "Science Quiz", teacher: "Mrs. Sunita Rao", room: "Room 101" },
      { id: 3, period: "Period 3", time: "10:00 - 10:45 AM", subject: "English Spoken & Drama", teacher: "Mrs. Priya Joshi", room: "Room 101" },
      { id: 4, isBreak: true, period: "Break", time: "10:45 - 11:15 AM", subject: "Recess / Tiffin Break", teacher: "Staff Duty", room: "Cafeteria" },
      { id: 5, period: "Period 4", time: "11:15 - 12:00 PM", subject: "Club Activities / Scouts", teacher: "Mr. Sanjay Mishra", room: "Activity Hall" },
      { id: 6, period: "Period 5", time: "12:00 - 12:45 PM", subject: "Values & Life Skills", teacher: "Pt. Rameshwar Dayal", room: "Room 101" },
      { id: 7, period: "Period 6", time: "12:45 - 01:30 PM", subject: "Sports Matches", teacher: "Mr. Vikram Singh", room: "Ground" }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#05574F] text-[#FDBE3E] flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                  Class Time Table (समय सारणी)
                </h3>
                <span className="text-xs font-black bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                  {className} {section ? `- Sec ${section}` : ''}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Standard Weekly Academic Schedule (Monday to Saturday)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            {isEditable && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isEditing
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isEditing ? <Save className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                <span>{isEditing ? 'Done Editing' : 'Edit Timetable'}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Days of Week Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 no-print">
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
        <div className="space-y-2.5">
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
                  <span className="text-[11px] font-mono text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                    {item.time}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition flex items-center justify-between flex-wrap gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-16 font-extrabold text-[#05574F] bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg text-center text-[11px]">
                    {item.period}
                  </span>

                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.subject}
                        onChange={(e) => handlePeriodChange(item.id, 'subject', e.target.value)}
                        className="font-bold text-slate-900 border-b border-blue-400 outline-none text-xs w-48"
                      />
                    ) : (
                      <h4 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600 inline" />
                        {item.subject}
                      </h4>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.teacher}
                          onChange={(e) => handlePeriodChange(item.id, 'teacher', e.target.value)}
                          placeholder="Teacher name"
                          className="border-b border-slate-300 outline-none text-[11px] w-36"
                        />
                      ) : (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          {item.teacher}
                        </span>
                      )}
                      <span>•</span>
                      <span className="text-slate-400 font-mono">{item.room}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg text-[11px] block">
                    {item.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 no-print">
          <span>Official Timetable • VidyaSetu ERP</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 8 Daily Periods Included
          </span>
        </div>
      </div>
    </div>
  );
}
