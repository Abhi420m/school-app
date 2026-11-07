import React, { useState } from 'react';
import {
  School,
  X,
  Save,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Shield,
  Palette,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';

export default function SchoolSettingsModal({
  school,
  onSave,
  onClose
}) {
  const [formData, setFormData] = useState({
    name: school?.name || '',
    code: school?.code || '',
    board: school?.board || 'CBSE',
    principal: school?.principal || '',
    phone: school?.phone || '',
    email: school?.email || '',
    address: school?.address || '',
    city: school?.city || '',
    state: school?.state || '',
    established: school?.established || '2005',
    session: school?.session || '2026-2027',
    badgeColor: school?.badgeColor || 'from-[#05574F] to-teal-700',
    theme: school?.theme || 'emerald',
    logoUrl: school?.logoUrl || ''
  });

  const [previewLogo, setPreviewLogo] = useState(school?.logoUrl || '');

  const themeOptions = [
    { label: 'Emerald & Teal (#05574F)', theme: 'emerald', color: 'from-[#05574F] to-teal-700' },
    { label: 'Royal Blue & Indigo', theme: 'blue', color: 'from-blue-700 to-indigo-600' },
    { label: 'Navy & Slate', theme: 'navy', color: 'from-slate-900 to-blue-950' },
    { label: 'Golden Amber & Orange', theme: 'amber', color: 'from-amber-600 to-orange-600' },
    { label: 'Purple & Violet', theme: 'purple', color: 'from-purple-700 to-indigo-700' },
    { label: 'Crimson Red', theme: 'crimson', color: 'from-rose-700 to-red-800' }
  ];

  // Handle Logo Upload (Base64 file reader)
  const handleLogoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("कृपया एक मान्य फोटो या लोगो इमेज (PNG/JPG/WEBP) चुनें।");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("लोगो इमेज का साइज़ 2MB से कम होना चाहिए।");
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Url = uploadEvent.target.result;
      setPreviewLogo(base64Url);
      setFormData((prev) => ({ ...prev, logoUrl: base64Url }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setPreviewLogo('');
    setFormData((prev) => ({ ...prev, logoUrl: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please provide the School Name.");
      return;
    }

    const updatedSchool = {
      ...school,
      ...formData,
      logoUrl: previewLogo || null,
      affiliation: `Affiliated to ${formData.board} | Affiliation Code: ${formData.code}`
    };

    onSave(updatedSchool);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${formData.badgeColor} text-white flex items-center justify-center shadow-md shrink-0 overflow-hidden p-0.5`}>
            {previewLogo ? (
              <img src={previewLogo} alt="Logo" className="w-full h-full object-contain rounded-xl bg-white" />
            ) : (
              <School className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
              School Profile & Logo Upload (स्कूल विवरण व लोगो)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Update school branding, upload custom logo, change affiliation code, board, phone numbers, and theme.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Logo Upload Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="block text-slate-700 font-bold mb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>School Logo / Photo Upload (स्कूल का लोगो या फोटो अपलोड करें)</span>
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {previewLogo ? (
                  <img src={previewLogo} alt="Preview Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <School className="w-8 h-8 text-slate-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="school-logo-input"
                    className="px-3.5 py-2 rounded-xl bg-[#05574F] hover:bg-[#076c62] text-white font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5 text-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FDBE3E]" />
                    <span>{previewLogo ? 'लोगो बदलें (Change Logo)' : 'लोगो अपलोड करें (Upload Logo)'}</span>
                  </label>
                  <input
                    id="school-logo-input"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  {previewLogo && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold transition flex items-center gap-1 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>हटाएं (Remove)</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  यह लोगो सभी रिपोर्ट कार्ड, मार्कशीट, फीस रसीद और स्कूल पोर्टल के नेवबार पर दिखाई देगा। (PNG, JPG, max 2MB)
                </p>
              </div>
            </div>
          </div>

          {/* Row 1: School Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              Official School Name (स्कूल का पूरा नाम) *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Delhi Public School / Saraswati Vidya Mandir"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none font-semibold text-slate-900 text-sm"
            />
          </div>

          {/* Row 2: Code & Board */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Affiliation / School Code (संबद्धता कोड)
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. CBSE-20491 / RAJ-88192"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Education Board (शिक्षा बोर्ड)
              </label>
              <select
                value={formData.board}
                onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white font-semibold text-slate-800"
              >
                <option value="CBSE">CBSE (Central Board)</option>
                <option value="ICSE">ICSE / ISC</option>
                <option value="State Board">State Education Board (राज्य बोर्ड)</option>
                <option value="IB">IB (International Baccalaureate)</option>
                <option value="Cambridge">Cambridge / IGCSE</option>
                <option value="Open Board">NIOS / Open Board</option>
              </select>
            </div>
          </div>

          {/* Row 3: Principal & Session */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Principal / Director Name (प्रधानाचार्य का नाम)
              </label>
              <input
                type="text"
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                placeholder="e.g. Dr. Rajesh Sharma / Mrs. Sunita Rao"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Current Academic Session (सत्र)
              </label>
              <input
                type="text"
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                placeholder="e.g. 2026-2027"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none font-mono"
              />
            </div>
          </div>

          {/* Row 4: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Official Helpline Phone (स्कूल का फोन नंबर) *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 11-28934500 / +91 98765 00000"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Official Email Address (स्कूल ईमेल)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@school.edu.in"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Row 5: Address, City, State */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-semibold mb-1">
                Campus Address (स्कूल का पूरा पता)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Plot 12, Main Road, Near Civil Hospital"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                City / Town (शहर)
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Jaipur / Delhi / Patna"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          {/* Row 6: Theme Color Branding */}
          <div className="pt-2">
            <label className="block text-slate-700 font-bold mb-2 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-emerald-600" />
              School Theme & Crest Color (स्कूल का थीम रंग)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {themeOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.theme}
                  onClick={() => setFormData({ ...formData, badgeColor: opt.color, theme: opt.theme })}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition ${
                    formData.theme === opt.theme
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${opt.color} shrink-0 shadow-xs`} />
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Save & Cancel */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition"
            >
              Cancel (रद्द करें)
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#05574F] hover:bg-[#076c62] text-white font-black shadow-md transition flex items-center gap-2 active:scale-98"
            >
              <Save className="w-4 h-4 text-[#FDBE3E]" />
              <span>Save School Details (सहेजें)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
