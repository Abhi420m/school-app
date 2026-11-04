import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Award,
  Filter,
  Search,
  Printer,
  Plus,
  CheckCircle2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { calculateGrade } from '../data/storage';

export default function ExamReports({
  students,
  classes,
  exams,
  onOpenReportCard,
  t
}) {
  const [selectedTerm, setSelectedTerm] = useState('Mid-Term Examination (अर्धवार्षिक परीक्षा)');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [searchStudent, setSearchStudent] = useState('');

  const terms = [
    'Mid-Term Examination (अर्धवार्षिक परीक्षा)',
    'Unit Test - 1',
    'Pre-Board Examination',
    'Final Annual Examination (वार्षिक परीक्षा)'
  ];

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClass === 'All' || s.className === selectedClass;
    const matchesSearch =
      !searchStudent ||
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.rollNo.toString().includes(searchStudent);

    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.navExams} (परीक्षा परिणाम व अंकतालिका)</h2>
            <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              CBSE Grading Standard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish academic marks, calculate percentage and grades automatically, and print official student report cards.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Term Select */}
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              {terms.map((term) => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
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

          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-purple-500 rounded-xl text-xs outline-none w-44"
            />
          </div>
        </div>
      </div>

      {/* Class Performance Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Exam Term</p>
          <p className="text-sm font-black text-slate-900 mt-1 truncate">{selectedTerm}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Class Average</p>
          <p className="text-xl font-black text-blue-700 mt-1">78.6%</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Class Topper</p>
          <p className="text-sm font-black text-emerald-700 mt-1">Ananya Verma (95.8%)</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Pass Rate</p>
          <p className="text-xl font-black text-purple-700 mt-1">98.2%</p>
        </div>
      </div>

      {/* Marksheet & Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-16">Roll</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4 text-center">Marks (Total 500)</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    No student exam records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  const stuExams = exams[stu.id] || [];
                  const exam = stuExams[0] || {
                    obtainedTotal: Math.floor(350 + (parseInt(stu.rollNo || '101') % 150)),
                    maxTotal: 500,
                    percentage: (parseFloat(stu.attendancePercentage || 90) * 0.95).toFixed(1),
                    overallGrade: calculateGrade(parseFloat(stu.attendancePercentage || 90)).grade,
                    rank: parseInt(stu.rollNo || '101') % 10 + 1
                  };

                  const gradeObj = calculateGrade(exam.percentage);

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        #{stu.rollNo}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
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

                      <td className="py-3 px-4 text-center font-bold text-slate-900">
                        {exam.obtainedTotal} <span className="text-slate-400 font-normal">/ {exam.maxTotal}</span>
                      </td>

                      <td className="py-3 px-4 text-center font-black text-blue-700">
                        {exam.percentage}%
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                          gradeObj.grade.startsWith('A')
                            ? 'bg-emerald-100 text-emerald-800'
                            : gradeObj.grade.startsWith('B')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {gradeObj.grade}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                        #{exam.rank || 1}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onOpenReportCard(stu, exam)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Report Card</span>
                        </button>
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
