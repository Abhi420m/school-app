import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Phone,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  MapPin,
  Calendar,
  Heart,
  Pencil,
  Trash2,
  Layers,
  Table as TableIcon,
  Printer,
  Wallet,
  Smartphone,
  Share2
} from 'lucide-react';
import { sanitizeInput } from '../data/storage';
import FeeReceiptModal from './FeeReceiptModal';

export default function StudentDirectory({
  students,
  classes,
  activeSchool,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onViewStudentReport,
  onOpenShareParentApp,
  classFilter,
  setClassFilter,
  searchTerm,
  setSearchTerm,
  currentRole = 'school_admin',
  t
}) {
  const [sectionFilter, setSectionFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'section'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
  const [feeCollectStudent, setFeeCollectStudent] = useState(null);
  const [receiptStudent, setReceiptStudent] = useState(null);
  const [receiptDetails, setReceiptDetails] = useState(null);

  // Quick Direct Receipt Handler for already paid fees
  const handleOpenDirectReceipt = (student) => {
    setReceiptStudent(student);
    setReceiptDetails({
      amount: student.feePaid || 30000,
      mode: 'Cash / Bank Transfer',
      receiptNo: `REC-2026-${student.rollNo || '001'}`,
      date: new Date().toISOString().split('T')[0],
      remark: 'Academic Tuition Fee Installment'
    });
  };

  // Fee Payment State
  const [feePaymentData, setFeePaymentData] = useState({
    amount: '',
    mode: 'Cash',
    receiptNo: '',
    date: new Date().toISOString().split('T')[0],
    remark: 'School Tuition Fee Installment'
  });

  const handleOpenFeeCollect = (student) => {
    setFeeCollectStudent(student);
    const totalFee = Number(student.feeAmount) || 36000;
    const paid = Number(student.feePaid) || 0;
    const balance = Math.max(0, totalFee - paid);

    setFeePaymentData({
      amount: balance > 0 ? balance : 5000,
      mode: 'Cash',
      receiptNo: `REC-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().split('T')[0],
      remark: balance > 0 ? 'Due Fee Clearance' : 'Advance Fee Deposit'
    });
  };

  const handleFeePaymentSubmit = (e) => {
    e.preventDefault();
    if (!feeCollectStudent) return;
    const payAmt = Number(feePaymentData.amount) || 0;
    if (payAmt <= 0) {
      alert("कृपया मान्य फीस राशि दर्ज करें (Enter a valid amount).");
      return;
    }

    const currentPaid = Number(feeCollectStudent.feePaid) || 0;
    const totalFee = Number(feeCollectStudent.feeAmount) || 36000;
    const newFeePaid = currentPaid + payAmt;
    const newStatus = newFeePaid >= totalFee ? 'Paid' : 'Partial';

    const updated = {
      ...feeCollectStudent,
      feePaid: newFeePaid,
      feeStatus: newStatus
    };

    if (onUpdateStudent) {
      onUpdateStudent(updated);
    }
    if (selectedStudentDetail?.id === updated.id) {
      setSelectedStudentDetail(updated);
    }
    setReceiptStudent(updated);
    setReceiptDetails({ ...feePaymentData });
    setFeeCollectStudent(null);
  };

  // New Student Form State
  const [formData, setFormData] = useState({
    name: '',
    admissionNo: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    rollNo: '',
    className: 'Class 10',
    section: 'A',
    fatherName: '',
    motherName: '',
    phone: '',
    email: '',
    address: '',
    dob: '2012-05-10',
    gender: 'Male',
    bloodGroup: 'B+',
    feeAmount: 36000,
    feePaid: 36000
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNo) {
      alert("Please provide at least Student Name and Roll Number.");
      return;
    }

    const newStudent = {
      ...formData,
      name: sanitizeInput(formData.name),
      fatherName: sanitizeInput(formData.fatherName),
      motherName: sanitizeInput(formData.motherName),
      phone: sanitizeInput(formData.phone),
      email: sanitizeInput(formData.email),
      address: sanitizeInput(formData.address),
      id: `STU-${Date.now().toString().slice(-4)}`,
      attendancePercentage: 100,
      feeStatus: Number(formData.feePaid) >= Number(formData.feeAmount) ? 'Paid' : (Number(formData.feePaid) > 0 ? 'Partial' : 'Pending')
    };

    onAddStudent(newStudent);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      admissionNo: `ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      rollNo: '',
      className: 'Class 10',
      section: 'A',
      fatherName: '',
      motherName: '',
      phone: '',
      email: '',
      address: '',
      dob: '2012-05-10',
      gender: 'Male',
      bloodGroup: 'B+',
      feeAmount: 36000,
      feePaid: 36000
    });
  };

  const handleStartEdit = (student) => {
    setEditingStudent({ ...student });
    setIsEditModalOpen(true);
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    if (!editingStudent.name || !editingStudent.rollNo) {
      alert("Please provide at least Student Name and Roll Number.");
      return;
    }

    const updated = {
      ...editingStudent,
      name: sanitizeInput(editingStudent.name),
      fatherName: sanitizeInput(editingStudent.fatherName),
      motherName: sanitizeInput(editingStudent.motherName),
      phone: sanitizeInput(editingStudent.phone),
      email: sanitizeInput(editingStudent.email),
      address: sanitizeInput(editingStudent.address),
      feeStatus: Number(editingStudent.feePaid) >= Number(editingStudent.feeAmount)
        ? 'Paid'
        : (Number(editingStudent.feePaid) > 0 ? 'Partial' : 'Pending')
    };

    if (onUpdateStudent) {
      onUpdateStudent(updated);
    }
    if (selectedStudentDetail?.id === updated.id) {
      setSelectedStudentDetail(updated);
    }
    setIsEditModalOpen(false);
    setEditingStudent(null);
  };

  const handleDelete = (student) => {
    const confirmMessage = `⚠️ क्या आप वाकई छात्र "${student.name}" (Roll: ${student.rollNo}, Class: ${student.className} - Sec ${student.section}) का पूरा रिकॉर्ड स्कूल से हटाना चाहते हैं?\n\nAre you sure you want to remove this student? This cannot be undone.`;
    if (window.confirm(confirmMessage)) {
      if (onDeleteStudent) {
        onDeleteStudent(student.id);
      }
      if (selectedStudentDetail?.id === student.id) {
        setSelectedStudentDetail(null);
      }
    }
  };

  // Distinct sections available across enrolled students
  const availableSections = ['All', ...new Set(students.map((s) => s.section).filter(Boolean).sort())];

  // Filter Logic
  const filteredStudents = students.filter((s) => {
    const matchesClass = classFilter === 'All' || s.className === classFilter;
    const matchesSection = sectionFilter === 'All' || s.section === sectionFilter;
    const matchesSearch =
      !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toString().includes(searchTerm) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm)) ||
      (s.fatherName && s.fatherName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesClass && matchesSection && matchesSearch;
  });

  // Group students section-wise (Class + Section)
  const groupedSections = filteredStudents.reduce((acc, stu) => {
    const key = `${stu.className} - Section ${stu.section || 'A'}`;
    if (!acc[key]) {
      acc[key] = {
        key,
        className: stu.className,
        section: stu.section || 'A',
        students: []
      };
    }
    acc[key].students.push(stu);
    return acc;
  }, {});

  // Sort section groups by class grade
  const sortedSectionKeys = Object.keys(groupedSections).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    if (numA !== numB) return numB - numA;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-6">
      {/* Accountant / Fee Desk Banner (RBAC) */}
      {currentRole === 'accountant' && (
        <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 p-5 rounded-2xl text-white shadow-md flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">
                School Fee Collection & Slip Counter (शुल्क संग्रहण काउंटर)
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                Authorized Fee Counter Session: Collect school tuition installments, generate computerized fee slips, and print instant receipts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
              🔒 RBAC: Fee Section Authorized
            </span>
          </div>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.navStudents} (छात्र निर्देशिका)</h2>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {filteredStudents.length} of {students.length} Students
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Section-wise student roll rosters, edit details, remove students, parent contact numbers, and marksheet generation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* View Mode Toggle (Table View vs Section-Wise Grouped View) */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View (तालिका दृश्य)"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('section')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'section'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Section-wise Roster View (अनुभाग अनुसार दृश्य)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Section-wise</span>
            </button>
          </div>

          {/* Class Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Class:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="All">{t.allClasses}</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Section Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sec:</span>
            <select
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              {availableSections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === 'All' ? 'All Sections' : `Sec ${sec}`}
                </option>
              ))}
            </select>
          </div>

          {/* Print Section Roster */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition no-print"
            title="Print Current List"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Share Parent App Button */}
          {onOpenShareParentApp && (
            <button
              onClick={onOpenShareParentApp}
              className="flex items-center gap-1.5 bg-[#05574F] hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
              title="Share Parent App Link, WhatsApp message and QR Code"
            >
              <Smartphone className="w-4 h-4 text-[#FDBE3E]" />
              <span className="hidden sm:inline">ऐप शेयर करें (QR & WhatsApp)</span>
              <span className="sm:hidden">Share App</span>
            </button>
          )}

          {/* Add Student Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.addNewStudent}</span>
          </button>
        </div>
      </div>

      {/* Printable Header on Paper */}
      <div className="hidden print:block mb-4 text-center border-b pb-2 printable-header">
        <h2 className="text-xl font-black uppercase text-slate-900">{activeSchool?.name || "School"}</h2>
        <p className="text-xs font-semibold text-slate-600">{activeSchool?.affiliation || "CBSE Affiliated Institution"}</p>
        <h3 className="text-sm font-bold text-slate-800 mt-1">
          Student Enrollment Roster • {classFilter === 'All' ? 'All Classes' : classFilter} • Section: {sectionFilter}
        </h3>
        <p className="text-xs text-slate-500">Total Enrolled: {students.length} Students</p>
      </div>

      {/* VIEW MODE 1: SECTION-WISE GROUPED VIEW (अनुभाग अनुसार दृश्य) */}
      {viewMode === 'section' && (
        <div className="space-y-6">
          {sortedSectionKeys.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
              No students found for this class and section filter.
            </div>
          ) : (
            sortedSectionKeys.map((secKey) => {
              const secGroup = groupedSections[secKey];
              return (
                <div
                  key={secKey}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                >
                  {/* Section Banner Header */}
                  <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                        {secGroup.section}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-900">{secKey}</h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          Official Class Roll Roster
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                        {secGroup.students.length} Students
                      </span>
                    </div>
                  </div>

                  {/* Section Students Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-2.5 px-4 w-20">Roll No</th>
                          <th className="py-2.5 px-4">{t.fullName}</th>
                          <th className="py-2.5 px-4">Parent & Contact</th>
                          <th className="py-2.5 px-4 text-center">Attendance</th>
                          <th className="py-2.5 px-4">Fee Status</th>
                          <th className="py-2.5 px-4 text-right">{t.actions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {secGroup.students
                          .sort((a, b) => (parseInt(a.rollNo, 10) || 0) - (parseInt(b.rollNo, 10) || 0))
                          .map((stu) => (
                            <tr key={stu.id} className="hover:bg-slate-50/60 transition">
                              <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                                {stu.rollNo}
                              </td>

                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                                    {stu.name.charAt(0)}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 block">{stu.name}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">{stu.admissionNo}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-2.5 px-4">
                                <div>
                                  <span className="font-medium text-slate-800 block text-[11px]">{stu.fatherName || 'Parent'}</span>
                                  <a href={`tel:${stu.phone}`} className="text-[10px] text-blue-600 hover:underline">
                                    {stu.phone}
                                  </a>
                                </div>
                              </td>

                              <td className="py-2.5 px-4 text-center">
                                <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                                  (stu.attendancePercentage || 95) < 75 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                  {stu.attendancePercentage || 95}%
                                </span>
                              </td>

                              <td className="py-2.5 px-4">
                                <button
                                  onClick={() => handleOpenFeeCollect(stu)}
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition hover:opacity-85 ${
                                    stu.feeStatus === 'Paid'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : stu.feeStatus === 'Partial'
                                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                      : 'bg-red-50 text-red-700 border border-red-200'
                                  }`}
                                  title="Click to Collect Fee (फीस जमा करें)"
                                >
                                  <Wallet className="w-3 h-3" />
                                  <span>{stu.feeStatus}</span>
                                </button>
                              </td>

                              <td className="py-2.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {/* Collect Fee (Accountant & Admin only) */}
                                  {currentRole !== 'teacher' && (
                                    <button
                                      onClick={() => handleOpenFeeCollect(stu)}
                                      className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                                      title="Collect Fee / फीस जमा करें"
                                    >
                                      <Wallet className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  {/* Direct Print Fee Slip (Accountant & Admin only, when fee is paid) */}
                                  {currentRole !== 'teacher' && Number(stu.feePaid) > 0 && (
                                    <button
                                      onClick={() => handleOpenDirectReceipt(stu)}
                                      className="p-1 rounded text-amber-600 hover:bg-amber-50"
                                      title="Print Fee Receipt (रसीद प्रिंट करें)"
                                    >
                                      <Printer className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  <button
                                    onClick={() => setSelectedStudentDetail(stu)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                                    title="View Profile"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleStartEdit(stu)}
                                    className="p-1 rounded text-blue-600 hover:bg-blue-50"
                                    title="Edit Student"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  {/* Delete Student (School Admin Only) */}
                                  {currentRole === 'school_admin' && (
                                    <button
                                      onClick={() => handleDelete(stu)}
                                      className="p-1 rounded text-red-500 hover:bg-red-50"
                                      title="Delete Student"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {/* Report Card (Teacher & Admin only) */}
                                  {currentRole !== 'accountant' && (
                                    <button
                                      onClick={() => onViewStudentReport(stu)}
                                      className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]"
                                      title="Report Card"
                                    >
                                      Report
                                    </button>
                                  )}
                                  <a
                                    href={`https://api.whatsapp.com/send?phone=91${(stu.phone || '').replace(/\D/g, '').slice(-10)}&text=${encodeURIComponent(
                                      `🏫 *स्कूल मोबाइल ऐप लॉगिन (VidyaSetu Parent App)*\nप्रिय अभिभावक, छात्र *${stu.name}* (${stu.className}-${stu.section}) का रिपोर्ट कार्ड, फीस व हाजिरी देखने हेतु ऐप लिंक:\nhttps://abhi420m.github.io/school-app/?portal=parent\n\nरजिस्टर्ड मोबाइल: ${stu.phone}\nAdmission No: ${stu.admissionNo}\nसुरक्षा पिन: 123`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[10px] flex items-center gap-0.5"
                                    title="Send Parent App Login on WhatsApp"
                                  >
                                    <Smartphone className="w-3 h-3 text-emerald-600" />
                                    <span>Pass</span>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 2: STANDARD TABLE VIEW (तालिका दृश्य) */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">{t.fullName}</th>
                  <th className="py-3.5 px-4">{t.class} & Section</th>
                  <th className="py-3.5 px-4">{t.rollNo} / ADM</th>
                  <th className="py-3.5 px-4">{t.fatherName} & Phone</th>
                  <th className="py-3.5 px-4 text-center">{t.attendanceRate}</th>
                  <th className="py-3.5 px-4">Fee Status</th>
                  <th className="py-3.5 px-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-slate-400">
                      No student records found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((stu) => {
                    const isLowAttendance = (stu.attendancePercentage || 0) < 75;
                    return (
                      <tr key={stu.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {stu.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{stu.name}</span>
                              <span className="text-[11px] text-slate-400">{stu.gender} • {stu.bloodGroup || 'B+'}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                              {stu.className}
                            </span>
                            <span className="font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-xs">
                              Sec {stu.section}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div>
                            <span className="font-mono font-bold text-slate-800">Roll: {stu.rollNo}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">{stu.admissionNo}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium text-slate-800 block">{stu.fatherName || 'Father'}</span>
                            <a
                              href={`tel:${stu.phone}`}
                              className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3" />
                              {stu.phone}
                            </a>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                              isLowAttendance ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {stu.attendancePercentage || 95}%
                            </span>
                            {isLowAttendance && (
                              <span className="text-[10px] text-red-500 font-semibold mt-0.5 flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" /> Low
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleOpenFeeCollect(stu)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition hover:opacity-85 ${
                              stu.feeStatus === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : stu.feeStatus === 'Partial'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                            title="Click to Collect Fee (फीस जमा करें)"
                          >
                            <Wallet className="w-3 h-3" />
                            <span>{stu.feeStatus}</span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Collect Fee (Accountant & Admin only) */}
                            {currentRole !== 'teacher' && (
                              <button
                                onClick={() => handleOpenFeeCollect(stu)}
                                className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition"
                                title="Collect Fee / फीस जमा करें"
                              >
                                <Wallet className="w-4 h-4" />
                              </button>
                            )}

                            {/* Direct Print Fee Slip (Accountant & Admin only, if fee paid) */}
                            {currentRole !== 'teacher' && Number(stu.feePaid) > 0 && (
                              <button
                                onClick={() => handleOpenDirectReceipt(stu)}
                                className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50 transition"
                                title="Print Fee Slip (रसीद प्रिंट करें)"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                            )}

                            {/* View Profile */}
                            <button
                              onClick={() => setSelectedStudentDetail(stu)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                              title="View Full Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit Student Details */}
                            <button
                              onClick={() => handleStartEdit(stu)}
                              className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition"
                              title="Edit Student / छात्र विवरण बदलें"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            {/* Delete Student (School Admin Only) */}
                            {currentRole === 'school_admin' && (
                              <button
                                onClick={() => handleDelete(stu)}
                                className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                                title="Delete Student / छात्र हटाएं"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}

                            {/* Report Card (Teacher & Admin only) */}
                            {currentRole !== 'accountant' && (
                              <button
                                onClick={() => onViewStudentReport(stu)}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition"
                                title="View Marks & Report Card"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Report</span>
                              </button>
                            )}

                            {/* Send WhatsApp Login Pass to Parent */}
                            <a
                              href={`https://api.whatsapp.com/send?phone=91${(stu.phone || '').replace(/\D/g, '').slice(-10)}&text=${encodeURIComponent(
                                `🏫 *स्कूल मोबाइल ऐप लॉगिन (VidyaSetu Parent App)*\nप्रिय अभिभावक, छात्र *${stu.name}* (${stu.className}-${stu.section}) का रिपोर्ट कार्ड, फीस व हाजिरी देखने हेतु ऐप लिंक:\nhttps://abhi420m.github.io/school-app/?portal=parent\n\nरजिस्टर्ड मोबाइल: ${stu.phone}\nAdmission No: ${stu.admissionNo}\nसुरक्षा पिन: 123`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[11px] transition"
                              title="Send Parent App Login to Parent on WhatsApp"
                            >
                              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Pass</span>
                            </a>
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
      )}

      {/* Student 360 Profile Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudentDetail(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md">
                {selectedStudentDetail.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedStudentDetail.name}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedStudentDetail.className} - Section {selectedStudentDetail.section} | Roll No: {selectedStudentDetail.rollNo}
                </p>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded mt-1 inline-block">
                  {selectedStudentDetail.admissionNo}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Father's Name</span>
                <p className="font-bold text-slate-800">{selectedStudentDetail.fatherName || 'Not recorded'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Mother's Name</span>
                <p className="font-bold text-slate-800">{selectedStudentDetail.motherName || 'Not recorded'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Contact Phone</span>
                <a href={`tel:${selectedStudentDetail.phone}`} className="font-bold text-blue-600 block hover:underline">
                  {selectedStudentDetail.phone || 'No phone'}
                </a>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Date of Birth / Blood</span>
                <p className="font-bold text-slate-800">{selectedStudentDetail.dob} • {selectedStudentDetail.bloodGroup}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 mb-5">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Residential Address</span>
              <p className="text-slate-700">{selectedStudentDetail.address || 'Address not registered on file'}</p>
            </div>

            {/* Profile Action Buttons: Edit, Delete, Report Card */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={() => handleDelete(selectedStudentDetail)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete (हटाएं)</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setReceiptStudent(selectedStudentDetail);
                    setReceiptDetails(null);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition border border-amber-200"
                  title="Print Official Fee Receipt"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-700" />
                  <span>Fee Receipt</span>
                </button>

                <button
                  onClick={() => handleStartEdit(selectedStudentDetail)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition border border-blue-200"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Details (बदलें)</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedStudentDetail(null);
                    onViewStudentReport(selectedStudentDetail);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Report Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {isEditModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingStudent(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Pencil className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Edit Student Details (छात्र विवरण बदलें)</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Update {editingStudent.name}'s roll number, class assignment, parent contacts, or fees.
            </p>

            <form onSubmit={handleEditFormSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.rollNo} *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.rollNo}
                    onChange={(e) => setEditingStudent({ ...editingStudent, rollNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Admission No</label>
                  <input
                    type="text"
                    value={editingStudent.admissionNo}
                    onChange={(e) => setEditingStudent({ ...editingStudent, admissionNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Gender</label>
                  <select
                    value={editingStudent.gender || 'Male'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="Male">Male (पुरुष)</option>
                    <option value="Female">Female (महिला)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.class}</label>
                  <select
                    value={editingStudent.className}
                    onChange={(e) => setEditingStudent({ ...editingStudent, className: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.section}</label>
                  <input
                    type="text"
                    value={editingStudent.section}
                    onChange={(e) => setEditingStudent({ ...editingStudent, section: e.target.value })}
                    placeholder="A / B / C"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.fatherName}</label>
                  <input
                    type="text"
                    value={editingStudent.fatherName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.motherName}</label>
                  <input
                    type="text"
                    value={editingStudent.motherName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, motherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.phone} (Parent Mobile) *</label>
                  <input
                    type="tel"
                    required
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                  <select
                    value={editingStudent.bloodGroup || 'B+'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Annual Fee Amount (₹)</label>
                  <input
                    type="number"
                    value={editingStudent.feeAmount || 0}
                    onChange={(e) => setEditingStudent({ ...editingStudent, feeAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Fee Paid Amount (₹)</label>
                  <input
                    type="number"
                    value={editingStudent.feePaid || 0}
                    onChange={(e) => setEditingStudent({ ...editingStudent, feePaid: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t.address}</label>
                <textarea
                  rows="2"
                  value={editingStudent.address || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Update Student Records (सहेजें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{t.addNewStudent}</h3>
            <p className="text-xs text-slate-500 mb-4">Enroll a student into the school database and generate admission records.</p>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aryan Malhotra"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.rollNo} *</label>
                  <input
                    type="text"
                    required
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    placeholder="e.g. 106"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.class}</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.section}</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="A / B / C"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.fatherName}</label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="Mr. ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.motherName}</label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    placeholder="Mrs. ..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.phone} (Mobile) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Annual Fee Amount (₹ कुल वार्षिक फीस)</label>
                  <input
                    type="number"
                    value={formData.feeAmount}
                    onChange={(e) => setFormData({ ...formData, feeAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Initial Fee Paid (₹ अब तक जमा फीस)</label>
                  <input
                    type="number"
                    value={formData.feePaid}
                    onChange={(e) => setFormData({ ...formData, feePaid: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{t.address}</label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full residential address..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Save & Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK FEE COLLECTION MODAL (फीस जमा मोडल) */}
      {feeCollectStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setFeeCollectStudent(null)}
              className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                  Collect Student Fee (फीस जमा करें)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Student: <strong className="text-slate-800">{feeCollectStudent.name}</strong> • {feeCollectStudent.className} ({feeCollectStudent.section})
                </p>
              </div>
            </div>

            {/* Dues Overview Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Fee</span>
                <span className="font-black text-slate-900">₹{(feeCollectStudent.feeAmount || 36000).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Already Paid</span>
                <span className="font-black text-emerald-600">₹{(feeCollectStudent.feePaid || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Due Balance</span>
                <span className="font-black text-red-600">
                  ₹{Math.max(0, (feeCollectStudent.feeAmount || 36000) - (feeCollectStudent.feePaid || 0)).toLocaleString()}
                </span>
              </div>
            </div>

            <form onSubmit={handleFeePaymentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Amount (₹ जमा राशि) *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-black text-sm">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={feePaymentData.amount}
                    onChange={(e) => setFeePaymentData({ ...feePaymentData, amount: e.target.value })}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-emerald-300 focus:border-emerald-600 outline-none font-black text-emerald-900 text-base"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Mode (माध्यम) *</label>
                  <select
                    value={feePaymentData.mode}
                    onChange={(e) => setFeePaymentData({ ...feePaymentData, mode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white font-medium"
                  >
                    <option value="Cash">Cash (नकद)</option>
                    <option value="UPI / QR">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Receipt No (रसीद संख्या)</label>
                  <input
                    type="text"
                    readOnly
                    value={feePaymentData.receiptNo}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-mono text-slate-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Remarks / Note</label>
                <input
                  type="text"
                  value={feePaymentData.remark}
                  onChange={(e) => setFeePaymentData({ ...feePaymentData, remark: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                  placeholder="e.g. Term 2 Fee paid in full"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setFeeCollectStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit & Generate Receipt (जमा करें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Printable Fee Receipt Modal */}
      {receiptStudent && (
        <FeeReceiptModal
          student={receiptStudent}
          activeSchool={activeSchool}
          paymentDetails={receiptDetails}
          onClose={() => {
            setReceiptStudent(null);
            setReceiptDetails(null);
          }}
        />
      )}
    </div>
  );
}
