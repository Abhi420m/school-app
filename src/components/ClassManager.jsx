import React, { useState } from 'react';
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
  CheckCircle2
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const [formData, setFormData] = useState({
    name: 'Class 1',
    stream: 'Primary',
    sectionsStr: 'A, B',
    classTeacherId: teachers[0]?.id || ''
  });

  const streams = ['All', 'Pre-Primary', 'Primary', 'Middle', 'Secondary', 'Sr. Secondary'];

  const filteredClasses = selectedStream === 'All'
    ? classes
    : classes.filter(c => c.stream === selectedStream);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter a class name.");
      return;
    }

    const sections = formData.sectionsStr
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    const newClass = {
      id: `C${Date.now().toString().slice(-3)}`,
      name: formData.name.trim(),
      stream: formData.stream,
      sections: sections.length > 0 ? sections : ['A'],
      classTeacherId: formData.classTeacherId || null
    };

    if (onAddClass) {
      onAddClass(newClass);
    }
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      stream: 'Primary',
      sectionsStr: 'A, B',
      classTeacherId: teachers[0]?.id || ''
    });
  };

  const handleStartEdit = (cls) => {
    setEditingClass({
      ...cls,
      sectionsStr: (cls.sections || []).join(', ')
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingClass.name.trim()) {
      alert("Please enter a class name.");
      return;
    }

    const sections = editingClass.sectionsStr
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    const updated = {
      ...editingClass,
      name: editingClass.name.trim(),
      sections: sections.length > 0 ? sections : ['A']
    };
    delete updated.sectionsStr;

    if (onUpdateClass) {
      onUpdateClass(updated);
    }
    setIsEditModalOpen(false);
    setEditingClass(null);
  };

  const handleDelete = (cls) => {
    const studentCount = students.filter(s => s.className === cls.name).length;
    const confirmMsg = `⚠️ क्या आप वाकई "${cls.name}" को हटाना चाहते हैं?${studentCount > 0 ? `\n(इस कक्षा में ${studentCount} छात्र नामांकित हैं)` : ''}\n\nAre you sure you want to delete this class?`;
    if (window.confirm(confirmMsg)) {
      if (onDeleteClass) {
        onDeleteClass(cls.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Classes & Sections (कक्षाएं एवं अनुभाग)</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
              {classes.length} Total Grades
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            School curriculum grade levels, add new classes, configure custom sections (A, B, C, D), and appoint class teachers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Stream Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Class (नई कक्षा जोड़ें)</span>
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const classStudents = students.filter(s => s.className === cls.name);
          const teacher = teachers.find(t => t.id === cls.classTeacherId);
          
          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {cls.stream} School
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">{cls.name}</h3>
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(cls)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="Edit Class Details / अनुभाग बदलें"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cls)}
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
                    <span className="text-slate-500 font-medium">Sections:</span>
                    <div className="flex gap-1 flex-wrap">
                      {(cls.sections || ['A']).map((sec) => (
                        <span key={sec} className="bg-blue-50 text-blue-800 border border-blue-200 font-bold px-2 py-0.5 rounded text-xs">
                          Sec {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Enrolled Students:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {classStudents.length} Students
                    </span>
                  </div>

                  {/* Class Teacher */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Appointed Class Teacher</p>
                    {teacher ? (
                      <div className="mt-1 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{teacher.name}</p>
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

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    onSelectClassFilter(cls.name);
                    setActiveTab('students');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition"
                >
                  View Students <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    onSelectClassFilter(cls.name);
                    setActiveTab('attendance');
                  }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >
                  Mark Hazri
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT CLASS MODAL */}
      {isEditModalOpen && editingClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingClass(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Edit Class (कक्षा विवरण बदलें)</h3>
            <p className="text-xs text-slate-500 mb-4">Update grade name, sections, stream, or appointed class teacher.</p>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({ ...editingClass, name: e.target.value })}
                  placeholder="e.g. Class 10 / Nursery / LKG"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">School Level / Stream</label>
                <select
                  value={editingClass.stream}
                  onChange={(e) => setEditingClass({ ...editingClass, stream: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="Pre-Primary">Pre-Primary (Nursery, LKG, UKG)</option>
                  <option value="Primary">Primary (Class 1 to 5)</option>
                  <option value="Middle">Middle (Class 6 to 8)</option>
                  <option value="Secondary">Secondary (Class 9 to 10)</option>
                  <option value="Sr. Secondary">Sr. Secondary (Class 11 to 12)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Sections (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={editingClass.sectionsStr}
                  onChange={(e) => setEditingClass({ ...editingClass, sectionsStr: e.target.value })}
                  placeholder="e.g. A, B, C, D"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-blue-700"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Separate sections with commas (e.g. A, B, C)</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Appointed Class Teacher</label>
                <select
                  value={editingClass.classTeacherId || ''}
                  onChange={(e) => setEditingClass({ ...editingClass, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium text-slate-800"
                >
                  <option value="">-- No Class Teacher Assigned --</option>
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
                    setIsEditModalOpen(false);
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

      {/* ADD CLASS MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Class (नई कक्षा जोड़ें)</h3>
            <p className="text-xs text-slate-500 mb-4">Create a new class or grade level and define its sections.</p>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Nursery / LKG / Class 1 / Class 11-Arts"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">School Level / Stream</label>
                <select
                  value={formData.stream}
                  onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="Pre-Primary">Pre-Primary (Nursery, LKG, UKG)</option>
                  <option value="Primary">Primary (Class 1 to 5)</option>
                  <option value="Middle">Middle (Class 6 to 8)</option>
                  <option value="Secondary">Secondary (Class 9 to 10)</option>
                  <option value="Sr. Secondary">Sr. Secondary (Class 11 to 12)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Sections (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={formData.sectionsStr}
                  onChange={(e) => setFormData({ ...formData, sectionsStr: e.target.value })}
                  placeholder="e.g. A, B, C"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-bold text-blue-700"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Separate sections with commas (e.g. A, B, C)</span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Appointed Class Teacher</label>
                <select
                  value={formData.classTeacherId}
                  onChange={(e) => setFormData({ ...formData, classTeacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium text-slate-800"
                >
                  <option value="">-- No Class Teacher Assigned --</option>
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
                  onClick={() => setIsAddModalOpen(false)}
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
    </div>
  );
}
