import React, { useState } from 'react';
import {
  BellRing,
  Calendar,
  Plus,
  AlertCircle,
  Tag,
  Clock,
  X,
  Share2,
  Smartphone,
  CheckCircle2,
  Users,
  Pencil,
  Trash2,
  Save
} from 'lucide-react';

export default function NoticeBoard({
  notices = [],
  onAddNotice,
  onUpdateNotice,
  onDeleteNotice,
  t
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    priority: 'Normal',
    targetAudience: 'All School',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Please enter title and description.");
      return;
    }

    const newNotice = {
      ...formData,
      id: `NOT-${Date.now().toString().slice(-4)}`
    };

    if (onAddNotice) {
      onAddNotice(newNotice);
    }
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      category: 'Academic',
      priority: 'Normal',
      targetAudience: 'All School',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleStartEdit = (notice) => {
    setEditingNotice({ ...notice });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingNotice.title || !editingNotice.description) {
      alert("Please provide notice title and description.");
      return;
    }

    if (onUpdateNotice) {
      onUpdateNotice(editingNotice);
    }
    setIsEditModalOpen(false);
    setEditingNotice(null);
  };

  const handleDelete = (notice) => {
    if (window.confirm(`⚠️ क्या आप वाकई यह सूचना "${notice.title}" हटाना चाहते हैं?\n\nAre you sure you want to delete this notice circular?`)) {
      if (onDeleteNotice) {
        onDeleteNotice(notice.id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.navNotices} (सूचना पट्ट व परिपत्र)</h2>
            <span className="text-xs font-bold bg-[#05574F]/10 text-[#05574F] px-2.5 py-0.5 rounded-full">
              {notices.length} Published
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official announcements, examination schedules, fee reminders, PTM meetings, and holiday circulars. You can edit, delete, or broadcast to parents via WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#05574F] hover:bg-[#076c62] text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4 text-[#FDBE3E]" />
          <span>Post New Circular (नयी सूचना जारी करें)</span>
        </button>
      </div>

      {/* Notices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2 flex-wrap gap-1">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                  notice.priority === 'High'
                    ? 'bg-red-100 text-red-700'
                    : notice.priority === 'Medium'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {notice.category} • {notice.priority} Priority
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                  🎯 {notice.targetAudience || 'All School'}
                </span>
                <span className="flex items-center gap-1 font-medium text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  {notice.date}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-base leading-snug">{notice.title}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleStartEdit(notice)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                    title="सूचना संपादित करें (Edit Notice)"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(notice)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="सूचना हटाएं (Delete Notice)"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">{notice.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>लाइव पेरेंट्स पोर्टल पर प्रेषित</span>
              </span>

              {/* 1-Click WhatsApp Broadcast Button */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `🏫 *स्कूल आवश्यक सूचना (Official School Circular)*\n━━━━━━━━━━━━━━━━━━━━\n📌 *${notice.title}*\n🎯 किसके लिए: *${notice.targetAudience || 'सभी विद्यार्थी व अभिभावक'}*\n📅 दिनांक: ${notice.date}\n\n${notice.description}\n\n📲 *स्कूल ऐप पर देखने व पुष्टि हेतु लिंक:* \nhttps://abhi420m.github.io/school-app/?portal=parent`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-[11px] flex items-center gap-1.5 transition shadow-xs"
                title="Broadcast this circular directly to Parents WhatsApp Group"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp पर भेजें (1-Click)</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Post New School Circular (नयी सूचना जारी करें)</h3>
            <p className="text-xs text-slate-500 mb-4">Announce important updates directly to parents and staff.</p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Notice Title (सूचना का शीर्षक) *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Sports Day / Fee Clearance Reminder"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category (श्रेणी)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white"
                  >
                    <option value="Academic">Academic (शैक्षणिक)</option>
                    <option value="Examination">Examination (परीक्षा)</option>
                    <option value="Holiday">Holiday (अवकाश)</option>
                    <option value="Fees">Fees & Accounts (शुल्क)</option>
                    <option value="Sports">Sports & Events (खेलकूद)</option>
                    <option value="General">General Notice (सामान्य)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Priority (प्राथमिकता)</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target Audience (किसके लिए)</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white"
                  >
                    <option value="All School">All School (पूरा स्कूल)</option>
                    <option value="Parents Only">Parents Only (अभिभावक)</option>
                    <option value="Students Only">Students Only (विद्यार्थी)</option>
                    <option value="Primary Wing">Primary Wing (Classes 1-5)</option>
                    <option value="Middle Wing">Middle Wing (Classes 6-8)</option>
                    <option value="Secondary Wing">Secondary Wing (Classes 9-10)</option>
                    <option value="Sr. Secondary Wing">Sr. Secondary Wing (Classes 11-12)</option>
                    <option value="Faculty & Staff">Faculty & Staff (शिक्षक)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Notice Date (दिनांक)</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Notice Details (विस्तृत विवरण) *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter complete notice circular details..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#05574F] hover:bg-[#076c62] text-white font-bold shadow-sm"
                >
                  Publish Circular (प्रकाशित करें)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Notice Modal */}
      {isEditModalOpen && editingNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs modal-backdrop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingNotice(null);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Edit School Circular (सूचना संपादित करें)</h3>
            <p className="text-xs text-slate-500 mb-4">Modify circular details. Changes will update live for parents.</p>

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={editingNotice.title}
                  onChange={(e) => setEditingNotice({ ...editingNotice, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={editingNotice.category}
                    onChange={(e) => setEditingNotice({ ...editingNotice, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white"
                  >
                    <option value="Academic">Academic (शैक्षणिक)</option>
                    <option value="Examination">Examination (परीक्षा)</option>
                    <option value="Holiday">Holiday (अवकाश)</option>
                    <option value="Fees">Fees & Accounts (शुल्क)</option>
                    <option value="Sports">Sports & Events (खेलकूद)</option>
                    <option value="General">General Notice (सामान्य)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Priority</label>
                  <select
                    value={editingNotice.priority}
                    onChange={(e) => setEditingNotice({ ...editingNotice, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target Audience</label>
                  <select
                    value={editingNotice.targetAudience || 'All School'}
                    onChange={(e) => setEditingNotice({ ...editingNotice, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none bg-white"
                  >
                    <option value="All School">All School (पूरा स्कूल)</option>
                    <option value="Parents Only">Parents Only (अभिभावक)</option>
                    <option value="Students Only">Students Only (विद्यार्थी)</option>
                    <option value="Primary Wing">Primary Wing (Classes 1-5)</option>
                    <option value="Middle Wing">Middle Wing (Classes 6-8)</option>
                    <option value="Secondary Wing">Secondary Wing (Classes 9-10)</option>
                    <option value="Sr. Secondary Wing">Sr. Secondary Wing (Classes 11-12)</option>
                    <option value="Faculty & Staff">Faculty & Staff (शिक्षक)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Notice Date</label>
                  <input
                    type="date"
                    required
                    value={editingNotice.date}
                    onChange={(e) => setEditingNotice({ ...editingNotice, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Notice Details *</label>
                <textarea
                  required
                  rows={4}
                  value={editingNotice.description}
                  onChange={(e) => setEditingNotice({ ...editingNotice, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-600 outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingNotice(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#05574F] hover:bg-[#076c62] text-white font-bold shadow-sm flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-[#FDBE3E]" />
                  <span>Update Circular (अपडेट करें)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
