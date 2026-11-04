import React, { useState } from 'react';
import {
  School,
  Plus,
  Search,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  User,
  GraduationCap,
  Users,
  Contact,
  ArrowRight,
  ShieldCheck,
  X,
  Sparkles,
  Award
} from 'lucide-react';

export default function SchoolRegistry({
  schools,
  activeSchoolId,
  allData,
  onSelectSchool,
  onRegisterSchool,
  setActiveTab,
  t
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Form State for New School Registration
  const [formData, setFormData] = useState({
    name: '',
    code: `CBSE-${Math.floor(10000 + Math.random() * 90000)}`,
    board: 'CBSE',
    principal: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Delhi',
    established: new Date().getFullYear().toString(),
    theme: 'blue'
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.principal || !formData.phone) {
      alert("Please fill in School Name, Principal Name, and Contact Phone.");
      return;
    }

    const affiliation = `${formData.board === 'CBSE' ? 'Affiliated to CBSE, New Delhi' : `${formData.board} Recognized`} | Code: ${formData.code}`;
    
    onRegisterSchool({
      ...formData,
      affiliation
    });

    setIsRegisterModalOpen(false);
    setFormData({
      name: '',
      code: `CBSE-${Math.floor(10000 + Math.random() * 90000)}`,
      board: 'CBSE',
      principal: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: 'Delhi',
      established: new Date().getFullYear().toString(),
      theme: 'blue'
    });
  };

  const filteredSchools = schools.filter((sch) => {
    return (
      !searchTerm ||
      sch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sch.board.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Centralized Multi-School SaaS Management (मल्टी-स्कूल रजिस्ट्री)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Register & Manage Multiple Schools (अलग-अलग स्कूल रजिस्टर करें)
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Easily register new schools, colleges, or branches. Each school gets an entirely separate, isolated database for classes, students, teachers, attendance registers, and report cards with dedicated Parent Portals.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.registerNewSchool} (+ नया स्कूल जोड़ें)</span>
            </button>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Filter and Stats Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            {t.schoolsRegistry} ({schools.length} Schools)
          </h3>
          <p className="text-xs text-slate-500">Click on any school to switch into its dashboard and live portal.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by school, city, board..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs outline-none w-60"
            />
          </div>

          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add School</span>
          </button>
        </div>
      </div>

      {/* Schools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((sch) => {
          const schData = allData[sch.id] || { students: [], teachers: [], classes: [] };
          const isActive = sch.id === activeSchoolId;

          return (
            <div
              key={sch.id}
              className={`rounded-3xl border transition-all p-6 flex flex-col justify-between relative bg-white ${
                isActive
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Active Badge */}
              {isActive && (
                <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-blue-200">
                  <CheckCircle2 className="w-3 h-3 text-blue-600" /> ACTIVE CAMPUS
                </div>
              )}

              <div>
                {/* Header with School Crest */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${sch.badgeColor || 'from-blue-700 to-indigo-600'} text-white flex items-center justify-center shadow-md shrink-0 font-black text-xl`}>
                    <School className="w-7 h-7" />
                  </div>
                  <div className="pr-16">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {sch.board} • Code: {sch.code}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base mt-1 leading-snug">
                      {sch.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {sch.city}, {sch.state}
                    </p>
                  </div>
                </div>

                {/* Details & Key Metrics */}
                <div className="space-y-2 text-xs py-3 border-y border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Principal:
                    </span>
                    <span className="font-bold text-slate-800">{sch.principal}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Phone:
                    </span>
                    <a href={`tel:${sch.phone}`} className="font-bold text-blue-600 hover:underline">
                      {sch.phone}
                    </a>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> Email:
                    </span>
                    <span className="font-medium text-slate-700 truncate max-w-[170px]">{sch.email}</span>
                  </div>
                </div>

                {/* Enrolled Stats */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Enrolled Students</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 inline-flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      {schData.students?.length || 0}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty Members</span>
                    <span className="text-lg font-black text-slate-900 mt-0.5 inline-flex items-center gap-1">
                      <Contact className="w-4 h-4 text-emerald-600" />
                      {schData.teachers?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isActive ? (
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-100 transition"
                  >
                    <span>Currently Managing • Go to Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onSelectSchool(sch.id);
                      setActiveTab('dashboard');
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <span>Switch to this School (इस स्कूल में जाएं)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Register New School Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">{t.registerNewSchool}</h3>
                <p className="text-xs text-slate-500">Fill in the school credentials to establish a new school campus portal.</p>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.schoolName} *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cambridge International Public School"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.educationBoard} *</label>
                  <select
                    value={formData.board}
                    onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white text-xs"
                  >
                    <option value="CBSE">CBSE (Central Board)</option>
                    <option value="ICSE">ICSE / ISC Board</option>
                    <option value="State Board">State Board</option>
                    <option value="Cambridge">Cambridge / IGCSE</option>
                    <option value="IB">International Baccalaureate (IB)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.schoolCode} *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. CBSE-88201"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.principalName} *</label>
                  <input
                    type="text"
                    required
                    value={formData.principal}
                    onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                    placeholder="e.g. Dr. Sudhir Saxena"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.schoolPhone} *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.schoolEmail}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@school.edu.in"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.city} *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai / Jaipur / Delhi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">{t.schoolAddress}</label>
                <textarea
                  rows="2"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Plot/Sector number, Institutional Area..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Color Theme / Badge Style</label>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'blue', label: 'Blue Theme', class: 'bg-blue-600' },
                    { id: 'emerald', label: 'Emerald Green', class: 'bg-emerald-600' },
                    { id: 'purple', label: 'Purple Theme', class: 'bg-purple-600' },
                    { id: 'amber', label: 'Amber Gold', class: 'bg-amber-600' }
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme: thm.id })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                        formData.theme === thm.id
                          ? 'border-slate-800 bg-slate-100 text-slate-900 shadow-xs'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${thm.class}`}></span>
                      <span>{thm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Register School (स्कूल रजिस्टर करें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
