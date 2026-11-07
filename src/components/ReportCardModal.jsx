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

  const schoolName = activeSchool?.name || t?.schoolName || "St. Xavier's International Academy";
  const schoolAffiliation = activeSchool?.affiliation || t?.schoolSubtitle || "Affiliated to CBSE, New Delhi | Affiliation No: 20491";
  const schoolAddress = activeSchool?.address || t?.schoolAddress || "Institutional Area, Main Campus";
  const schoolPhone = activeSchool?.phone || "+91 74549 96566";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs modal-overlay overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative my-auto printable-card border border-slate-200">
        
        {/* Top Modal Controls (Hidden in print) */}
        <div className="no-print flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-slate-700">Official Student Progress Card (CBSE Format)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#05574F] hover:bg-[#076c62] text-white rounded-xl text-xs font-bold shadow-sm transition"
              title="Print directly or Save as PDF"
            >
              <Printer className="w-4 h-4 text-[#FDBE3E]" />
              <span>Print / Save as PDF (प्रिंट व पीडीएफ लें)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Card Content: Fits cleanly on single A4 Sheet */}
        <div className="border-2 border-slate-700 rounded-xl p-5 bg-white relative text-slate-900">
          
          {/* School Header */}
          <div className="text-center border-b-2 border-slate-800 pb-3">
            <div className="flex items-center justify-center gap-3 mb-1">
              {activeSchool?.logoUrl ? (
                <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                  <img src={activeSchool.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#05574F] text-[#FDBE3E] flex items-center justify-center font-bold">
                  <School className="w-7 h-7" />
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
            <div className="mt-2 inline-block px-3.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-black uppercase tracking-widest">
              OFFICIAL ACADEMIC REPORT CARD • SESSION {exam.session || '2026-2027'}
            </div>
          </div>

          {/* Student Profile Grid */}
          <div className="my-3 p-3 rounded-lg bg-slate-50/90 border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-slate-500 font-medium text-[10px] block uppercase">Student Name:</span>
              <span className="font-extrabold text-slate-900 text-xs">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[10px] block uppercase">Roll Number:</span>
              <span className="font-mono font-bold text-slate-900 text-xs">#{student.rollNo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[10px] block uppercase">Admission No:</span>
              <span className="font-mono font-bold text-slate-800 text-xs">{student.admissionNo}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[10px] block uppercase">Class & Section:</span>
              <span className="font-bold text-slate-900 text-xs">{student.className} - {student.section}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[10px] block uppercase">Father's Name:</span>
              <span className="font-semibold text-slate-800 text-xs">{student.fatherName || 'Guardian'}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[10px] block uppercase">Attendance Rate:</span>
              <span className="font-bold text-emerald-800 text-xs">{student.attendancePercentage || exam.attendancePercentage}%</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[10px] block uppercase">Examination Term:</span>
              <span className="font-bold text-slate-900 text-xs">{exam.term}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[10px] block uppercase">Date of Issue:</span>
              <span className="font-semibold text-slate-800 text-xs">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium text-[10px] block uppercase">Class Rank:</span>
              <span className="font-bold text-blue-800 text-xs">Rank #{exam.rank || 1}</span>
            </div>
          </div>

          {/* Part 1: Scholastic Performance Table */}
          <div className="mb-3">
            <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-wider mb-1.5 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-700" />
              <span>Part 1: Scholastic Academic Evaluation</span>
            </h4>
            <div className="overflow-hidden rounded-lg border border-slate-300">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="py-1.5 px-3 border-r border-slate-300 w-12 text-center text-[11px]">S.No</th>
                    <th className="py-1.5 px-3 border-r border-slate-300 text-[11px]">Subject Particulars</th>
                    <th className="py-1.5 px-3 border-r border-slate-300 text-center w-24 text-[11px]">Max Marks</th>
                    <th className="py-1.5 px-3 border-r border-slate-300 text-center w-24 text-[11px]">Obtained</th>
                    <th className="py-1.5 px-3 text-center w-20 text-[11px]">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {exam.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-3 border-r border-slate-200 text-center font-bold text-slate-500 text-[11px]">{idx + 1}</td>
                      <td className="py-1.5 px-3 border-r border-slate-200 font-bold text-slate-900 text-xs">{sub.name}</td>
                      <td className="py-1.5 px-3 border-r border-slate-200 text-center font-medium text-slate-600 text-xs">{sub.maxMarks}</td>
                      <td className="py-1.5 px-3 border-r border-slate-200 text-center font-black text-slate-900 text-xs">{sub.marksObtained}</td>
                      <td className="py-1.5 px-3 text-center font-black text-blue-800 text-xs">{sub.grade}</td>
                    </tr>
                  ))}
                  {/* Grand Total Row */}
                  <tr className="bg-slate-100/90 font-black border-t-2 border-slate-300">
                    <td colSpan="2" className="py-1.5 px-3 border-r border-slate-300 text-right uppercase text-xs">
                      Grand Aggregate Total:
                    </td>
                    <td className="py-1.5 px-3 border-r border-slate-300 text-center text-xs">{exam.maxTotal}</td>
                    <td className="py-1.5 px-3 border-r border-slate-300 text-center text-blue-900 text-xs font-black">{exam.obtainedTotal}</td>
                    <td className="py-1.5 px-3 text-center text-emerald-800 text-xs font-black">{exam.overallGrade}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Summary Banner */}
          <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between text-xs mb-3 flex-wrap gap-2">
            <div>
              <span className="text-slate-500 font-medium">Percentage: </span>
              <span className="font-black text-blue-900 text-xs">{exam.percentage}%</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Overall Grade: </span>
              <span className="font-black text-emerald-800 text-xs">{gradeInfo.grade} ({gradeInfo.remark})</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Final Result: </span>
              <span className="font-black text-emerald-800 text-xs uppercase bg-emerald-100 px-2 py-0.5 rounded">PASSED / PROMOTED</span>
            </div>
          </div>

          {/* Part 2: Co-Scholastic Activities */}
          {exam.coScholastic && (
            <div className="mb-3">
              <h4 className="text-[11px] font-black uppercase text-slate-800 tracking-wider mb-1.5">
                Part 2: Co-Scholastic & Discipline Areas (CBSE Scale A to E)
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {exam.coScholastic.map((co, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 bg-slate-50 rounded border border-slate-200 text-[11px]">
                    <span className="font-medium text-slate-700">{co.activity}</span>
                    <span className="font-black text-blue-800 bg-white px-1.5 py-0.2 rounded border border-slate-200">{co.grade}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Remarks */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-5">
            <span className="font-bold text-slate-800 block text-[10px] uppercase mb-0.5">Faculty Assessment & Remarks:</span>
            <p className="italic text-slate-700 font-serif text-[11px]">"{exam.teacherRemarks}"</p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-6 text-center text-xs font-bold text-slate-700 border-t border-slate-300">
            <div>
              <div className="h-8 border-b border-dashed border-slate-400 mb-1.5"></div>
              <span className="text-[11px]">Class Teacher Signature</span>
            </div>
            <div>
              <div className="h-8 border-b border-dashed border-slate-400 mb-1.5 flex items-center justify-center">
                <span className="text-[10px] font-mono text-slate-400">[Official Stamp]</span>
              </div>
              <span className="text-[11px]">Institutional Seal</span>
            </div>
            <div>
              <div className="h-8 border-b border-dashed border-slate-400 mb-1.5"></div>
              <span className="text-[11px]">Principal / Director</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
