import React from 'react';
import {
  Users,
  Contact,
  CalendarCheck2,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  PhoneCall,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminDashboard({
  students,
  teachers,
  classes,
  attendance,
  notices,
  todayDate,
  setActiveTab,
  setSelectedStudentForReport,
  setCurrentRole,
  t
}) {
  // Today's attendance calculation
  const todayRecords = attendance[todayDate] || {};
  const totalStudents = students.length;
  let presentCount = 0;
  let absentCount = 0;

  students.forEach((stu) => {
    const status = todayRecords[stu.id];
    if (status === 'Present') presentCount++;
    else if (status === 'Absent') absentCount++;
    else if (status === 'Late') presentCount++; // late is attended
  });

  const attendancePercent = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  // Pending fees count
  const pendingFeesStudents = students.filter(s => s.feeStatus !== 'Paid');

  // Low attendance warning (<75%)
  const lowAttendanceStudents = students.filter(s => (s.attendancePercentage || 0) < 75);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 md:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Academic Session 2026-2027
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            School Administration & Monitoring System
          </h2>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            Real-time control center for St. Xavier's International Academy. Manage all classes (1 to 12), track daily student attendance, monitor teacher allocations, and provide parents with transparent academic updates.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('attendance')}
              className="px-4 py-2.5 rounded-xl bg-white text-blue-800 text-xs md:text-sm font-bold shadow-md hover:bg-blue-50 transition flex items-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4 text-blue-600" />
              Mark Today's Attendance ({todayDate})
            </button>
            <button
              onClick={() => {
                setCurrentRole('parent');
                setActiveTab('parent-view');
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs md:text-sm font-bold shadow-md transition flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Open Parent Portal View (अभिभावक पोर्टल)
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.totalStudents}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{totalStudents}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Enrolled
            </span>
            <span className="text-blue-600 font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 2: Teachers */}
        <div
          onClick={() => setActiveTab('teachers')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.totalTeachers}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{teachers.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <Contact className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="text-slate-500">Contact roster active</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              Call & Roster <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 3: Attendance Today */}
        <div
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.attendanceRate}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{attendancePercent}%</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="text-slate-500">
              <span className="text-emerald-600 font-bold">{presentCount} Present</span> / {absentCount} Absent
            </span>
            <span className="text-amber-600 font-semibold flex items-center gap-1">
              Check Hazri <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Total Classes */}
        <div
          onClick={() => setActiveTab('classes')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.activeClasses}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{classes.length} Classes</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100">
            <span className="text-slate-500">Class 1 to Class 12</span>
            <span className="text-purple-600 font-semibold flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Quick Actions & Class Overview & Low Attendance Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classes Quick Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Class-wise Overview (कक्षा विवरण)</h3>
              <p className="text-xs text-slate-500">Distribution of students and designated class teachers</p>
            </div>
            <button
              onClick={() => setActiveTab('classes')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All 12 Classes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {classes.slice(0, 6).map((c) => {
              const classStudents = students.filter(s => s.className === c.name);
              const teacher = teachers.find(t => t.id === c.classTeacherId);
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveTab('students')}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-blue-50/50 hover:border-blue-200 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                      {c.stream}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 space-y-1">
                    <p className="flex items-center justify-between">
                      <span>Sections:</span>
                      <span className="font-semibold text-slate-800">{c.sections.join(', ')}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Students:</span>
                      <span className="font-bold text-blue-700">{classStudents.length} Students</span>
                    </p>
                    <p className="flex items-center justify-between truncate text-[11px] text-slate-500">
                      <span>In-charge:</span>
                      <span className="font-medium text-slate-700 truncate">{teacher ? teacher.name : 'Assigned'}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notices & Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              School Notice Board
            </h3>
            <button
              onClick={() => setActiveTab('notices')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {notices.slice(0, 3).map((notice) => (
              <div key={notice.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-100 transition">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    notice.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {notice.category}
                  </span>
                  <span>{notice.date}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-800 leading-tight">{notice.title}</h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{notice.description}</p>
              </div>
            ))}
          </div>

          {/* Quick Notice CTA */}
          <button
            onClick={() => setActiveTab('notices')}
            className="w-full py-2 rounded-xl border border-dashed border-slate-300 hover:border-blue-400 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            + Post New Circular / Notice
          </button>
        </div>
      </div>

      {/* Low Attendance Alert Row */}
      {lowAttendanceStudents.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-amber-900">
                Attendance Alert: {lowAttendanceStudents.length} Students below 75% CBSE criteria
              </h4>
              <p className="text-xs text-amber-700">
                Immediate parent notification recommended: {lowAttendanceStudents.map(s => `${s.name} (${s.attendancePercentage}%)`).join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 transition"
          >
            Review Attendance & Notify
          </button>
        </div>
      )}
    </div>
  );
}
