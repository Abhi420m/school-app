import React, { useState } from 'react';
import {
  School,
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Globe,
  KeyRound,
  GraduationCap,
  Users,
  Smartphone,
  BookOpen
} from 'lucide-react';

export default function AuthScreen({
  schools,
  users,
  onLogin,
  onRegisterSchool,
  lang,
  setLang,
  t
}) {
  const [authMode, setAuthMode] = useState('school_login'); // 'school_login' | 'parent_login' | 'register'
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Register School Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    board: 'CBSE',
    code: `CBSE-${Math.floor(10000 + Math.random() * 90000)}`,
    principal: '',
    phone: '',
    email: '',
    city: '',
    state: 'Delhi',
    address: '',
    theme: 'blue',
    adminPassword: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const res = onLogin(loginIdentifier, loginPassword);
    if (!res.success) {
      setErrorMessage(res.error || "Invalid login credentials. Please try again.");
    }
  };

  const handleQuickDemoLogin = (identifier, password) => {
    setLoginIdentifier(identifier);
    setLoginPassword(password);
    setErrorMessage('');
    onLogin(identifier, password);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (registerData.adminPassword.length < 3) {
      setErrorMessage("Please choose a password with at least 3 characters.");
      return;
    }

    if (registerData.adminPassword !== registerData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    const schoolDetails = {
      name: registerData.name,
      code: registerData.code,
      board: registerData.board,
      principal: registerData.principal,
      phone: registerData.phone,
      email: registerData.email,
      address: registerData.address,
      city: registerData.city,
      state: registerData.state,
      theme: registerData.theme,
      affiliation: `${registerData.board} Recognized | Code: ${registerData.code}`
    };

    const adminCredentials = {
      email: registerData.email,
      password: registerData.adminPassword,
      username: registerData.email.split('@')[0]
    };

    onRegisterSchool(schoolDetails, adminCredentials);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
      {/* Background glowing orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header with App Logo & Language switch */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg border border-white/20">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white leading-tight">
              {t.appTitle}
            </h1>
            <p className="text-xs text-blue-200/70 font-medium">{t.schoolSubtitle}</p>
          </div>
        </div>

        {/* Language switch */}
        <button
          onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition backdrop-blur-md"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Pitch & Portals Overview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Isolated Portals • Complete Privacy
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Separate Portals for School Management & Students.
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            School staff gets full operational controls (Curriculum, Fees, Attendance & Exams), while Students & Parents get a personalized view of their academic records with self-service detail updates.
          </p>

          {/* Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                <School className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">School Portal (केवल स्कूल प्रबंधन)</h4>
                <p className="text-slate-400 mt-0.5">Classes, Student Directory, Teacher Roster, Attendance & Marksheets.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Student & Parent App (विद्यार्थी ऐप)</h4>
                <p className="text-slate-400 mt-0.5">Check marks & timetable, view fees, and submit updated contact details.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
          
          {/* 3-Way Mode Switcher: School Portal vs Parent App vs Register */}
          <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-2xl mb-6 gap-1">
            <button
              type="button"
              onClick={() => {
                setAuthMode('school_login');
                setErrorMessage('');
                setLoginIdentifier('xavier@school.com');
                setLoginPassword('123');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'school_login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>School Portal</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('parent_login');
                setErrorMessage('');
                setLoginIdentifier('9871122334');
                setLoginPassword('123');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'parent_login'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Parent / Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
              }}
              className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                authMode === 'register'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>+ Register</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODE 1: SCHOOL PORTAL LOGIN (केवल स्कूल प्रबंधन) */}
          {authMode === 'school_login' && (
            <div>
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <School className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">School Management Portal (स्कूल पोर्टल)</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Principal, Admin & Faculty login for school operations, students directory, fees, attendance and marksheets.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    School Admin / Teacher Email or Username *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. xavier@school.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl outline-none font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl outline-none font-medium text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm mt-2"
                >
                  <School className="w-4 h-4" />
                  <span>Open School Portal (स्कूल पोर्टल खोलें)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Fast School Logins */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  1-Click Fast School Login (परीक्षण हेतु):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('xavier@school.com', '123')}
                    className="p-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-left transition"
                  >
                    <p className="font-extrabold text-blue-900 text-xs">St. Xavier's</p>
                    <p className="text-[10px] text-blue-700">xavier@school.com</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('dps@school.com', '123')}
                    className="p-2 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-left transition"
                  >
                    <p className="font-extrabold text-emerald-900 text-xs">DPS Model</p>
                    <p className="text-[10px] text-emerald-700">dps@school.com</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('svm@school.com', '123')}
                    className="p-2 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-left transition"
                  >
                    <p className="font-extrabold text-amber-900 text-xs">Saraswati VM</p>
                    <p className="text-[10px] text-amber-700">svm@school.com</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: STUDENT & PARENT APP LOGIN (विद्यार्थी एवं अभिभावक ऐप) */}
          {authMode === 'parent_login' && (
            <div>
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">Student & Parent App (विद्यार्थी ऐप)</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Login with registered Mobile Number, Admission Number, or Roll Number to check marks, timetable, attendance & submit your details.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Student Mobile No / Admission No / Roll No *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. 9871122334 or ADM-2023-1001"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl outline-none font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    PIN / Password * (Default: 123)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter PIN (e.g. 123)"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl outline-none font-medium text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#05574F] hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm mt-2"
                >
                  <Smartphone className="w-4 h-4 text-[#FDBE3E]" />
                  <span>Open Student & Parent App (ऐप में प्रवेश करें)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Fast Student / Parent Login */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  1-Click Fast Student / Parent Login (परीक्षण हेतु):
                </p>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('9871122334', '123')}
                  className="w-full p-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-left transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#05574F] text-[#FDBE3E] font-black text-sm flex items-center justify-center">
                      A
                    </div>
                    <div>
                      <p className="font-extrabold text-emerald-950 text-xs">Aarav Sharma (Class 10-A)</p>
                      <p className="text-[10px] text-emerald-800">Phone: 9871122334 • PIN: 123</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-700 text-white px-2.5 py-1 rounded-full">
                    Student Login →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* MODE 3: REGISTER NEW SCHOOL */}
          {authMode === 'register' && (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">Register New School Account</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Create a new independent school campus with private database and admin credentials.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">{t.schoolName} *</label>
                  <input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="e.g. Modern Public School"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{t.boardAffiliation} *</label>
                    <select
                      value={registerData.board}
                      onChange={(e) => setRegisterData({ ...registerData, board: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white font-medium"
                    >
                      <option value="CBSE">CBSE Board</option>
                      <option value="ICSE">ICSE / CISCE</option>
                      <option value="State Board">State Board</option>
                      <option value="IB / Cambridge">IB / Cambridge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{t.schoolCode} *</label>
                    <input
                      type="text"
                      required
                      value={registerData.code}
                      onChange={(e) => setRegisterData({ ...registerData, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-blue-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{t.principalName} *</label>
                    <input
                      type="text"
                      required
                      value={registerData.principal}
                      onChange={(e) => setRegisterData({ ...registerData, principal: e.target.value })}
                      placeholder="Dr. / Mrs. ..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{t.schoolPhone} *</label>
                    <input
                      type="tel"
                      required
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Admin Login Email *</label>
                    <input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="admin@school.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{t.city} *</label>
                    <input
                      type="text"
                      required
                      value={registerData.city}
                      onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                      placeholder="e.g. Delhi / Jaipur"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Password Fields for School Admin */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/70 rounded-2xl border border-blue-100">
                  <div>
                    <label className="block text-blue-950 font-bold mb-1">Create Admin Password *</label>
                    <input
                      type="password"
                      required
                      value={registerData.adminPassword}
                      onChange={(e) => setRegisterData({ ...registerData, adminPassword: e.target.value })}
                      placeholder="Minimum 3 characters"
                      className="w-full px-3 py-2 rounded-xl border border-blue-200 focus:border-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-blue-950 font-bold mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      placeholder="Re-type password"
                      className="w-full px-3 py-2 rounded-xl border border-blue-200 focus:border-blue-500 outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Campus Address</label>
                  <input
                    type="text"
                    value={registerData.address}
                    onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                    placeholder="Institutional Area, Sector..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-sm mt-3"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Register & Open Private School Portal</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-2 relative z-10">
        VidyaSetu Multi-School ERP • Separate Portals for School & Students
      </footer>
    </div>
  );
}
