import React, { useState } from 'react';
import {
  CalendarCheck2,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Coffee,
  Save,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AttendanceManager({
  students,
  classes,
  attendance,
  onSaveAttendance,
  todayDate,
  t
}) {
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSection, setSelectedSection] = useState('A');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Active records for selected date
  const dayRecords = attendance[selectedDate] || {};

  // Local state for interactive editing
  const [currentDayAttendance, setCurrentDayAttendance] = useState(() => {
    return { ...dayRecords };
  });

  // When selectedDate changes, sync
  React.useEffect(() => {
    setCurrentDayAttendance({ ...(attendance[selectedDate] || {}) });
  }, [selectedDate, attendance]);

  // Filter students by selected class & section
  const classStudents = students.filter(
    (s) => (selectedClass === 'All' || s.className === selectedClass) &&
           (selectedSection === 'All' || s.section === selectedSection)
  );

  // Status toggle handler
  const setStudentStatus = (studentId, status) => {
    setCurrentDayAttendance((prev) => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Bulk actions
  const markAll = (status) => {
    const updated = { ...currentDayAttendance };
    classStudents.forEach((stu) => {
      updated[stu.id] = status;
    });
    setCurrentDayAttendance(updated);
  };

  // Save changes
  const handleSave = () => {
    onSaveAttendance(selectedDate, currentDayAttendance);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Stats calculation
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;
  let leaveCount = 0;

  classStudents.forEach((stu) => {
    const status = currentDayAttendance[stu.id] || 'Present';
    if (status === 'Present') presentCount++;
    else if (status === 'Absent') absentCount++;
    else if (status === 'Late') lateCount++;
    else if (status === 'Leave') leaveCount++;
  });

  const total = classStudents.length;
  const percentage = total > 0 ? Math.round(((presentCount + lateCount) / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.navAttendance} (दैनिक हाजिरी रजिस्टर)</h2>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Live Hazri Sheet
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Mark and verify student attendance with 1-click. Records are instantly reflected on the Parent Portal for transparency.
          </p>
        </div>

        {/* Date Selector & Class Selectors */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-blue-600" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            />
          </div>

          {/* Class Select */}
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Section Select */}
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">All Sec</option>
              {['A', 'B', 'C', 'Science', 'Commerce'].map((sec) => (
                <option key={sec} value={sec}>Sec {sec}</option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Attendance for {selectedClass} on {selectedDate} saved successfully!
        </div>
      )}

      {/* Live Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase">Class Strength</p>
            <p className="text-xl font-black text-slate-900 mt-0.5">{total} Students</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-emerald-600 uppercase">Present Today</p>
            <p className="text-xl font-black text-emerald-700 mt-0.5">{presentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-red-500 uppercase">Absent</p>
            <p className="text-xl font-black text-red-600 mt-0.5">{absentCount}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-blue-600 uppercase">Hazri Rate</p>
            <p className="text-xl font-black text-blue-700 mt-0.5">{percentage}%</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            {percentage}%
          </div>
        </div>
      </div>

      {/* Bulk Fast Action Buttons */}
      <div className="bg-slate-100/80 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-slate-200">
        <span className="text-xs font-bold text-slate-600">Quick Bulk Actions:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAll('Present')}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
          <button
            onClick={() => markAll('Absent')}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Mark All Absent</span>
          </button>
        </div>
      </div>

      {/* Students Attendance List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-16">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Parent Contact</th>
                <th className="py-3 px-4 text-center">Current Status</th>
                <th className="py-3 px-4 text-right">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No students found in {selectedClass} - {selectedSection}.
                  </td>
                </tr>
              ) : (
                classStudents.map((stu) => {
                  const status = currentDayAttendance[stu.id] || 'Present';
                  
                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        #{stu.rollNo}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {stu.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{stu.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{stu.admissionNo}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {stu.className} - {stu.section}
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <a href={`tel:${stu.phone}`} className="hover:text-blue-600 font-medium">
                          {stu.phone}
                        </a>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
                          status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'Absent'
                            ? 'bg-red-100 text-red-800'
                            : status === 'Late'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
                          <button
                            onClick={() => setStudentStatus(stu.id, 'Present')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                              status === 'Present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-white'
                            }`}
                          >
                            P
                          </button>
                          <button
                            onClick={() => setStudentStatus(stu.id, 'Absent')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                              status === 'Absent'
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-red-700 hover:bg-white'
                            }`}
                          >
                            A
                          </button>
                          <button
                            onClick={() => setStudentStatus(stu.id, 'Late')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                              status === 'Late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:text-amber-700 hover:bg-white'
                            }`}
                          >
                            L
                          </button>
                          <button
                            onClick={() => setStudentStatus(stu.id, 'Leave')}
                            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                              status === 'Leave'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-blue-700 hover:bg-white'
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
