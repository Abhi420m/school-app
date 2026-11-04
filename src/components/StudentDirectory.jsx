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
  Heart
} from 'lucide-react';

export default function StudentDirectory({
  students,
  classes,
  onAddStudent,
  onViewStudentReport,
  classFilter,
  setClassFilter,
  searchTerm,
  setSearchTerm,
  t
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

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
      id: `STU-${Date.now().toString().slice(-4)}`,
      attendancePercentage: 100,
      feeStatus: formData.feePaid >= formData.feeAmount ? 'Paid' : (formData.feePaid > 0 ? 'Partial' : 'Pending')
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

  // Filter Logic
  const filteredStudents = students.filter((s) => {
    const matchesClass = classFilter === 'All' || s.className === classFilter;
    const matchesSearch =
      !searchTerm ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toString().includes(searchTerm) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm)) ||
      (s.fatherName && s.fatherName.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.navStudents} (छात्र डेटाबेस)</h2>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {filteredStudents.length} Students
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse complete student records, parent contact details, attendance rates, and download report cards.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="All">{t.allClasses}</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, roll, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs outline-none w-48 md:w-56"
            />
          </div>

          {/* Add Student Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.addNewStudent}</span>
          </button>
        </div>
      </div>

      {/* Students Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Class & Sec</th>
                <th className="py-3.5 px-4">Roll / Adm No</th>
                <th className="py-3.5 px-4">Parents & Phone</th>
                <th className="py-3.5 px-4 text-center">Attendance %</th>
                <th className="py-3.5 px-4">Fee Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
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
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {stu.className} - {stu.section}
                        </span>
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
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          stu.feeStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : stu.feeStatus === 'Partial'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {stu.feeStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentDetail(stu)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                            title="View Full Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onViewStudentReport(stu)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs transition"
                            title="View Marks & Report Card"
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

      {/* Student 360 Profile Modal */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
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

            <div className="grid grid-cols-2 gap-3 py-4 text-xs border-b border-slate-100">
              <div>
                <p className="text-slate-400 font-medium text-[11px]">Father's Name</p>
                <p className="font-bold text-slate-800">{selectedStudentDetail.fatherName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium text-[11px]">Mother's Name</p>
                <p className="font-bold text-slate-800">{selectedStudentDetail.motherName}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium text-[11px]">Parent Mobile</p>
                <a href={`tel:${selectedStudentDetail.phone}`} className="font-bold text-blue-600 hover:underline">
                  {selectedStudentDetail.phone}
                </a>
              </div>
              <div>
                <p className="text-slate-400 font-medium text-[11px]">Date of Birth</p>
                <p className="font-bold text-slate-800">{selectedStudentDetail.dob}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium text-[11px]">Blood Group</p>
                <p className="font-bold text-slate-800">{selectedStudentDetail.bloodGroup}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium text-[11px]">Attendance Record</p>
                <p className="font-bold text-emerald-600">{selectedStudentDetail.attendancePercentage}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 font-medium text-[11px]">Residential Address</p>
                <p className="font-medium text-slate-700">{selectedStudentDetail.address}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedStudentDetail.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Parent</span>
              </a>

              <button
                onClick={() => {
                  onViewStudentReport(selectedStudentDetail);
                  setSelectedStudentDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Report Card</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
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
    </div>
  );
}
