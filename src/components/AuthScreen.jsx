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
  GraduationCap
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
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
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
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

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
        
        {/* Left Side: Privacy & System Pitch */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Private & Secure School Accounts
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            One School Cannot See Another School's Data.
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            हर स्कूल का अपना अलग यूजर अकाउंट और सुरक्षित पासवर्ड है। स्कूल एडमिन केवल अपने ही स्कूल के छात्र, शिक्षक, हाजिरी और परीक्षा परिणाम देख सकते हैं।
          </p>

          {/* Key Security Pillars */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Isolated Database per School</h4>
                <p className="text-slate-400 mt-0.5">School A's data is never visible to School B or any other school user.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <KeyRound className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">Multi-Role Authentication</h4>
                <p className="text-slate-400 mt-0.5">Dedicated logins for School Principals, Teachers, and Parents.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form Card */}
        <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
          
          {/* Tab Navigation: Login vs Register */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                authMode === 'login'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              School / User Login (लॉगिन)
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                authMode === 'register'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Register New School (नया स्कूल जोड़ें)
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Mode 1: Login Form */}
          {authMode === 'login' && (
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-slate-900">Sign in to your School Portal</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your school admin email, teacher email, or registered phone number with password.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Email, Phone Number, or Username *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. xavier@school.com or 9876543210"
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
                      placeholder="Enter your secret password"
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
                  <span>Login to School (लॉगिन करें)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Fast Demo Login Buttons */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                  1-Click Test Demo Logins (परीक्षण के लिए सीधा लॉगिन करें):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('xavier@school.com', '123')}
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-left transition flex items-center justify-between"
                  >
                    <div>
                      <p className="font-extrabold text-blue-900 text-xs">St. Xavier's Admin</p>
                      <p className="text-[10px] text-blue-700">xavier@school.com • 123</p>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full">School 1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('dps@school.com', '123')}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-left transition flex items-center justify-between"
                  >
                    <div>
                      <p className="font-extrabold text-emerald-900 text-xs">DPS Gurugram Admin</p>
                      <p className="text-[10px] text-emerald-700">dps@school.com • 123</p>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">School 2</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('svm@school.com', '123')}
                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100 text-left transition flex items-center justify-between"
                  >
                    <div>
                      <p className="font-extrabold text-amber-900 text-xs">Saraswati Vidya Mandir</p>
                      <p className="text-[10px] text-amber-700">svm@school.com • 123</p>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">School 3</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('9871122334', '123')}
                    className="p-2.5 rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-left transition flex items-center justify-between"
                  >
                    <div>
                      <p className="font-extrabold text-purple-900 text-xs">Parent Login (Aarav)</p>
                      <p className="text-[10px] text-purple-700">Mobile: 9871122334 • 123</p>
                    </div>
                    <span className="text-[10px] font-bold bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">Parent</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Register New School with Admin User */}
          {authMode === 'register' && (
            <div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900">Register New School Account</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Create a new independent school campus. You will set the admin login credentials to keep it completely private.
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
                    <label className="block text-slate-700 font-bold mb-1">{t.educationBoard} *</label>
                    <select
                      value={registerData.board}
                      onChange={(e) => setRegisterData({ ...registerData, board: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="CBSE">CBSE (Central Board)</option>
                      <option value="ICSE">ICSE / ISC Board</option>
                      <option value="State Board">State Board</option>
                      <option value="Cambridge">Cambridge / IGCSE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">{t.schoolCode} *</label>
                    <input
                      type="text"
                      required
                      value={registerData.code}
                      onChange={(e) => setRegisterData({ ...registerData, code: e.target.value })}
                      placeholder="e.g. CBSE-90214"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 outline-none font-mono"
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
                      placeholder="e.g. Dr. A.K. Singhal"
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
                      placeholder="e.g. Delhi / Lucknow / Jaipur"
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
        VidyaSetu Multi-School ERP • Complete Privacy & Tenant Isolation System
      </footer>
    </div>
  );
}
