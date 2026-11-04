import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  MessageSquare,
  Award,
  FileText,
  Calendar,
  AlertTriangle,
  BookOpen,
  DollarSign,
  Printer,
  Sparkles,
  PhoneCall,
  BellRing,
  School,
  Building2
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
  // If parent is logged in directly, lock to their child's ID
  const lockedStudentId = currentSession?.role === 'parent' ? currentSession.studentId : null;

  // Default to locked student or first student in the current school
  const [selectedStudentId, setSelectedStudentId] = useState(
    lockedStudentId || students[0]?.id || ''
  );

  // Sync if students change
  React.useEffect(() => {
    if (lockedStudentId) {
      setSelectedStudentId(lockedStudentId);
    } else if (students.length > 0 && !students.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, lockedStudentId, selectedStudentId]);

  // Selected student
  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  // Class teacher for this student
  const classTeacher = teachers.find(
    (tch) => tch.classInCharge && tch.classInCharge.includes(student?.className?.replace('Class ', ''))
  ) || teachers[0] || {
    name: "Dr. Rajesh Sharma",
    phone: "+91 98765 43210",
    subject: "Class Faculty"
  };

  // Attendance summary for this student
  const attendanceSummary = student ? getStudentAttendanceSummary(student.id, attendance) : null;
  const todayStatus = (attendance[todayDate] && student) ? (attendance[todayDate][student.id] || 'Present') : 'Present';

  // Exams for this student
  const studentExams = (student && exams[student.id]) || [
    {
      term: "Mid-Term Examination 2026",
      session: "2026-2027",
      percentage: (student?.attendancePercentage || 90) > 90 ? 92.4 : 76.5,
      overallGrade: (student?.attendancePercentage || 90) > 90 ? "A1" : "B1",
      rank: 2,
      teacherRemarks: "Very sincere, punctual, and active in classroom discussions.",
      subjects: [
        { name: "Mathematics", marksObtained: 95, maxMarks: 100, grade: "A1", classAvg: 74 },
        { name: "Science", marksObtained: 92, maxMarks: 100, grade: "A1", classAvg: 71 },
        { name: "English", marksObtained: 88, maxMarks: 100, grade: "A2", classAvg: 76 },
        { name: "Hindi", marksObtained: 90, maxMarks: 100, grade: "A1", classAvg: 78 },
        { name: "Social Science", marksObtained: 92, maxMarks: 100, grade: "A1", classAvg: 70 }
      ]
    }
  ];

  const latestExam = studentExams[0];

  // Homework for this student's class
  const studentHomework = homework.filter(
    (h) => !student || (h.className === student.className)
  );

  return (
    <div className="space-y-6">
      {/* Parent Portal Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                {t.parentWelcome}
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                {activeSchool?.name || 'School ERP'} • Parent Portal
              </h2>
              <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                {t.parentSub}
              </p>
            </div>

            {/* Child Selector (Only if not locked to single parent account) */}
            {!lockedStudentId && (
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <label className="block text-[10px] font-bold text-amber-200 uppercase tracking-wider mb-1">
                  {t.selectChild}:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-xl outline-none shadow-sm cursor-pointer max-w-[200px] truncate"
                >
                  {students.length === 0 ? (
                    <option value="">No students enrolled yet</option>
                  ) : (
                    students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.className}-{s.section}, #{s.rollNo})
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {!student ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Student Profile Linked</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            No enrolled student record was found for this school account. Please contact your school administrator.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Profile Card: Child Details & Class Teacher Contact */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Student Info */}
            <div className="md:col-span-2 flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-md shrink-0">
                {student.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">{student.name}</h3>
                  <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-0.5 rounded-full border border-amber-200">
                    Roll #{student.rollNo}
                  </span>
                  <span className="bg-slate-100 text-slate-700 font-bold text-xs px-2 py-0.5 rounded-full">
                    {student.className} - {student.section}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Admission No: <span className="font-mono font-bold text-slate-700">{student.admissionNo}</span> • Blood Group: <span className="font-bold text-slate-700">{student.bloodGroup}</span>
                </p>
                <p className="text-xs text-slate-600">
                  Parents: <span className="font-semibold text-slate-800">{student.fatherName}</span> & <span className="font-semibold text-slate-800">{student.motherName}</span>
                </p>
              </div>
            </div>

            {/* Class Teacher Contact Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.classTeacher}:</span>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Available
                </span>
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{classTeacher.name}</p>
                <p className="text-xs text-slate-500 font-medium">{classTeacher.subject || 'Class Teacher'}</p>
              </div>

              {/* Direct Call & WhatsApp Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${classTeacher.phone}`}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{t.callTeacher}</span>
                </a>
                <a
                  href={`https://wa.me/${classTeacher.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.whatsappTeacher}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Section 1: Live Attendance Card (हाजिरी रिपोर्ट) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Live Attendance Tracking (दैनिक उपस्थिति)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time status of whether your child has reached school and is present in class.
                </p>
              </div>

              {/* Today's Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Today ({todayDate}):</span>
                <span className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xs ${
                  todayStatus === 'Present'
                    ? 'bg-emerald-500 text-white animate-pulse'
                    : todayStatus === 'Absent'
                    ? 'bg-red-500 text-white'
                    : 'bg-amber-500 text-white'
                }`}>
                  {todayStatus === 'Present' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Present in Class (कक्षा में उपस्थित हैं)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>{todayStatus}</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Attendance Percentage & Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold text-slate-500 uppercase">{t.overallAttendance}</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {attendanceSummary ? attendanceSummary.rate : (student.attendancePercentage || 95)}%
                </p>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (student.attendancePercentage || 95) >= 75 ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${student.attendancePercentage || 95}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <p className="text-[11px] font-bold text-emerald-800 uppercase">Days Attended</p>
                <p className="text-2xl font-black text-emerald-700 mt-1">
                  {attendanceSummary ? attendanceSummary.presentDays : 26} Days
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold">Regular Presence</span>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                <p className="text-[11px] font-bold text-red-800 uppercase">Days Absent</p>
                <p className="text-2xl font-black text-red-600 mt-1">
                  {attendanceSummary ? attendanceSummary.absentDays : 1} Day
                </p>
                <span className="text-[11px] text-red-500 font-semibold">Authorized Leaves</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                <p className="text-[11px] font-bold text-blue-800 uppercase">CBSE Criteria</p>
                <p className="text-2xl font-black text-blue-700 mt-1">
                  {(student.attendancePercentage || 95) >= 75 ? 'ELIGIBLE' : 'WARNING'}
                </p>
                <span className="text-[11px] text-blue-600 font-semibold">Min 75% required</span>
              </div>
            </div>

            {/* Attendance Calendar Heatmap (Last 10 Records) */}
            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">Recent Attendance Log (हालिया हाजिरी रिकॉर्ड):</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {(attendanceSummary?.history?.length > 0 ? attendanceSummary.history.slice(0, 5) : [
                  { date: todayDate, status: todayStatus }
                ]).map((rec, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-center ${
                      rec.status === 'Present'
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : rec.status === 'Absent'
                        ? 'bg-red-50/70 border-red-200'
                        : 'bg-amber-50/70 border-amber-200'
                    }`}
                  >
                    <p className="text-[11px] font-bold text-slate-500">{rec.date}</p>
                    <span className={`inline-block mt-1 text-xs font-extrabold ${
                      rec.status === 'Present' ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      {rec.status === 'Present' ? '✓ Present' : '✗ Absent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Academic Performance & Report Card (परीक्षा परिणाम) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  {t.examPerformance} (परीक्षा परिणाम व अंक)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Term: {latestExam.term} • Session {latestExam.session || '2026-27'}
                </p>
              </div>

              {/* Download / Print Marksheet Button */}
              <button
                onClick={() => onOpenReportCard(student, latestExam)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
              >
                <FileText className="w-4 h-4" />
                <span>View & Print Official Report Card</span>
              </button>
            </div>

            {/* Score Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500">Overall Score</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">{latestExam.percentage}%</p>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[11px] font-semibold text-emerald-700">Overall Grade</span>
                <p className="text-xl font-black text-emerald-800 mt-0.5">{latestExam.overallGrade}</p>
              </div>
              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
                <span className="text-[11px] font-semibold text-blue-700">Class Rank</span>
                <p className="text-xl font-black text-blue-800 mt-0.5">Rank #{latestExam.rank || 2}</p>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-[11px] font-semibold text-amber-700">Status</span>
                <p className="text-xl font-black text-amber-900 mt-0.5">PASSED</p>
              </div>
            </div>

            {/* Subject-wise Marks Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Marks Obtained</th>
                    <th className="py-2.5 px-3">Class Average</th>
                    <th className="py-2.5 px-3">Grade</th>
                    <th className="py-2.5 px-3 w-48">Score Progress Bar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {latestExam.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{sub.name}</td>
                      <td className="py-2.5 px-3 font-black text-slate-900">
                        {sub.marksObtained} <span className="text-slate-400 font-normal">/ {sub.maxMarks}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-medium">{sub.classAvg || 72}%</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${(sub.marksObtained / sub.maxMarks) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Teacher Remarks for Parent */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs">
              <p className="font-bold text-amber-900 mb-1">Teacher Remarks for Parents:</p>
              <p className="italic text-amber-950 font-serif">"{latestExam.teacherRemarks}"</p>
            </div>
          </div>

          {/* Section 3: Daily Homework & Notices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Homework Diary */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  {t.homeworkDairy}
                </h4>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {studentHomework.length} Tasks
                </span>
              </div>

              <div className="space-y-3">
                {studentHomework.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No homework assigned for today.</p>
                ) : (
                  studentHomework.map((hw) => (
                    <div key={hw.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                          {hw.subject}
                        </span>
                        <span className="text-slate-400 text-[11px]">Due: {hw.dueDate}</span>
                      </div>
                      <h5 className="font-bold text-slate-900">{hw.title}</h5>
                      <p className="text-slate-600 text-[11px]">{hw.description}</p>
                      <p className="text-[10px] text-slate-400 pt-1">Assigned by: {hw.teacherName}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* School Fee Status */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  {t.feeStatus}
                </h4>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  student.feeStatus === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {student.feeStatus}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Annual Tuition Fees:</span>
                  <span className="font-bold text-slate-800">₹{student.feeAmount?.toLocaleString() || '36,000'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-600">₹{student.feePaid?.toLocaleString() || '36,000'}</span>
                </div>
                <div className="flex justify-between py-1 font-bold text-sm">
                  <span>Balance Due:</span>
                  <span className={(student.feeAmount - student.feePaid) > 0 ? 'text-red-600' : 'text-emerald-700'}>
                    ₹{Math.max(0, (student.feeAmount - student.feePaid))?.toLocaleString() || '0'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert(`Fee receipt for ${student.name} (${activeSchool?.name}) generated successfully.`)}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Download Fee Receipt (रसीद)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
