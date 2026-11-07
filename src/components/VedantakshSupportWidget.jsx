import React, { useState } from 'react';
import {
  Headphones,
  X,
  PhoneCall,
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function VedantakshSupportWidget({ currentRole, schoolName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  const [formData, setFormData] = useState({
    userType: currentRole === 'parent' ? 'Parent / Student' : 'School Management',
    name: '',
    phone: '',
    issueCategory: 'General Inquiry',
    description: ''
  });

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("कृपया अपना नाम और मोबाइल नंबर अवश्य दर्ज करें।");
      return;
    }

    const ticketId = `VT-TICKET-${Date.now().toString().slice(-5)}`;
    setGeneratedTicketId(ticketId);
    setTicketSubmitted(true);
  };

  const handleReset = () => {
    setTicketSubmitted(false);
    setFormData({
      userType: currentRole === 'parent' ? 'Parent / Student' : 'School Management',
      name: '',
      phone: '',
      issueCategory: 'General Inquiry',
      description: ''
    });
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating 24x7 Action Pill in Bottom Right Corner */}
      <div className="fixed bottom-5 right-5 z-40 no-print">
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-slate-950 via-[#05574F] to-emerald-800 text-white font-extrabold text-xs shadow-2xl hover:shadow-emerald-900/40 border-2 border-[#FDBE3E]/60 hover:scale-105 active:scale-95 transition-all"
          title="Vedantaksh Technology 24x7 Customer Support & Helpdesk"
        >
          <div className="relative">
            <Headphones className="w-4 h-4 text-[#FDBE3E] animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-ping"></span>
          </div>
          <span className="tracking-wide">24x7 Support | Vedantaksh Technology</span>
        </button>
      </div>

      {/* 24x7 Support Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs no-print overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-[#05574F] to-slate-900 text-white p-5 sm:p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FDBE3E] text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Official 24x7 Enterprise Helpdesk
                </span>
              </div>

              <h3 className="text-xl font-black tracking-tight text-white">
                Vedantaksh Technology Support
              </h3>
              <p className="text-xs text-emerald-200 mt-1">
                वेदांताक्ष टेक्नोलॉजी • 24 घंटे सातों दिन तकनीकी एवं पोर्टल सहायता
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 text-slate-800">
              
              {!ticketSubmitted ? (
                <>
                  {/* Quick Channels Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href="tel:+917454996566"
                      className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-200 flex flex-col justify-between transition group"
                    >
                      <div className="flex items-center justify-between">
                        <PhoneCall className="w-4 h-4 text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.5 rounded">24x7 Call</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-[10px] text-slate-500 block">हेल्पलाइन नंबर:</span>
                        <span className="font-black text-sm text-emerald-900 font-mono">+91 74549 96566</span>
                      </div>
                    </a>

                    <a
                      href={`https://api.whatsapp.com/send?phone=917454996566&text=${encodeURIComponent(
                        `नमस्ते Vedantaksh Technology Support टीम, मुझे VidyaSetu School & Parent Portal (${schoolName || 'School App'}) में सहायता चाहिए।`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl bg-green-50 hover:bg-green-100 text-green-950 border border-green-200 flex flex-col justify-between transition group"
                    >
                      <div className="flex items-center justify-between">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="text-[10px] font-bold text-green-700 bg-green-200/60 px-1.5 py-0.5 rounded">WhatsApp</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-[10px] text-slate-500 block">व्हाट्सएप सपोर्ट:</span>
                        <span className="font-black text-sm text-green-900 font-mono">Chat on WhatsApp →</span>
                      </div>
                    </a>
                  </div>

                  {/* Email Support Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Official Support Email:</span>
                        <span className="font-mono font-bold text-slate-800">support@vedantakshtechnology.com</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Avg. 5 Min Reply
                    </span>
                  </div>

                  {/* Fast Ticket Generation Form */}
                  <form onSubmit={handleSubmitTicket} className="space-y-3 pt-2 border-t border-slate-100 text-xs">
                    <p className="font-extrabold text-slate-900 text-xs">
                      तत्काल सहायता टिकट दर्ज करें (Generate Support Ticket):
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">आपका नाम *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="उदा. राहुल शर्मा"
                          className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-emerald-600 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">मोबाइल नंबर *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="98XXXXXXXX"
                          className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-emerald-600 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">आप कौन हैं?</label>
                        <select
                          value={formData.userType}
                          onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                          className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none font-bold cursor-pointer"
                        >
                          <option value="Parent / Student">अभिभावक / छात्र (Parent/Student)</option>
                          <option value="School Management">स्कूल स्टाफ / प्रबंधन (School Staff)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">समस्या का प्रकार</label>
                        <select
                          value={formData.issueCategory}
                          onChange={(e) => setFormData({ ...formData, issueCategory: e.target.value })}
                          className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none font-bold cursor-pointer"
                        >
                          <option value="Login Issue">लॉगिन समस्या (Login Issue)</option>
                          <option value="Report Card / Marksheet">मार्कशीट व रिजल्ट (Report Card)</option>
                          <option value="Fee Payment / Receipt">फीस रसीद व बकाया (Fees/Receipt)</option>
                          <option value="Attendance Register">हाजिरी रजिस्टर (Attendance)</option>
                          <option value="Timetable & Homework">टाइम टेबल व गृहकार्य</option>
                          <option value="Other">अन्य सहायता (General Assistance)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">समस्या का संक्षिप्त विवरण</label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="अपनी समस्या यहाँ लिखें..."
                        className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-emerald-600 font-medium resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#05574F] hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <Send className="w-3.5 h-3.5 text-[#FDBE3E]" />
                      <span>सहायता टिकट भेजें (Submit Ticket)</span>
                    </button>
                  </form>
                </>
              ) : (
                /* Ticket Success View */
                <div className="py-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-slate-900">
                      सहायता टिकट सफलतापूर्वक दर्ज हो गया है!
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Ticket Reference ID: <strong className="font-mono text-emerald-700 text-sm">{generatedTicketId}</strong>
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1 text-left">
                    <p className="font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>अनुमानित रिस्पॉन्स समय: 5 मिनट के भीतर</span>
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      वेदांताक्ष टेक्नोलॉजी की टेक्निकल टीम आपके मोबाइल नंबर <strong>{formData.phone}</strong> पर कॉल या व्हाट्सएप के माध्यम से तुरंत संपर्क करेगी।
                    </p>
                  </div>

                  <button
                    onClick={handleReset}
                    className="px-6 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                  >
                    ठीक है (Done)
                  </button>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Vedantaksh Technology Pvt Ltd • 24x7 SLA</span>
              </span>
              <span>ISO 27001 Certified Security</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}