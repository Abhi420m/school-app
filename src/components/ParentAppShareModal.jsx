import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Printer,
  Smartphone,
  CheckCircle2,
  QrCode,
  Users,
  Search,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function ParentAppShareModal({
  activeSchool,
  students = [],
  onClose
}) {
  const [activeTab, setActiveTab] = useState('whatsapp'); // 'whatsapp' | 'qr' | 'students'
  const [copiedLink, setCopiedLink] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentForSlip, setSelectedStudentForSlip] = useState(students[0] || null);

  // Compute live absolute Parent App Portal URL
  const baseUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://abhi420m.github.io/school-app/';
  const parentPortalUrl = `${baseUrl.replace(/\/$/, '')}/?portal=parent`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(parentPortalUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const whatsappBroadcastText = encodeURIComponent(
`🏫 *${activeSchool?.name || "विद्यासेतु विद्यालय"}*
━━━━━━━━━━━━━━━━━━
प्रिय अभिभावक (Dear Parents),
सादर नमस्कार।

हमारे विद्यालय का आधिकारिक *विद्यार्थी एवं अभिभावक मोबाइल ऐप (VidyaSetu Parent App)* लॉन्च हो गया है। अब आप अपने बच्चे की सम्पूर्ण शैक्षणिक प्रगति अपने फोन पर देख सकते हैं:

✅ *दैनिक हाजिरी (Daily Live Attendance)*
✅ *परीक्षा परिणाम व मार्क्सशीट (CBSE Marksheets)*
✅ *फीस रसीद व बकाया विवरण (Fee Receipts & Dues)*
✅ *दैनिक गृहकार्य (Daily Homework)*
✅ *कक्षा टाइम टेबल (Class Timetable)*

📲 *ऐप खोलने व इंस्टॉल करने के लिए लिंक पर क्लिक करें:*
${parentPortalUrl}

🔑 *लॉगिन कैसे करें:*
1️⃣ ऊपर दिए लिंक पर क्लिक करें।
2️⃣ 'Parent / Student' टैब चुनें।
3️⃣ अपना रजिस्टर्ड मोबाइल नंबर या Admission No दर्ज करें।
4️⃣ डिफ़ॉल्ट सुरक्षा पिन दर्ज करें: *123*

💡 *नोट:* ऐप खुलने के बाद ब्राउज़र मेनू से *"Add to Home Screen / Install App"* दबाएं ताकि ऐप आपके मोबाइल स्क्रीन पर सेव हो जाए।

धन्यवाद,
प्रिंसिपल एवं प्रबंधन
*${activeSchool?.name || "स्कूल प्रबंधन"}*`
  );

  const getStudentWhatsAppText = (stu) => {
    return encodeURIComponent(
`🏫 *${activeSchool?.name || "विद्यासेतु विद्यालय"}*
━━━━━━━━━━━━━━━━━━
प्रिय अभिभावक,
छात्र *${stu.name}* (कक्षा: ${stu.className} - Sec ${stu.section}) की शैक्षणिक प्रगति देखने के लिए स्कूल ऐप क्रेडेंशियल्स:

📲 *ऐप लिंक:* ${parentPortalUrl}
🆔 *लॉगिन आईडी (मोबाइल):* ${stu.phone}
🎫 *Admission No:* ${stu.admissionNo}
🔑 *सुरक्षा पिन (PIN):* 123

धन्यवाद,
*${activeSchool?.name || "स्कूल प्रबंधन"}*`
    );
  };

  const filteredStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.rollNo && s.rollNo.toString().includes(q)) ||
      (s.admissionNo && s.admissionNo.toLowerCase().includes(q)) ||
      (s.phone && s.phone.includes(q))
    );
  });

  const handlePrintQR = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm modal-overlay flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 printable-card">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#05574F] to-emerald-800 text-white p-5 sm:p-6 relative no-print">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition no-print"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FDBE3E] text-[#05574F] text-[10px] font-black uppercase tracking-wider">
              Official Parent Distribution Hub
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            अभिभावक ऐप शेयरिंग सेंटर (Share Parent App)
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            {activeSchool?.name} के विद्यार्थियों और अभिभावकों को मोबाइल ऐप आसानी से पहुंचाएं
          </p>

          {/* Tab Switcher */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-black/20 rounded-2xl mt-5 no-print text-xs font-bold">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'whatsapp'
                  ? 'bg-white text-[#05574F] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp शेयर</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'qr'
                  ? 'bg-white text-[#05574F] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR कोड स्टैंडी</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                activeTab === 'students'
                  ? 'bg-white text-[#05574F] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>छात्र लॉगिन पर्ची</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-800">
          
          {/* TAB 1: WHATSAPP BROADCAST */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/60 text-xs text-emerald-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>एक-क्लिक में सभी अभिभावकों को ऐप भेजें</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  नीचे दिए बटन पर क्लिक करके आप सीधे WhatsApp ग्रुप या ब्रॉडकास्ट लिस्ट में पूरा मैसेज और ऐप लिंक भेज सकते हैं। अभिभावक लिंक पर क्लिक करके तुरंत ऐप ओपन कर लेंगे।
                </p>
              </div>

              {/* Direct Parent App Link Box */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  अभिभावक ऐप डायरेक्ट लिंक (Direct Parent Portal URL):
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 truncate select-all">
                    {parentPortalUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* WhatsApp Broadcast Action */}
              <div className="pt-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${whatsappBroadcastText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition"
                >
                  <Share2 className="w-5 h-5" />
                  <span>WhatsApp पर अभिभावकों को ब्रॉडकास्ट भेजें</span>
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#05574F] shrink-0" />
                <span>
                  इस लिंक से खुलने पर केवल <strong>Parent & Student App</strong> ही खुलेगा। स्कूल का एडमिन डेटा पूरी तरह सुरक्षित व पासवर्ड प्रोटेक्टेड रहेगा।
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: PRINTABLE QR CODE STANDEE */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between no-print">
                <div>
                  <h4 className="font-bold">स्कूल नोटिस बोर्ड व डायरी हेतु QR कोड</h4>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    इसे प्रिंट करके स्कूल गेट, फीस काउंटर, या डायरी पर लगाएं। अभिभावक कैमरा से स्कैन करके ऐप खोल सकते हैं।
                  </p>
                </div>
                <button
                  onClick={handlePrintQR}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-slate-800 transition shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>प्रिंट पोस्टर</span>
                </button>
              </div>

              {/* Printable Standee Card */}
              <div className="p-6 bg-white rounded-3xl border-2 border-slate-900 text-center space-y-4 printable-area">
                <div className="max-w-xs mx-auto space-y-1">
                  <h3 className="font-black text-lg text-[#05574F]">{activeSchool?.name}</h3>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {activeSchool?.affiliation || "CBSE Affiliated Institution"}
                  </p>
                </div>

                {/* QR Code */}
                <div className="p-4 bg-white rounded-2xl shadow-md inline-block border border-slate-100">
                  <QRCodeSVG
                    value={parentPortalUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-1 max-w-sm mx-auto">
                  <p className="font-extrabold text-sm text-slate-900">
                    📱 मोबाइल कैमरा से QR स्कैन करें
                  </p>
                  <p className="text-xs text-slate-500">
                    और सीधे अपने बच्चे की हाजिरी, फीस, व रिपोर्ट कार्ड देखें।
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 mt-2">
                    {parentPortalUrl}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INDIVIDUAL STUDENT LOGIN SLIPS */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="छात्र का नाम / रोल नं / मोबाइल खोजें..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-emerald-600 font-medium"
                  />
                </div>
              </div>

              {/* Student Picker list */}
              <div className="max-h-36 overflow-y-auto space-y-1 border border-slate-200 rounded-xl p-1.5">
                {filteredStudents.slice(0, 15).map((stu) => (
                  <button
                    key={stu.id}
                    onClick={() => setSelectedStudentForSlip(stu)}
                    className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between transition ${
                      selectedStudentForSlip?.id === stu.id
                        ? 'bg-[#05574F] text-white font-bold'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span>
                      {stu.name} ({stu.className} - {stu.section})
                    </span>
                    <span className="font-mono text-[10px] opacity-80">
                      Roll: {stu.rollNo} • {stu.phone}
                    </span>
                  </button>
                ))}
              </div>

              {/* Selected Student Login Slip */}
              {selectedStudentForSlip && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">
                        {selectedStudentForSlip.name} - अभिभावक लॉगिन पर्ची
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        {selectedStudentForSlip.className} • Sec {selectedStudentForSlip.section}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Adm: {selectedStudentForSlip.admissionNo}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">रजिस्टर्ड मोबाइल:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedStudentForSlip.phone}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-400 block">डिफ़ॉल्ट सुरक्षा PIN:</span>
                      <span className="font-mono font-bold text-emerald-700">123</span>
                    </div>
                  </div>

                  {/* Send personalized WhatsApp button */}
                  <a
                    href={`https://api.whatsapp.com/send?phone=91${selectedStudentForSlip.phone.replace(/\D/g, '').slice(-10)}&text=${getStudentWhatsAppText(selectedStudentForSlip)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>इस अभिभावक को सीधे WhatsApp पर पर्ची भेजें</span>
                  </a>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs no-print">
          <span className="text-slate-400 text-[11px]">
            🔒 256-Bit Encrypted Multi-School Separation
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
}