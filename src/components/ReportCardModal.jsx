import React from 'react';
import {
  School,
  X,
  Printer,
  Award,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import { calculateGrade } from '../data/storage';

export default function ReportCardModal({
  student,
  examData,
  activeSchool,
  onClose,
  t
}) {
  if (!student) return null;

  // Use student's exam report or generate standard default
  const exam = examData || {
    term: "Mid-Term Examination (अर्धवार्षिक परीक्षा)",
    session: "2026-2027",
    date: "October 2026",
    maxTotal: 500,
    obtainedTotal: 462,
    percentage: 92.4,
    overallGrade: "A1",
    rank: 2,
    attendancePercentage: student.attendancePercentage || 94.5,
    teacherRemarks: "Exemplary academic performance and disciplined conduct. Actively participates in class discussions.",
    subjects: [
      { name: "Mathematics", maxMarks: 100, marksObtained: 95, grade: "A1" },
      { name: "Science", maxMarks: 100, marksObtained: 92, grade: "A1" },
      { name: "English Language & Lit", maxMarks: 100, marksObtained: 88, grade: "A2" },
      { name: "Hindi Course-A", maxMarks: 100, marksObtained: 90, grade: "A1" },
      { name: "Social Science", maxMarks: 100, marksObtained: 92, grade: "A1" }
    ],
    coScholastic: [
      { activity: "Work Education & Computer Applications", grade: "A" },
      { activity: "Visual & Performing Arts", grade: "A" },
      { activity: "Health & Physical Education (Sports)", grade: "A+" },
      { activity: "Discipline, Values & Regularity", grade: "A+" }
    ]
  };

  const gradeInfo = calculateGrade(exam.percentage);

  const schoolName = activeSchool?.name || t.schoolName;
  const schoolAffiliation = activeSchool?.affiliation || t.schoolSubtitle;
  const schoolAddress = activeSchool?.address || t.schoolAddress;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs modal-backdrop overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-auto printable-area border border-slate-200">
        {/* Top Modal Controls (Hidden in print) */}
        <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-700">Official Student Progress Card</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              <Printer className="w-4 h-4" />
              <span>{t.print}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Card Content */}
        <div className="border-4 border-slate-900 rounded-2xl p-6 relative bg-white">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-4">
            <School className="w-96 h-96 text-slate-900" />
          </div>

          {/* School Header */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-900 text-white flex items-center justify-center shadow-md mb-2">
              <School className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
              {schoolName}
            </h1>
            <p className="text-xs font-semibold uppercase text-slate-600 tracking-wider">
              {schoolAffiliation}
            </p>
            <p className="text-[11px] text-slate-500">{schoolAddress}</p>
            <div className="mt-2 inline-block px-4 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest">
              ACADEMIC REPORT CARD • SESSION {exam.session || '2026-2027'}
            </div>
          </div>

          {/* Student Profile Grid */}
          <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Student Name:</span>
              <span className="font-extrabold text-slate-900 text-sm">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Roll Number:</span>
              <span className="font-mono font-bold text-slate-900 text-sm">#{student.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Admission No:</span>
              <span className="font-mono font-bold text-slate-800">{student.admissionNo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Class & Section:</span>
              <span className="font-bold text-slate-900">{student.className} - {student.section}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Father's Name:</span>
              <span className="font-semibold text-slate-800">{student.fatherName || 'Guardian'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Mother's Name:</span>
              <span className="font-semibold text-slate-800">{student.motherName || 'Guardian'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Attendance Rate:</span>
              <span className="font-bold text-emerald-700">{student.attendancePercentage || exam.attendancePercentage}%</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Examination Term:</span>
              <span className="font-semibold text-slate-800">{exam.term}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[11px] block">Date of Birth:</span>
              <span className="font-semibold text-slate-800">{student.dob || '2010-04-15'}</span>
            </div>
          </div>

          {/* Part 1: Scholastic Performance Table */}
          <div className="mb-5">
            <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-700" />
              Part 1: Scholastic Performance
            </h4>
            <table className="w-full text-left border-collapse text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-200/80 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-12 text-center">Sr.</th>
                  <th className="p-2 border-r border-slate-300">Subject Name</th>
                  <th className="p-2 border-r border-slate-300 text-center w-24">Max Marks</th>
                  <th className="p-2 border-r border-slate-300 text-center w-24">Obtained</th>
                  <th className="p-2 text-center w-20">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {exam.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-2 border-r border-slate-200 font-bold text-slate-900">{sub.name}</td>
                    <td className="p-2 border-r border-slate-200 text-center font-medium text-slate-600">{sub.maxMarks}</td>
                    <td className="p-2 border-r border-slate-200 text-center font-black text-slate-900">{sub.marksObtained}</td>
                    <td className="p-2 text-center font-bold text-blue-800">{sub.grade}</td>
                  </tr>
                ))}
                {/* Grand Total Row */}
                <tr className="bg-slate-100 font-black border-t-2 border-slate-300">
                  <td colSpan="2" className="p-2 border-r border-slate-300 text-right uppercase">Grand Total:</td>
                  <td className="p-2 border-r border-slate-300 text-center">{exam.maxTotal}</td>
                  <td className="p-2 border-r border-slate-300 text-center text-blue-900 text-sm">{exam.obtainedTotal}</td>
                  <td className="p-2 text-center text-emerald-700 text-sm">{exam.overallGrade}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Performance Summary Banner */}
          <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center justify-between text-xs mb-5">
            <div>
              <span className="text-slate-500 font-medium">Percentage: </span>
              <span className="font-black text-blue-900 text-sm">{exam.percentage}%</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Overall Grade: </span>
              <span className="font-black text-emerald-800 text-sm">{gradeInfo.grade} ({gradeInfo.remark})</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Class Rank: </span>
              <span className="font-black text-slate-900 text-sm">Rank #{exam.rank || 1}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Result: </span>
              <span className="font-black text-emerald-700 text-sm uppercase">QUALIFIED / PASSED</span>
            </div>
          </div>

          {/* Part 2: Co-Scholastic Activities */}
          {exam.coScholastic && (
            <div className="mb-5">
              <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider mb-2">
                Part 2: Co-Scholastic & Discipline Areas (Graded A to E)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {exam.coScholastic.map((co, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="font-medium text-slate-700">{co.activity}</span>
                    <span className="font-black text-blue-800 bg-white px-2 py-0.5 rounded border border-slate-200">{co.grade}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Remarks */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-8">
            <span className="font-bold text-slate-800 block mb-1">Class Teacher's Remarks:</span>
            <p className="italic text-slate-700 font-serif">"{exam.teacherRemarks}"</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs font-bold text-slate-700 border-t border-slate-300">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-2"></div>
              <span>Class Teacher</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-2 flex items-center justify-center">
                <span className="text-[10px] font-mono text-slate-400">[Affixed Seal]</span>
              </div>
              <span>School Stamp / Seal</span>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 mb-2"></div>
              <span>Principal ({activeSchool?.principal || 'Principal'})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
