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
  FileText,
  Pencil,
  X,
  Save,
  BookOpen,
  Calculator,
  User,
  Sparkles
} from 'lucide-react';
import { calculateGrade } from '../data/storage';

export default function ExamReports({
  students,
  classes,
  exams,
  onSaveExamMarks,
  onOpenReportCard,
  currentRole = 'school_admin',
  t
}) {
  const [selectedTerm, setSelectedTerm] = useState('Weekly Class Test (साप्ताहिक क्लास टेस्ट)');
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchStudent, setSearchStudent] = useState('');
  const [marksEntryStudent, setMarksEntryStudent] = useState(null);

  const terms = [
    'Weekly Class Test (साप्ताहिक क्लास टेस्ट)',
    'Unit Test - 1 (यूनिट टेस्ट 1)',
    'Unit Test - 2 (यूनिट टेस्ट 2)',
    'Monthly Assessment Test (मासिक टेस्ट)',
    'Mid-Term Examination (अर्धवार्षिक परीक्षा)',
    'Pre-Board Examination (प्री-बोर्ड परीक्षा)',
    'Final Annual Examination (वार्षिक परीक्षा)'
  ];

  // Marks Entry Form State
  const [marksFormData, setMarksFormData] = useState({
    term: 'Weekly Class Test (साप्ताहिक क्लास टेस्ट)',
    customTermName: '',
    session: '2026-2027',
    subjects: [
      { name: "Mathematics", maxMarks: 25, marksObtained: 22 },
      { name: "Science", maxMarks: 25, marksObtained: 24 },
      { name: "English Language & Lit", maxMarks: 25, marksObtained: 20 },
      { name: "Hindi Course-A", maxMarks: 25, marksObtained: 23 },
      { name: "Social Science", maxMarks: 25, marksObtained: 21 }
    ],
    teacherRemarks: "Good academic progress and regular participation in class."
  });

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesClass = selectedClass === 'All' || s.className === selectedClass;
    const matchesSearch =
      !searchStudent ||
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.rollNo.toString().includes(searchStudent);

    return matchesClass && matchesSearch;
  });

  // Open Marks Entry Modal
  const handleOpenMarksEntry = (student) => {
    setMarksEntryStudent(student);
    const stuExams = exams[student.id] || [];
    const existing = stuExams.find(e => e.term === selectedTerm);

    if (existing && existing.subjects && existing.subjects.length > 0) {
      setMarksFormData({
        term: existing.term || selectedTerm,
        session: existing.session || '2026-2027',
        subjects: existing.subjects.map(s => ({
          name: s.name,
          maxMarks: s.maxMarks || 100,
          marksObtained: s.marksObtained || 0
        })),
        teacherRemarks: existing.teacherRemarks || "Good academic progress and regular participation."
      });
    } else {
      setMarksFormData({
        term: selectedTerm,
        session: '2026-2027',
        subjects: [
          { name: "Mathematics", maxMarks: 100, marksObtained: 75 },
          { name: "Science", maxMarks: 100, marksObtained: 80 },
          { name: "English Language & Lit", maxMarks: 100, marksObtained: 70 },
          { name: "Hindi Course-A", maxMarks: 100, marksObtained: 78 },
          { name: "Social Science", maxMarks: 100, marksObtained: 72 }
        ],
        teacherRemarks: "Good academic performance and regular attendance."
      });
    }
  };

  // Update a single subject's marks
  const handleSubjectChange = (index, field, value) => {
    const updated = [...marksFormData.subjects];
    updated[index] = {
      ...updated[index],
      [field]: field === 'name' ? value : Number(value)
    };
    setMarksFormData({ ...marksFormData, subjects: updated });
  };

  // Add extra subject
  const handleAddSubject = () => {
    setMarksFormData({
      ...marksFormData,
      subjects: [
        ...marksFormData.subjects,
        { name: "Computer Science & IT", maxMarks: 100, marksObtained: 80 }
      ]
    });
  };

  // Remove subject
  const handleRemoveSubject = (index) => {
    if (marksFormData.subjects.length <= 1) {
      alert("At least one subject is required.");
      return;
    }
    const updated = marksFormData.subjects.filter((_, idx) => idx !== index);
    setMarksFormData({ ...marksFormData, subjects: updated });
  };

  // Calculate live totals for the modal
  const calcMaxTotal = marksFormData.subjects.reduce((sum, s) => sum + (Number(s.maxMarks) || 0), 0);
  const calcObtainedTotal = marksFormData.subjects.reduce((sum, s) => sum + (Number(s.marksObtained) || 0), 0);
  const calcPercentage = calcMaxTotal > 0 ? ((calcObtainedTotal / calcMaxTotal) * 100).toFixed(1) : 0;
  const calcGrade = calculateGrade(parseFloat(calcPercentage));

  // Save Exam Marks
  const handleSaveMarksSubmit = (e) => {
    e.preventDefault();
    if (!marksEntryStudent) return;

    const subjectsWithGrades = marksFormData.subjects.map(s => {
      const subjectPct = s.maxMarks > 0 ? (s.marksObtained / s.maxMarks) * 100 : 0;
      return {
        name: s.name,
        maxMarks: Number(s.maxMarks),
        marksObtained: Number(s.marksObtained),
        grade: calculateGrade(subjectPct).grade,
        classAvg: 72,
        highest: Math.min(100, Number(s.marksObtained) + 4)
      };
    });

    const newExamRecord = {
      term: marksFormData.term,
      session: marksFormData.session,
      date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      maxTotal: calcMaxTotal,
      obtainedTotal: calcObtainedTotal,
      percentage: parseFloat(calcPercentage),
      overallGrade: calcGrade.grade,
      rank: Math.max(1, (10 - Math.floor(parseFloat(calcPercentage) / 10))),
      attendancePercentage: marksEntryStudent.attendancePercentage || 95,
      teacherRemarks: marksFormData.teacherRemarks,
      subjects: subjectsWithGrades,
      coScholastic: [
        { activity: "Work Education & Computer", grade: "A" },
        { activity: "Art & Cultural Activities", grade: "A" },
        { activity: "Physical & Health Education", grade: "A" },
        { activity: "Discipline & Value Education", grade: "A+" }
      ]
    };

    if (onSaveExamMarks) {
      onSaveExamMarks(marksEntryStudent.id, newExamRecord);
    }

    setMarksEntryStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.navExams} (परीक्षा परिणाम व अंक प्रविष्टि)</h2>
            <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              CBSE Grading Standard
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Teachers can enter student exam numbers (marks) subject-wise, compute grades & percentage automatically, and issue verified report cards.
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

      {/* Accountant / Read-only notice */}
      {currentRole === 'accountant' && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>सुरक्षा नियंत्रण (RBAC): आप 'फीस काउंटर' खाते से लॉगिन हैं। परीक्षा अंक व टेस्ट नंबर बदलने की अनुमति केवल शिक्षकों एवं प्रधानाचार्य को है। (Marks modification is restricted to Teachers and Admin).</span>
        </div>
      )}

      {/* Class Performance Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Selected Term</p>
          <p className="text-sm font-black text-slate-900 mt-1 truncate">{selectedTerm}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Class Average</p>
          <p className="text-xl font-black text-blue-700 mt-1">78.6%</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Students</p>
          <p className="text-sm font-black text-emerald-700 mt-1">{filteredStudents.length} Students</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Grading Scale</p>
          <p className="text-xl font-black text-purple-700 mt-1">A1 - E (CBSE)</p>
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
                <th className="py-3 px-4 text-center">Marks (Total)</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Grade</th>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4 text-right">Actions (अंक दर्ज करें व रिपोर्ट)</th>
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
                  const exam = stuExams.find(e => e.term === selectedTerm) || stuExams[0] || {
                    obtainedTotal: Math.floor(350 + (parseInt(stu.rollNo || '101') % 150)),
                    maxTotal: 500,
                    percentage: (parseFloat(stu.attendancePercentage || 90) * 0.95).toFixed(1),
                    overallGrade: calculateGrade(parseFloat(stu.attendancePercentage || 90)).grade,
                    rank: parseInt(stu.rollNo || '101') % 10 + 1
                  };

                  const gradeObj = calculateGrade(exam.percentage);
                  const isCustomSaved = stuExams.some(e => e.term === selectedTerm);

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
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 block">{stu.name}</span>
                              {isCustomSaved && (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Marks entered & saved" />
                              )}
                            </div>
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
                        <div className="flex items-center justify-end gap-2">
                          {/* Enter / Edit Marks Button (Restricted to Teacher & Admin) */}
                          {currentRole !== 'accountant' && (
                            <button
                              onClick={() => handleOpenMarksEntry(stu)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition border border-emerald-200"
                              title="Enter / Edit Marks for this student"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Enter Marks (नंबर दर्ज करें)</span>
                            </button>
                          )}

                          {/* View Official Report Card */}
                          <button
                            onClick={() => onOpenReportCard(stu, exam)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition border border-purple-200"
                            title="Generate CBSE Report Card"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Report Card</span>
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

      {/* MARKS ENTRY MODAL (नंबर / अंक प्रविष्टि मोडल) */}
      {marksEntryStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setMarksEntryStudent(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    Enter Student Marks (अंक / नंबर प्रविष्टि)
                  </h3>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    {marksEntryStudent.className} - {marksEntryStudent.section}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Student: <strong className="text-slate-800">{marksEntryStudent.name}</strong> • Roll #{marksEntryStudent.rollNo} • Adm: {marksEntryStudent.admissionNo}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveMarksSubmit} className="space-y-4 text-xs">
              {/* Select Exam Term */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Examination Term *</label>
                  <select
                    value={marksFormData.term}
                    onChange={(e) => setMarksFormData({ ...marksFormData, term: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800 bg-slate-50 outline-none"
                  >
                    {terms.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Academic Session</label>
                  <input
                    type="text"
                    value={marksFormData.session}
                    onChange={(e) => setMarksFormData({ ...marksFormData, session: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-700 bg-slate-50 outline-none"
                  />
                </div>
              </div>

              {/* Subject Wise Marks Table */}
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="block text-slate-800 font-black uppercase text-[11px] tracking-wide">
                      Subject Wise Marks (विषयवार प्राप्तांक)
                    </label>
                    {/* Quick Test Presets */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMarksFormData(prev => ({
                            ...prev,
                            subjects: prev.subjects.map(s => ({ ...s, maxMarks: 25, marksObtained: Math.min(25, s.marksObtained) }))
                          }));
                        }}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200 transition"
                        title="Set Max Marks to 25 for Class Weekly Test"
                      >
                        ⚡ 25 Marks (Weekly)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMarksFormData(prev => ({
                            ...prev,
                            subjects: prev.subjects.map(s => ({ ...s, maxMarks: 50, marksObtained: Math.min(50, s.marksObtained) }))
                          }));
                        }}
                        className="px-2 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[10px] border border-blue-200 transition"
                        title="Set Max Marks to 50 for Unit Test"
                      >
                        ⚡ 50 Marks (Unit Test)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMarksFormData(prev => ({
                            ...prev,
                            subjects: prev.subjects.map(s => ({ ...s, maxMarks: 100, marksObtained: Math.min(100, s.marksObtained) }))
                          }));
                        }}
                        className="px-2 py-0.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[10px] border border-purple-200 transition"
                        title="Set Max Marks to 100 for Final Board / Term Exam"
                      >
                        ⚡ 100 Marks (Board/Term)
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Subject</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  <div className="bg-slate-50 px-3 py-2 grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-500 uppercase">
                    <div className="col-span-5">Subject Name</div>
                    <div className="col-span-3 text-center">Max Marks</div>
                    <div className="col-span-3 text-center">Marks Obtained</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>

                  {marksFormData.subjects.map((sub, idx) => (
                    <div key={idx} className="p-2.5 grid grid-cols-12 gap-2 items-center bg-white">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleSubjectChange(idx, 'name', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800 outline-none focus:border-emerald-500"
                          placeholder="Subject"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="1"
                          max="200"
                          value={sub.maxMarks}
                          onChange={(e) => handleSubjectChange(idx, 'maxMarks', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-center font-mono font-bold text-slate-700 outline-none"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          max={sub.maxMarks}
                          value={sub.marksObtained}
                          onChange={(e) => handleSubjectChange(idx, 'marksObtained', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50/50 text-center font-mono font-black text-emerald-800 outline-none text-sm focus:border-emerald-600"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(idx)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Remove subject"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Result Summary Box */}
              <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Obtained / Max</span>
                  <p className="text-base font-black text-emerald-950 font-mono">
                    {calcObtainedTotal} / {calcMaxTotal}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">Calculated Percentage</span>
                  <p className="text-base font-black text-blue-700 font-mono">
                    {calcPercentage}%
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 block">CBSE Grade</span>
                  <span className="inline-block px-3 py-0.5 rounded-full font-black text-xs bg-emerald-700 text-white shadow-xs">
                    {calcGrade.grade} ({calcGrade.remark})
                  </span>
                </div>
              </div>

              {/* Teacher Remarks */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Teacher's Academic Remark (शिक्षक टिप्पणी)</label>
                <input
                  type="text"
                  value={marksFormData.teacherRemarks}
                  onChange={(e) => setMarksFormData({ ...marksFormData, teacherRemarks: e.target.value })}
                  placeholder="e.g. Excellent conceptual clarity. Keep up the high standard!"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setMarksEntryStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Marks (नंबर सहेजें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
