import React, { useState } from 'react';
import {
  Contact,
  Phone,
  Mail,
  Award,
  BookOpen,
  Calendar,
  UserPlus,
  Search,
  X,
  PhoneCall,
  MessageSquare,
  Printer,
  Pencil,
  Trash2,
  Layers,
  LayoutGrid,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function TeacherDirectory({
  teachers,
  classes = [],
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  t
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'section'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    designation: 'TGT Subject Teacher',
    subject: 'Mathematics',
    phone: '',
    email: '',
    qualification: 'M.Sc., B.Ed.',
    experience: '5 Years',
    classInCharge: 'Class 10-A',
    gender: 'Female'
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide at least Teacher's Name and Phone Number.");
      return;
    }

    const newTeacher = {
      ...formData,
      id: `T${Date.now().toString().slice(-3)}`,
      joinedYear: '2026'
    };

    onAddTeacher(newTeacher);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      designation: 'TGT Subject Teacher',
      subject: 'Mathematics',
      phone: '',
      email: '',
      qualification: 'M.Sc., B.Ed.',
      experience: '5 Years',
      classInCharge: 'Class 10-A',
      gender: 'Female'
    });
  };

  const handleStartEdit = (teacher) => {
    setEditingTeacher({ ...teacher });
    setIsEditModalOpen(true);
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    if (!editingTeacher.name || !editingTeacher.phone) {
      alert("Please provide at least Teacher's Name and Phone Number.");
      return;
    }

    if (onUpdateTeacher) {
      onUpdateTeacher(editingTeacher);
    }
    setIsEditModalOpen(false);
    setEditingTeacher(null);
  };

  const handleDelete = (teacher) => {
    const confirmMessage = `⚠️ क्या आप वाकई शिक्षक "${teacher.name}" (${teacher.subject}, ${teacher.designation}) का विवरण स्कूल रिकॉर्ड से हटाना चाहते हैं?\n\nAre you sure you want to remove this faculty member? This cannot be undone.`;
    if (window.confirm(confirmMessage)) {
      if (onDeleteTeacher) {
        onDeleteTeacher(teacher.id);
      }
    }
  };

  // Distinct subjects and sections for filters
  const distinctSubjects = ['All', ...new Set(teachers.map((t) => t.subject).filter(Boolean).sort())];
  const distinctInChargeClasses = [
    'All',
    ...new Set(teachers.map((t) => t.classInCharge).filter(Boolean).sort())
  ];

  // Build complete list of all classes and sections in school
  const allSchoolSections = [];
  if (classes && classes.length > 0) {
    classes.forEach((cls) => {
      (cls.sections || ['A', 'B']).forEach((sec) => {
        allSchoolSections.push({
          className: cls.name,
          section: sec,
          label: `${cls.name} - Section ${sec}`,
          shortKey: `${cls.name}-${sec}`.replace(/\s+/g, '')
        });
      });
    });
  } else {
    // Fallback generated from teacher assignments
    distinctInChargeClasses.filter((c) => c !== 'All').forEach((c) => {
      allSchoolSections.push({
        className: c,
        section: '',
        label: c,
        shortKey: c.replace(/\s+/g, '')
      });
    });
  }

  // Filter Logic
  const filteredTeachers = teachers.filter((tch) => {
    const matchesSearch =
      !searchTerm ||
      tch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tch.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tch.phone.includes(searchTerm) ||
      (tch.classInCharge && tch.classInCharge.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesClass =
      classFilter === 'All' ||
      (tch.classInCharge &&
        tch.classInCharge.replace(/\s+/g, '').toLowerCase().includes(classFilter.replace(/\s+/g, '').toLowerCase()));

    const matchesSubject = subjectFilter === 'All' || tch.subject === subjectFilter;

    return matchesSearch && matchesClass && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.navTeachers} (शिक्षक व कर्मचारी निर्देशिका)</h2>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              {filteredTeachers.length} of {teachers.length} Faculty Members
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Section-wise class teachers, subject faculty assignments, direct mobile numbers ("Teacher No"), and faculty roster.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* View Mode Switcher (Faculty Cards vs Section-Wise List) */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cards View (कार्ड दृश्य)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              onClick={() => setViewMode('section')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'section'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Section-wise Faculty List (अनुभाग अनुसार शिक्षक सूची)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Section-wise</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search teacher, phone, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs outline-none w-48 md:w-56"
            />
          </div>

          {/* Section In-Charge Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sec:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="All">All In-Charges</option>
              {distinctInChargeClasses
                .filter((c) => c !== 'All')
                .map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Sub:</span>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="All">All Subjects</option>
              {distinctSubjects
                .filter((s) => s !== 'All')
                .map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
            </select>
          </div>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition no-print"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Add Teacher Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.addNewTeacher}</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: SECTION-WISE FACULTY LIST (अनुभाग अनुसार शिक्षक सूची) */}
      {viewMode === 'section' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-50/70 p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h3 className="font-extrabold text-sm text-slate-900">
                Class & Section Teacher Allocation Matrix (अनुभाग अनुसार शिक्षक तालिका)
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {allSchoolSections.length} Sections Configured
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Class & Section</th>
                  <th className="py-3 px-4">Appointed Class Teacher</th>
                  <th className="py-3 px-4">Teacher No (Mobile)</th>
                  <th className="py-3 px-4">Subject Specialization</th>
                  <th className="py-3 px-4">Qualifications</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {allSchoolSections.map((secObj) => {
                  // Find teacher assigned as in-charge of this section
                  const assignedTeacher = teachers.find((t) => {
                    if (!t.classInCharge) return false;
                    const cleanTch = t.classInCharge.replace(/[\s-]/g, '').toLowerCase();
                    const cleanSec = `${secObj.className}${secObj.section}`.replace(/[\s-]/g, '').toLowerCase();
                    const cleanLabel = secObj.label.replace(/[\s-]/g, '').toLowerCase();
                    return cleanTch === cleanSec || cleanTch === cleanLabel || cleanTch.includes(cleanSec);
                  });

                  return (
                    <tr key={secObj.label} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {secObj.section || 'A'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{secObj.label}</span>
                            <span className="text-[10px] text-slate-400 font-medium">Official Curriculum Grade</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {assignedTeacher ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center">
                              {assignedTeacher.name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/, '').charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{assignedTeacher.name}</span>
                              <span className="text-[10px] text-emerald-700 font-semibold">{assignedTeacher.designation}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            To be appointed
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {assignedTeacher ? (
                          <a
                            href={`tel:${assignedTeacher.phone}`}
                            className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            {assignedTeacher.phone}
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {assignedTeacher ? (
                          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            {assignedTeacher.subject}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {assignedTeacher ? (
                          <span className="text-slate-600 text-[11px]">{assignedTeacher.qualification}</span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {assignedTeacher ? (
                          <div className="flex items-center justify-end gap-1">
                            <a
                              href={`tel:${assignedTeacher.phone}`}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                              title="Call Class Teacher"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`https://wa.me/${assignedTeacher.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                              title="WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            </a>
                            <button
                              onClick={() => handleStartEdit(assignedTeacher)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                              title="Edit Teacher"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(assignedTeacher)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                              title="Remove Teacher"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setFormData({
                                ...formData,
                                classInCharge: `${secObj.className}-${secObj.section || 'A'}`
                              });
                              setIsAddModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition"
                          >
                            + Appoint Teacher
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FACULTY CARDS GRID VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((tch) => (
            <div
              key={tch.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-lg flex items-center justify-center shadow-xs shrink-0">
                      {tch.name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/, '').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">{tch.name}</h3>
                      <p className="text-xs text-emerald-700 font-semibold">{tch.designation}</p>
                    </div>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(tch)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                      title="Edit Teacher / शिक्षक विवरण बदलें"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tch)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Remove Teacher / शिक्षक हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Badges for Subject & Class In-Charge */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-[11px] font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-blue-600" />
                    {tch.subject}
                  </span>

                  {tch.classInCharge && (
                    <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                      In-Charge: {tch.classInCharge}
                    </span>
                  )}
                </div>

                {/* Details & Contact Phone Number ("Teacher No") */}
                <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between py-1 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      Teacher No:
                    </span>
                    <a
                      href={`tel:${tch.phone}`}
                      className="font-black text-slate-900 tracking-wide text-xs hover:underline font-mono"
                    >
                      {tch.phone}
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 px-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Mail className="w-3.5 h-3.5" /> Email:
                    </span>
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">{tch.email || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 px-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Award className="w-3.5 h-3.5" /> Qualification:
                    </span>
                    <span className="font-medium text-slate-700">{tch.qualification}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 px-1">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> Experience:
                    </span>
                    <span className="font-bold text-slate-800">{tch.experience}</span>
                  </div>
                </div>
              </div>

              {/* Direct Connect Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${tch.phone}`}
                  className="flex-1 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Teacher</span>
                </a>

                <a
                  href={`https://wa.me/${tch.phone ? tch.phone.replace(/[^0-9]/g, '') : ''}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT TEACHER MODAL */}
      {isEditModalOpen && editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingTeacher(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Pencil className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Edit Teacher Details (शिक्षक विवरण बदलें)</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Update contact information, subjects, qualifications, or class assignments.</p>

            <form onSubmit={handleEditFormSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.name}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.phone} (Teacher No / Mobile) *</label>
                  <input
                    type="tel"
                    required
                    value={editingTeacher.phone}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Subject Specialization *</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.subject}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={editingTeacher.designation}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingTeacher.email || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class In-Charge</label>
                  <input
                    type="text"
                    value={editingTeacher.classInCharge || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, classInCharge: e.target.value })}
                    placeholder="e.g. Class 10-A"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={editingTeacher.qualification || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Experience</label>
                  <input
                    type="text"
                    value={editingTeacher.experience || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingTeacher(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Update Faculty Records (सहेजें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TEACHER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{t.addNewTeacher}</h3>
            <p className="text-xs text-slate-500 mb-4">Add a new faculty member with contact phone number and teaching assignment.</p>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.fullName} *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mr. Sanjay Mishra"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.phone} (Mobile) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 74549 96566"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Subject Specialization *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@school.edu"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class In-Charge</label>
                  <input
                    type="text"
                    value={formData.classInCharge}
                    onChange={(e) => setFormData({ ...formData, classInCharge: e.target.value })}
                    placeholder="Class 10-A"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                >
                  Save & Appoint Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
