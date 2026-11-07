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
  Users
} from 'lucide-react';

export default function NoticeBoard({
  notices,
  onAddNotice,
  t
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

    onAddNotice(newNotice);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{t.navNotices} (सूचना पट्ट व परिपत्र)</h2>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {notices.length} Published
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official announcements, examination schedules, PTM meetings, and holiday circulars for parents and staff.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Circular</span>
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

              <h3 className="font-bold text-slate-900 text-base leading-snug">{notice.title}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{notice.description}</p>
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

            <h3 className="text-lg font-bold text-slate-900 mb-1">Post New School Circular</h3>
            <p className="text-xs text-slate-500 mb-4">Announce important updates directly to parents and staff.</p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Winter Vacation Notice 2026"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white text-xs font-medium"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Accounts">Accounts / Fee</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white text-xs font-medium"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High (Urgent)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target Class</label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    className="w-full px-2 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white text-xs font-bold text-blue-800"
                  >
                    <option value="All School">पूरा स्कूल (All School)</option>
                    <option value="Class 1">Class 1</option>
                    <option value="Class 2">Class 2</option>
                    <option value="Class 3">Class 3</option>
                    <option value="Class 4">Class 4</option>
                    <option value="Class 5">Class 5</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description / Content *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Details of the circular..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
                ></textarea>
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
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
