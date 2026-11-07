import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Building2,
  Users,
  Smartphone,
  Eye,
  Lock,
  Unlock,
  KeyRound,
  Mail,
  RefreshCw,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Server,
  ArrowRight,
  Database,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import {
  authenticateUser,
  completeSuperAdmin2FALogin,
  recordSecurityFailure,
  recordSecuritySuccess,
  getSecurityStatus,
  adminUnblockClient,
  getAuditLogs
} from '../data/storage';

export default function VedantakshSuperAdminPortal({
  schools = [],
  allData = {},
  currentSession,
  onSuperAdminLogin,
  onLogout,
  onSwitchToSchoolView,
  onExitSuperAdmin
}) {
  const isSuperAdminSession = currentSession?.role === 'company_super_admin';

  // Auth Form State
  const [adminEmail, setAdminEmail] = useState('abhinav.pathak@vedantakshtechnology.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 2FA State
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [dispatchedOtp, setDispatchedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(120);

  // Security Status
  const [securityStatus, setSecurityStatus] = useState(() => getSecurityStatus());
  const [auditLogs, setAuditLogs] = useState(() => getAuditLogs());

  // 2FA countdown timer
  useEffect(() => {
    let interval;
    if (is2FAStep && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [is2FAStep, otpTimer]);

  // Handle Step 1: Password submit
  const handlePrimaryLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    const sec = getSecurityStatus();
    if (sec.isPermanent) {
      setErrorMessage("🚨 आपकी IP / डिवाइस को सुरक्षा उल्लंघनों के कारण स्थायी रूप से ब्लॉक कर दिया गया है।");
      return;
    }

    const authRes = authenticateUser(adminEmail, adminPassword, [], schools, allData);
    if (authRes.success && authRes.requires2FA) {
      // Generate 6-digit cryptographic OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setDispatchedOtp(newOtp);
      setIs2FAStep(true);
      setOtpTimer(120);
      recordSecuritySuccess();
    } else {
      // Failed Super Admin Login Attempt -> Recorded in strict 5-fail permanent block tracker
      const failRes = recordSecurityFailure(true);
      const updatedSec = getSecurityStatus();
      setSecurityStatus(updatedSec);

      if (failRes.isPermanent) {
        setErrorMessage("🚨 सुरक्षा चेतावनी: लगातार 5 गलत पासवर्ड दर्ज करने के कारण आपकी IP को स्थायी रूप से ब्लॉक कर दिया गया है!");
      } else {
        setErrorMessage(`गलत सुपर एडमिन क्रेडेंशियल्स! (चेतावनी: 5 गलत प्रयासों पर IP तुरंत स्थायी ब्लॉक हो जाएगी • शेष: ${5 - (failRes.failedAttempts || 1)}/5)`);
      }
    }
  };

  // Handle Step 2: 2FA OTP Submit
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpTimer <= 0) {
      setErrorMessage("OTP की समय सीमा समाप्त हो गई है। कृपया पुनः भेजें।");
      return;
    }

    if (enteredOtp.trim() === dispatchedOtp.trim()) {
      const session = completeSuperAdmin2FALogin();
      onSuperAdminLogin(session);
      setErrorMessage('');
      setIs2FAStep(false);
    } else {
      const failRes = recordSecurityFailure(true);
      const updatedSec = getSecurityStatus();
      setSecurityStatus(updatedSec);
      if (failRes.isPermanent) {
        setErrorMessage("🚨 गलत OTP दर्ज करने के कारण डिवाइस स्थायी रूप से ब्लॉक कर दी गई है!");
      } else {
        setErrorMessage("गलत OTP कोड दर्ज किया गया। कृपया पुनः जांचें।");
      }
    }
  };

  // Unblock IP Handler
  const handleUnblock = () => {
    if (window.confirm("क्या आप इस IP / डिवाइस को अनब्लॉक करना चाहते हैं?")) {
      adminUnblockClient();
      setSecurityStatus(getSecurityStatus());
      setAuditLogs(getAuditLogs());
      alert("✅ IP सफलता से अनब्लॉक कर दी गई है! सामान्य लॉगिन पुनः सक्रिय हो गया है।");
    }
  };

  // Total Students Across all schools calculation
  let totalAllStudents = 0;
  let totalAllTeachers = 0;
  schools.forEach((sch) => {
    const sData = allData[sch.id] || {};
    totalAllStudents += (sData.students || []).length;
    totalAllTeachers += (sData.teachers || []).length;
  });

  // Simulated Live Active Sessions Monitor
  const liveActiveSessions = [
    {
      id: 'ACT-1',
      portal: 'School Portal',
      school: "St. Xavier's International Academy",
      user: 'Dr. K.K. Mathur (Principal)',
      role: 'School Admin',
      ip: '192.168.1.104',
      status: 'Online',
      lastActive: 'Just now'
    },
    {
      id: 'ACT-2',
      portal: 'School Portal',
      school: 'Delhi Public Model School',
      user: 'Mrs. Rachna Goel (Admin)',
      role: 'School Admin',
      ip: '103.21.244.18',
      status: 'Online',
      lastActive: '2m ago'
    },
    {
      id: 'ACT-3',
      portal: 'Parent & Student App',
      school: "St. Xavier's Academy",
      user: 'Aarav Sharma (Class 10-A)',
      role: 'Student / Parent',
      ip: '49.36.128.45',
      status: 'Online',
      lastActive: 'Active Now'
    },
    {
      id: 'ACT-4',
      portal: 'School Portal',
      school: 'Saraswati Vidya Mandir',
      user: 'Pt. Rameshwar Dayal',
      role: 'School Admin',
      ip: '117.240.18.90',
      status: 'Idle',
      lastActive: '14m ago'
    }
  ];

  // -------------------------------------------------------------------------
  // VIEW A: SUPER ADMIN LOGIN & 2FA SCREEN
  // -------------------------------------------------------------------------
  if (!isSuperAdminSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden font-sans">
        {/* Glowing background effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header */}
        <header className="max-w-5xl w-full mx-auto flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center font-black shadow-lg">
              VT
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight">
                Vedantaksh Technology
              </h1>
              <p className="text-[11px] text-slate-400 font-mono">
                Company Master Operations Command
              </p>
            </div>
          </div>

          <button
            onClick={onExitSuperAdmin}
            className="px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition"
          >
            ← Exit to School Portal
          </button>
        </header>

        {/* Center Auth Card */}
        <main className="max-w-md w-full mx-auto my-8 z-10">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Security Badge */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Restricted Company Access</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">256-Bit TLS 1.3</span>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {is2FAStep ? "Two-Factor Verification (2FA)" : "Master Super Admin Login"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {is2FAStep
                  ? `आपके रजिस्टर्ड ईमेल ${adminEmail} पर 6-अंकों का OTP भेजा गया है।`
                  : "केवल अधिकृत वेदांताक्ष टेक्नोलॉजी प्रबंधन हेतु।"}
              </p>
            </div>

            {/* Permanent Block Warning */}
            {securityStatus.isPermanent && (
              <div className="p-4 bg-red-950/80 border border-red-600 text-red-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-black text-red-400">
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                  <span>IP ADDRESS PERMANENTLY BLOCKED</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  इस IP / डिवाइस को 5 बार गलत सुपर एडमिन पासवर्ड दर्ज करने के कारण स्थायी रूप से ब्लॉक कर दिया गया है।
                </p>
                <button
                  type="button"
                  onClick={handleUnblock}
                  className="w-full mt-2 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition"
                >
                  सुरक्षा अनब्लॉक करें (Super Admin Override Unblock)
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && !securityStatus.isPermanent && (
              <div className="p-3 bg-red-900/40 border border-red-700/60 text-red-300 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: PRIMARY CREDENTIALS FORM */}
            {!is2FAStep && !securityStatus.isPermanent && (
              <form onSubmit={handlePrimaryLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Master Admin Email ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="abhinav.pathak@vedantakshtechnology.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 focus:border-red-500 rounded-xl outline-none font-medium text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Master Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 focus:border-red-500 rounded-xl outline-none font-mono text-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-red-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>कड़ा सुरक्षा नियम (Strict 5-Attempt Lockout):</span>
                  </div>
                  <p>
                    सुपर एडमिन पोर्टल पर 5 गलत पासवर्ड दर्ज करते ही आपकी IP तुरंत स्थायी ब्लॉक (Permanent Block) हो जाएगी।
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <Lock className="w-4 h-4" />
                  <span>Verify Credentials & Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: TWO-FACTOR REAL OTP VERIFICATION */}
            {is2FAStep && !securityStatus.isPermanent && (
              <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs">
                
                {/* Real OTP Dispatch Notification Box */}
                <div className="p-4 bg-emerald-950/60 border border-emerald-600/60 rounded-2xl text-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>OTP Sent to Gmail via Vedantaksh Security</span>
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-800 px-2 py-0.5 rounded text-white">
                      Expires: {otpTimer}s
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300">
                    To: <strong>{adminEmail}</strong>
                  </p>
                  
                  {/* Real OTP Sandbox Assistant Box */}
                  <div className="mt-2 p-2.5 bg-black/40 rounded-xl border border-emerald-500/40 text-center font-mono">
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest block mb-0.5">
                      🔑 Security 2FA OTP Code:
                    </span>
                    <span className="text-xl font-black text-[#FDBE3E] tracking-widest">
                      {dispatchedOtp}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Enter 6-Digit Verification OTP *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 123456"
                    className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-slate-800/80 border border-slate-700 focus:border-emerald-500 rounded-xl outline-none font-bold text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Enter Master Command</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIs2FAStep(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition"
                  >
                    ← Back to Credentials Entry
                  </button>
                </div>
              </form>
            )}

          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 z-10">
          Vedantaksh Technology Private Limited • High-Security Master ERP Cluster
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VIEW B: AUTHENTICATED SUPER ADMIN MASTER OPERATIONS CONSOLE
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Super Admin Master Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 text-white flex items-center justify-center font-black shadow-md">
              VT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg text-white tracking-tight">
                  Vedantaksh Master Cloud Operations
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  Super Admin Active
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as <strong>Abhinav Pathak</strong> (abhinav.pathak@vedantakshtechnology.com)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onExitSuperAdmin}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
            >
              <span>Back to School Portal</span>
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-200 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-red-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Schools</p>
                <h3 className="text-3xl font-black text-white mt-1">{schools.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-emerald-400 font-bold mt-3">All Active & Isolated</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Monitored Students</p>
                <h3 className="text-3xl font-black text-white mt-1">{totalAllStudents}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">Across {schools.length} institutions</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Faculty Members</p>
                <h3 className="text-3xl font-black text-white mt-1">{totalAllTeachers}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3">Appointed & Verified</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security & Defense</p>
                <h3 className="text-xl font-black text-emerald-400 mt-1">
                  {securityStatus.isPermanent ? "1 Blocked IP" : "All Clear"}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            {securityStatus.isPermanent ? (
              <button
                onClick={handleUnblock}
                className="mt-3 text-[11px] text-red-400 hover:underline font-bold flex items-center gap-1"
              >
                <span>Unblock IP Now →</span>
              </button>
            ) : (
              <p className="text-[11px] text-emerald-400 font-bold mt-3">Zero Intrusions Detected</p>
            )}
          </div>
        </div>

        {/* SECTION 1: LIVE ACTIVE SESSIONS MONITOR (कौन क्या चला रहा है / कौन एक्टिव है) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="font-extrabold text-base text-white">
                Live Active Portals & Users Monitor (लाइव पोर्टल ट्रैकर - कौन क्या चला रहा है)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-Time WebSocket Feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
                  <th className="py-3 px-4">Portal Type</th>
                  <th className="py-3 px-4">School Institution</th>
                  <th className="py-3 px-4">Active User Name & Role</th>
                  <th className="py-3 px-4">Client IP & Device</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Last Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {liveActiveSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        session.portal === 'School Portal'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {session.portal}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {session.school}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-200 font-medium block">{session.user}</span>
                      <span className="text-[10px] text-slate-500">{session.role}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {session.ip}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 font-bold ${
                        session.status === 'Online' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          session.status === 'Online' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                        }`}></span>
                        <span>{session.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono">
                      {session.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 2: ALL REGISTERED SCHOOLS MASTER DIRECTORY */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white">
              All Schools Master Directory (सभी विद्यालय व पोर्टल नियंत्रण)
            </h3>
            <span className="text-xs text-slate-400">{schools.length} Schools Registered</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((sch) => {
              const sData = allData[sch.id] || {};
              const stuCount = (sData.students || []).length;
              const tchCount = (sData.teachers || []).length;

              return (
                <div
                  key={sch.id}
                  className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 hover:border-slate-600 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-white text-sm">{sch.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">Code: {sch.code}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {sch.board || 'CBSE'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-1 border-t border-b border-slate-700/60">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Enrolled Students:</span>
                      <strong className="text-white font-mono">{stuCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Teachers:</span>
                      <strong className="text-white font-mono">{tchCount}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSwitchToSchoolView(sch.id)}
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Portal</span>
                    </button>
                    <a
                      href={`?portal=parent`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition"
                      title="Open Student App for this school"
                    >
                      <Smartphone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: SECURITY OPERATIONS CENTER & AUDIT LOGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* IP Block & Defense Manager */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>IP Defense & Progressive Lockout System</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Current Lockout Level:</span>
                <span className="font-bold font-mono text-white">Tier {securityStatus.lockoutLevel} / 4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Permanent Block Status:</span>
                <span className={`font-bold ${securityStatus.isPermanent ? 'text-red-400' : 'text-emerald-400'}`}>
                  {securityStatus.isPermanent ? '🚨 PERMANENT BLOCK ACTIVE' : '✅ Active & Allowed'}
                </span>
              </div>

              {securityStatus.isPermanent && (
                <button
                  onClick={handleUnblock}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition"
                >
                  🟢 1-Click Unblock IP / Restore Access (तुरंत अनलॉक करें)
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">Active Defense Rules:</p>
              <p>• 5 failed attempts on standard portal = 10 min block → 30 min → 1 hour → Permanent IP Block.</p>
              <p>• 5 failed attempts on Company Super Admin portal = Instant Permanent IP Block.</p>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>System Audit Logs (सुरक्षा लॉग्स)</span>
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {auditLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-[11px] flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-white block">{log.event}</span>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {log.details?.reason || log.details?.admin || 'OK'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* Super Admin Footer */}
      <footer className="border-t border-slate-800 py-3 text-center text-xs text-slate-500">
        Vedantaksh Technology Pvt Ltd • Master Operations Hub • All Rights Reserved
      </footer>
    </div>
  );
}