import React, { useState } from 'react';
import TimetableModal from './TimetableModal';
import {
  GraduationCap,
  Users,
  Contact,
  Plus,
  BookOpen,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Pencil,
  Trash2,
  X,
  Layers,
  Save,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  UserCheck,
  AlertCircle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export default function ClassManager({
  classes,
  students,
  teachers,
  onAddClass,
  onUpdateClass,
  onDeleteClass,
  onSelectClassFilter,
  setActiveTab,
  t
}) {
  const [selectedStream, setSelectedStream] = useState('All');
  const [sortOrder, setSortOrder] = useState('auto'); // 'auto' (smart numerical) | 'az' (alphabetical)
  const [openedClassId, setOpenedClassId] = useState(null); // When opened, shows section-wise view!
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [timetableTarget, setTimetableTarget] = useState(null); // { className, section }

  // New Class Form State
  const [newClassData, setNewClassData] = useState({
    name: 'Class 1',
    stream: 'Primary',
    hasSections: true,
    sectionsStr: 'A, B',
    classTeacherId: teachers[0]?.id || ''
  });

  // Add Section to Opened Class Form State
  const [newSectionData, setNewSectionData] = useState({
    sectionName: 'C',
    sectionTeacherId: teachers[0]?.id || ''
  });

  const streams = ['All', 'Pre-Primary', 'Primary', 'Middle', 'Secondary', 'Sr. Secondary'];

  // Smart Sorting function
  const sortClasses = (classList) => {
    return [...classList].sort((a, b) => {
      if (sortOrder === 'az') {
        return a.name.localeCompare(b.name);
      }
      // 'auto' smart sequential order
      const getRank = (cls) => {
        const lower = cls.name.toLowerCase();
        if (lower.includes('play') || lower.includes('nursery')) return 0;
        if (lower.includes('lkg') || lower.includes('kg1')) return 1;
        if (lower.includes('ukg') || lower.includes('kg2')) return 2;
        const num = parseInt(cls.name.replace(/\D/g, ''), 10);
        return isNaN(num) ? 99 : num + 2;
      };
      return getRank(a) - getRank(b);
    });
  };

  const filteredClasses = classes.filter(c => selectedStream === 'All' || c.stream === selectedStream);
  const sortedClasses = sortClasses(filteredClasses);

  const openedClass = classes.find(c => c.id === openedClassId);

  // Handle Add New Class
  const handleAddClassSubmit = (e) => {
    e.preventDefault();
    if (!newClassData.name.trim()) {
      alert("Please enter a class name.");
      return;
    }

    const sections = newClassData.hasSections
      ? newClassData.sectionsStr.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
      : [];

    const newClass = {
      id: `C${Date.now().toString().slice(-3)}`,
      name: newClassData.name.trim(),
      stream: newClassData.stream,
      sections: sections,
      classTeacherId: newClassData.classTeacherId || null,
      sectionTeachers: {}
    };

    if (newClassData.classTeacherId && sections.length > 0) {
      newClass.sectionTeachers[sections[0]] = newClassData.classTeacherId;
    }

    if (onAddClass) {
      onAddClass(newClass);
    }
    setIsAddClassModalOpen(false);
    setNewClassData({
      name: '',
      stream: 'Primary',
      hasSections: true,
      sectionsStr: 'A, B',
      classTeacherId: teachers[0]?.id || ''
    });
  };

  // Handle Edit Class
  const handleStartEditClass = (cls) => {
    setEditingClass({
      ...cls,
      hasSections: (cls.sections || []).length > 0,
      sectionsStr: (cls.sections || []).join(', ')
    });
    setIsEditClassModalOpen(true);
  };

  const handleEditClassSubmit = (e) => {
    e.preventDefault();
    if (!editingClass.name.trim()) {
      alert("Please enter a class name.");
      return;
    }

    const sections = editingClass.hasSections
      ? editingClass.sectionsStr.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
      : [];

    const updated = {
      ...editingClass,
      name: editingClass.name.trim(),
      sections: sections
    };
    delete updated.sectionsStr;
    delete updated.hasSections;

    if (onUpdateClass) {
      onUpdateClass(updated);
    }
    setIsEditClassModalOpen(false);
    setEditingClass(null);
  };

  // Handle Delete Class
  const handleDeleteClass = (cls) => {
    const studentCount = students.filter(s => s.className === cls.name).length;
    const confirmMsg = `⚠️ क्या आप वाकई "${cls.name}" को हटाना चाहते हैं?${studentCount > 0 ? `\n(इस कक्षा में ${studentCount} छात्र नामांकित हैं)` : ''}\n\nAre you sure you want to delete this class?`;
    if (window.confirm(confirmMsg)) {
      if (onDeleteClass) {
        onDeleteClass(cls.id);
      }
      if (openedClassId === cls.id) {
        setOpenedClassId(null);
      }
    }
  };

  // Handle Add Section to Opened Class
  const handleAddSectionToClass = (e) => {
    e.preventDefault();
    if (!openedClass) return;

    const secName = newSectionData.sectionName.trim().toUpperCase();
    if (!secName) {
      alert("Please enter a section name (e.g. A, B, C).");
      return;
    }

    const currentSections = openedClass.sections || [];
    if (currentSections.includes(secName)) {
      alert(`Section ${secName} already exists in ${openedClass.name}.`);
      return;
    }

    const updatedSections = [...currentSections, secName];
    const updatedSectionTeachers = {
      ...(openedClass.sectionTeachers || {}),
      [secName]: newSectionData.sectionTeacherId || openedClass.classTeacherId
    };

    const updated = {
      ...openedClass,
      sections: updatedSections,
      sectionTeachers: updatedSectionTeachers
    };

    if (onUpdateClass) {
      onUpdateClass(updated);
    }
    setIsAddSectionModalOpen(false);
    setNewSectionData({
      sectionName: '',
      sectionTeacherId: teachers[0]?.id || ''
    });
  };

  // Handle Changing Teacher for a specific Section
  const handleUpdateSectionTeacher = (secName, teacherId) => {
    if (!openedClass) return;

    const updatedSectionTeachers = {
      ...(openedClass.sectionTeachers || {}),
      [secName]: teacherId
    };

    const updated = {
      ...openedClass,
      sectionTeachers: updatedSectionTeachers
    };

    if (onUpdateClass) {
      onUpdateClass(updated);
    }
  };

  // Handle Removing a Section
  const handleRemoveSection = (secName) => {
    if (!openedClass) return;
    const studentCount = students.filter(s => s.className === openedClass.name && s.section === secName).length;
    const confirmMsg = `क्या आप ${openedClass.name} से Section ${secName} हटाना चाहते हैं?${studentCount > 0 ? `\n(इस अनुभाग में ${studentCount} छात्र हैं)` : ''}`;
    
    if (window.confirm(confirmMsg)) {
      const updatedSections = (openedClass.sections || []).filter(s => s !== secName);
      const updatedSectionTeachers = { ...(openedClass.sectionTeachers || {}) };
      delete updatedSectionTeachers[secName];

      const updated = {
        ...openedClass,
        sections: updatedSections,
        sectionTeachers: updatedSectionTeachers
      };

      if (onUpdateClass) {
        onUpdateClass(updated);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Classes & Sections (कक्षाएं एवं अनुभाग)</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              {classes.length} Total Grades
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Separated class and section structure, auto sequential / A to Z sorting, per-section teacher appointments, and timetables.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Sorting Order Toggle (Auto Smart Sequence vs Strict A to Z) */}
          <button
            onClick={() => setSortOrder(sortOrder === 'auto' ? 'az' : 'auto')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
              sortOrder === 'az'
                ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle Sort Sequence / क्रम बदलें"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortOrder === 'az' ? 'Sorted: A to Z (A-Z क्रम)' : 'Sorted: Sequential (क्रमबद्ध)'}</span>
          </button>

          {/* Stream Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {streams.map((stream) => (
              <button
                key={stream}
                onClick={() => setSelectedStream(stream)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedStream === stream
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {stream}
              </button>
            ))}
          </div>

          {/* Add New Class Button */}
          <button
            onClick={() => setIsAddClassModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Class (कक्षा जोड़ें)</span>
          </button>
        </div>
      </div>

      {/* 2. IF A CLASS IS OPENED: SHOW CLASS DETAIL & SECTION-WISE BREAKDOWN ("class open hone k baad section wise show") */}
      {openedClass ? (
        <div className="bg-white rounded-2xl border-2 border-blue-500 shadow-md p-6 space-y-6 animate-in fade-in duration-150">
          
          {/* Opened Class Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenedClassId(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Back to all classes (वापस जाएं)"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {openedClass.name}
                  </h3>
                  <span className="text-xs font-bold uppercase bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
                    {openedClass.stream} Level
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Section-wise division, section class teachers, students, and timetable schedule.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Add Section Button inside class */}
              <button
                onClick={() => setIsAddSectionModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Section (अनुभाग जोड़ें)</span>
              </button>

              {/* View Timetable Button for Class */}
              <button
                onClick={() => setTimetableTarget({ className: openedClass.name, section: openedClass.sections?.[0] || '' })}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#05574F] hover:bg-[#076c62] text-white text-xs font-bold shadow-xs transition"
              >
                <Clock className="w-3.5 h-3.5 text-[#FDBE3E]" />
                <span>Class Timetable (समय सारणी)</span>
              </button>

              {/* Edit Class Settings */}
              <button
                onClick={() => handleStartEditClass(openedClass)}
                className="p-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                title="Edit Class Name & Level"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sections List in this Class */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Sections in {openedClass.name} (अनुभाग सूची):</span>
              </h4>
              <span className="text-xs font-bold text-slate-500">
                {(openedClass.sections || []).length} Sections Active
              </span>
            </div>

            {/* Condition: agar section na ho to section na show karein */}
            {(!openedClass.sections || openedClass.sections.length === 0) ? (
              <div className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center font-bold">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-slate-800 text-sm">
                  इस कक्षा में कोई अनुभाग (Section) नहीं है।
                </h5>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  यह कक्षा सिंगल यूनिट के रूप में चल रही है। यदि आप इसे Section A, Section B आदि में विभाजित करना चाहते हैं, तो नीचे बटन पर क्लिक करें।
                </p>
                <button
                  onClick={() => setIsAddSectionModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Create Section A</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {openedClass.sections.map((sec) => {
                  const secStudents = students.filter(
                    s => s.className === openedClass.name && s.section === sec
                  );
                  // Find teacher assigned specifically to this section
                  const assignedTeacherId = openedClass.sectionTeachers?.[sec] || openedClass.classTeacherId;
                  const secTeacher = teachers.find(t => t.id === assignedTeacherId) || teachers[0];

                  return (
                    <div
                      key={sec}
                      className="bg-slate-50/80 rounded-2xl border border-slate-200 p-4 space-y-3 hover:border-blue-400 transition"
                    >
                      {/* Section Card Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                            {sec}
                          </span>
                          <div>
                            <h5 className="font-bold text-slate-900 text-sm leading-tight">
                              {openedClass.name} - Section {sec}
                            </h5>
                            <span className="text-[11px] font-semibold text-blue-700">
                              {secStudents.length} Students Enrolled
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleRemoveSection(sec)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title={`Delete Section ${sec}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Section Teacher Assignment (Per Section Teacher Selection) */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            Section Teacher (कक्षा शिक्षक):
                          </span>
                        </div>

                        <select
                          value={assignedTeacherId || ''}
                          onChange={(e) => handleUpdateSectionTeacher(sec, e.target.value)}
                          className="w-full py-1 px-2 text-xs rounded-lg border border-slate-200 font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
                        >
                          {teachers.map((tch) => (
                            <option key={tch.id} value={tch.id}>
                              {tch.name} ({tch.subject})
                            </option>
                          ))}
                        </select>

                        {secTeacher && (
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span>Phone: <a href={`tel:${secTeacher.phone}`} className="font-mono text-blue-600 font-bold">{secTeacher.phone}</a></span>
                            <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">{secTeacher.subject}</span>
                          </div>
                        )}
                      </div>

                      {/* Section Actions: View Students & Section Timetable */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            onSelectClassFilter(openedClass.name);
                            setActiveTab('students');
                          }}
                          className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1 transition"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Students</span>
                        </button>

                        <button
                          onClick={() => setTimetableTarget({ className: openedClass.name, section: sec })}
                          className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1 transition"
                          title="View & Edit Time Table for this Section"
                        >
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>Timetable</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* 3. ALL CLASSES GRID (Cards View) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedClasses.map((cls) => {
          const classStudents = students.filter(s => s.className === cls.name);
          const teacher = teachers.find(t => t.id === cls.classTeacherId);
          const hasSections = cls.sections && cls.sections.length > 0;
          const isSelected = openedClassId === cls.id;

          return (
            <div
              key={cls.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group ${
                isSelected ? 'border-2 border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {cls.stream} School
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">{cls.name}</h3>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEditClass(cls)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit Class Details / अनुभाग बदलें"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Class / कक्षा हटाएं"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sections & Strength */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Sections (अनुभाग):</span>
                    {/* Condition: agar section na ho to section na show ho */}
                    {hasSections ? (
                      <div className="flex gap-1 flex-wrap">
                        {cls.sections.map((sec) => (
                          <span key={sec} className="bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2 py-0.5 rounded text-xs">
                            Sec {sec}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400 italic">
                        Single Unit (No Sections)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Enrolled Students:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {classStudents.length} Students
                    </span>
                  </div>

                  {/* Appointed Class Teacher */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class Teacher (कक्षा शिक्षक)</p>
                    {teacher ? (
                      <div className="mt-1 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{teacher.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{teacher.phone}</p>
                        </div>
                        <a
                          href={`tel:${teacher.phone}`}
                          className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition"
                          title="Call Class Teacher"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 font-medium mt-1">To be assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Buttons: Open Section-Wise View & Time Table */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setOpenedClassId(openedClassId === cls.id ? null : cls.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                    openedClassId === cls.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <span>{openedClassId === cls.id ? 'Close Sections' : 'View Sections'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition ${openedClassId === cls.id ? 'rotate-90' : ''}`} />
                </button>

                <button
                  onClick={() => setTimetableTarget({ className: cls.name, section: cls.sections?.[0] || '' })}
                  className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1"
                  title="View Class Timetable"
                >
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Timetable</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: ADD NEW CLASS */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddClassModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Class (नई कक्षा जोड़ें)</h3>
            <p className="text-xs text-slate-500 mb-4">Create a new grade level and define whether it has sections or is a single class.</p>

            <form onSubmit={handleAddClassSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  value={newClassData.name}
                  onChange={(e) => setNewClassData({ ...newClassData, name: e.target.value })}
                  placeholder="e.g. Nursery / LKG / Class 1 / Class 11-Commerce"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">School Level / Stream</label>
                <select
                  value={newClassData.stream}
                  onChange={(e) => setNewClassData({ ...newClassData, stream: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
                >
                  <option value="Pre-Primary">Pre-Primary (Nursery, LKG, UKG)</option>
                  <option value="Primary">Primary (Class 1 to 5)</option>
                  <option value="Middle">Middle (Class 6 to 8)</option>
                  <option value="Secondary">Secondary (Class 9 to 10)</option>
                  <option value="Sr. Secondary">Sr. Secondary (Class 11 to 12)</option>
                </select>
              </div>

              {/* Has Sections checkbox */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newClassData.hasSections}
                    onChange={(e) => setNewClassData({ ...newClassData, hasSections: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-bold text-slate-800 text-xs">This class has multiple sections (Section A, B, etc.)</span>
                </label>

                {newClassData.hasSections && (
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Sections (comma separated):</label>
                    <input
                      type="text"
                      value={newClassData.sectionsStr}
                      onChange={(e) => setNewClassData({ ...newClassData, sectionsStr: e.target.value })}
                      placeholder="e.g. A, B, C"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-blue-700"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Appointed Head Class Teacher</label>
                <select
                  value={newClassData.classTeacherId}
                  onChange={(e) => setNewClassData({ ...newClassData, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium text-slate-800"
                >
                  <option value="">-- No Teacher Assigned --</option>
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {tch.name} ({tch.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Save & Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT CLASS */}
      {isEditClassModalOpen && editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsEditClassModalOpen(false);
                setEditingClass(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Edit Class (कक्षा विवरण बदलें)</h3>
            <p className="text-xs text-slate-500 mb-4">Update grade name, sections, stream, or appointed class teacher.</p>

            <form onSubmit={handleEditClassSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">School Level / Stream</label>
                <select
                  value={editingClass.stream}
                  onChange={(e) => setEditingClass({ ...editingClass, stream: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
                >
                  <option value="Pre-Primary">Pre-Primary (Nursery, LKG, UKG)</option>
                  <option value="Primary">Primary (Class 1 to 5)</option>
                  <option value="Middle">Middle (Class 6 to 8)</option>
                  <option value="Secondary">Secondary (Class 9 to 10)</option>
                  <option value="Sr. Secondary">Sr. Secondary (Class 11 to 12)</option>
                </select>
              </div>

              {/* Has Sections toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingClass.hasSections}
                    onChange={(e) => setEditingClass({ ...editingClass, hasSections: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="font-bold text-slate-800 text-xs">Class has sections (A, B, etc.)</span>
                </label>

                {editingClass.hasSections && (
                  <div>
                    <label className="block text-slate-500 font-medium mb-1">Sections (comma separated):</label>
                    <input
                      type="text"
                      value={editingClass.sectionsStr}
                      onChange={(e) => setEditingClass({ ...editingClass, sectionsStr: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-blue-700"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Appointed Head Class Teacher</label>
                <select
                  value={editingClass.classTeacherId || ''}
                  onChange={(e) => setEditingClass({ ...editingClass, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium text-slate-800"
                >
                  <option value="">-- No Teacher Assigned --</option>
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {tch.name} ({tch.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditClassModalOpen(false);
                    setEditingClass(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
                >
                  Update Class Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD SECTION TO OPENED CLASS */}
      {isAddSectionModalOpen && openedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddSectionModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Add Section to {openedClass.name}</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Create a new section (e.g. C, D) and appoint its Section Teacher.</p>

            <form onSubmit={handleAddSectionToClass} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Section Identifier *</label>
                <input
                  type="text"
                  required
                  value={newSectionData.sectionName}
                  onChange={(e) => setNewSectionData({ ...newSectionData, sectionName: e.target.value })}
                  placeholder="e.g. C / D / Rose / Science"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none font-bold text-emerald-800 text-sm uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Appointed Section Teacher *</label>
                <select
                  value={newSectionData.sectionTeacherId}
                  onChange={(e) => setNewSectionData({ ...newSectionData, sectionTeacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white font-medium text-slate-800"
                >
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {tch.name} ({tch.subject})
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  This teacher will be the dedicated Class In-Charge of this new section.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSectionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm"
                >
                  Add Section (सहेजें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CLASS / SECTION TIMETABLE MODAL */}
      {timetableTarget && (
        <TimetableModal
          className={timetableTarget.className}
          section={timetableTarget.section}
          teachers={teachers}
          isEditable={true}
          onClose={() => setTimetableTarget(null)}
        />
      )}
    </div>
  );
}
