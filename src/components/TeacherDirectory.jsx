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
  Printer
} from 'lucide-react';

export default function TeacherDirectory({
  teachers,
  onAddTeacher,
  t
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    designation: 'TGT Subject Teacher',
    subject: 'Mathematics',
    phone: '',
    email: '',
    qualification: 'M.Sc., B.Ed.',
    experience: '5 Years',
    classInCharge: 'Class 10-B',
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
      classInCharge: 'Class 10-B',
      gender: 'Female'
    });
  };

  const filteredTeachers = teachers.filter((tch) => {
    return (
      !searchTerm ||
      tch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tch.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tch.phone.includes(searchTerm) ||
      (tch.classInCharge && tch.classInCharge.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.navTeachers} (शिक्षक व कर्मचारी निर्देशिका)</h2>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              {teachers.length} Faculty Members
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official teacher roster with direct mobile numbers ("Teacher No"), subject specializations, qualifications, and class in-charge assignments.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search teacher, phone, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl text-xs outline-none w-56 md:w-64"
            />
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition no-print"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Roster</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.addNewTeacher}</span>
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((tch) => (
          <div
            key={tch.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-extrabold text-lg flex items-center justify-center shadow-xs shrink-0">
                    {tch.name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/, '').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">{tch.name}</h3>
                    <p className="text-xs text-emerald-700 font-semibold">{tch.designation}</p>
                  </div>
                </div>
              </div>

              {/* Badges / Subject */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
                  {tch.subject}
                </span>
                <span className="text-[11px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg">
                  Class: {tch.classInCharge}
                </span>
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
                    className="font-black text-slate-900 tracking-wide text-xs hover:underline"
                  >
                    {tch.phone}
                  </a>
                </div>

                <div className="flex items-center justify-between text-slate-600 px-1">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Mail className="w-3.5 h-3.5" /> Email:
                  </span>
                  <span className="font-medium text-slate-700 truncate max-w-[180px]">{tch.email}</span>
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
                href={`https://wa.me/${tch.phone.replace(/[^0-9]/g, '')}`}
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

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
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
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.subject} *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Mathematics / Science..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.designation}</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="PGT / TGT / PRT Teacher"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Class In-charge</label>
                  <input
                    type="text"
                    value={formData.classInCharge}
                    onChange={(e) => setFormData({ ...formData, classInCharge: e.target.value })}
                    placeholder="e.g. Class 10-A"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.experience}</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 6 Years"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{t.email}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@school.edu.in"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="M.Sc., B.Ed."
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
                  Save & Add Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
