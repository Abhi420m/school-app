import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import AdminDashboard from './components/AdminDashboard';
import ClassManager from './components/ClassManager';
import StudentDirectory from './components/StudentDirectory';
import TeacherDirectory from './components/TeacherDirectory';
import AttendanceManager from './components/AttendanceManager';
import ExamReports from './components/ExamReports';
import ParentPortal from './components/ParentPortal';
import NoticeBoard from './components/NoticeBoard';
import ReportCardModal from './components/ReportCardModal';
import {
  loadMultiSchoolData,
  authenticateUser,
  saveCurrentSession,
  saveAllSchoolData,
  saveLanguage,
  registerSchoolWithAdminAccount,
  resetAllMultiSchoolData
} from './data/storage';
import { translations } from './translations';
import { RefreshCw, HeartHandshake, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Load Multi-School Master State including Session & Users
  const [multiSchoolState, setMultiSchoolState] = useState(() => loadMultiSchoolData());
  const { schools, users, currentSession, allData } = multiSchoolState;

  const [lang, setLang] = useState(multiSchoolState.lang || 'en');
  const [activeTab, setActiveTab] = useState(
    currentSession?.role === 'parent' ? 'parent-view' : 'dashboard'
  );
  const [classFilter, setClassFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Selected student for Report Card Modal
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);
  const [selectedExamForReport, setSelectedExamForReport] = useState(null);

  const todayDate = new Date().toISOString().split('T')[0];
  const t = translations[lang] || translations.en;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Language Change
  const handleLangChange = (newLang) => {
    setLang(newLang);
    saveLanguage(newLang);
  };

  // Handle Login Authentication
  const handleLogin = (identifier, password) => {
    const authResult = authenticateUser(identifier, password, users, schools);
    if (authResult.success) {
      setMultiSchoolState((prev) => ({
        ...prev,
        currentSession: authResult.session
      }));
      setActiveTab(authResult.session.role === 'parent' ? 'parent-view' : 'dashboard');
      showToast(`Welcome, ${authResult.session.userName}! Signed in to ${authResult.userSchool.name}`);
      return { success: true };
    }
    return authResult;
  };

  // Handle Register School with Admin User
  const handleRegisterSchool = (schoolDetails, adminCredentials) => {
    const result = registerSchoolWithAdminAccount(
      schoolDetails,
      adminCredentials,
      schools,
      users,
      allData
    );

    setMultiSchoolState({
      schools: result.updatedSchools,
      users: result.updatedUsers,
      currentSession: result.session,
      allData: result.updatedData,
      lang
    });

    setActiveTab('dashboard');
    showToast(`School ${result.newSchool.name} registered and logged in successfully!`);
  };

  // Handle Logout
  const handleLogout = () => {
    saveCurrentSession(null);
    setMultiSchoolState((prev) => ({
      ...prev,
      currentSession: null
    }));
    showToast("Logged out successfully.");
  };

  // If no user is logged in, show the secure Auth / Login screen
  if (!currentSession) {
    return (
      <AuthScreen
        schools={schools}
        users={users}
        onLogin={handleLogin}
        onRegisterSchool={handleRegisterSchool}
        lang={lang}
        setLang={handleLangChange}
        t={t}
      />
    );
  }

  // Active School Object (Strictly locked to the logged in user's school)
  const activeSchool = schools.find((s) => s.id === currentSession.schoolId) || schools[0];

  // Active School's Isolated Dataset
  const currentSchoolData = allData[activeSchool?.id] || {
    classes: [],
    teachers: [],
    students: [],
    attendance: {},
    exams: {},
    homework: [],
    notices: []
  };

  // Save changes for currently active school
  const updateCurrentSchoolData = (updater) => {
    setMultiSchoolState((prev) => {
      const current = prev.allData[currentSession.schoolId] || {};
      const updatedSchoolData = updater(current);
      const updatedAllData = {
        ...prev.allData,
        [currentSession.schoolId]: updatedSchoolData
      };
      saveAllSchoolData(updatedAllData);
      return {
        ...prev,
        allData: updatedAllData
      };
    });
  };

  // Add Student to Active School
  const handleAddStudent = (newStudent) => {
    updateCurrentSchoolData((schoolData) => ({
      ...schoolData,
      students: [newStudent, ...(schoolData.students || [])]
    }));
    showToast(`Student ${newStudent.name} enrolled in ${activeSchool.name}!`);
  };

  // Add Teacher to Active School
  const handleAddTeacher = (newTeacher) => {
    updateCurrentSchoolData((schoolData) => ({
      ...schoolData,
      teachers: [newTeacher, ...(schoolData.teachers || [])]
    }));
    showToast(`Faculty member ${newTeacher.name} appointed!`);
  };

  // Save Attendance for Active School
  const handleSaveAttendance = (date, records) => {
    updateCurrentSchoolData((schoolData) => ({
      ...schoolData,
      attendance: {
        ...(schoolData.attendance || {}),
        [date]: records
      }
    }));
  };

  // Add Notice to Active School
  const handleAddNotice = (newNotice) => {
    updateCurrentSchoolData((schoolData) => ({
      ...schoolData,
      notices: [newNotice, ...(schoolData.notices || [])]
    }));
    showToast("School notice circular published!");
  };

  // Open Report Card Modal
  const handleOpenReportCard = (student, exam = null) => {
    setSelectedStudentForReport(student);
    setSelectedExamForReport(exam);
  };

  // Reset to default sample dataset
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all schools back to the default demo multi-school dataset?")) {
      const reset = resetAllMultiSchoolData();
      setMultiSchoolState(reset);
      alert("Sample multi-school system restored successfully!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeSchool={activeSchool}
        currentSession={currentSession}
        onLogout={handleLogout}
        currentRole={currentSession.role === 'school_admin' ? 'admin' : currentSession.role}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={handleLangChange}
        t={t}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* View 1: School Admin Dashboard */}
        {activeTab === 'dashboard' && (
          <AdminDashboard
            students={currentSchoolData.students || []}
            teachers={currentSchoolData.teachers || []}
            classes={currentSchoolData.classes || []}
            attendance={currentSchoolData.attendance || {}}
            notices={currentSchoolData.notices || []}
            todayDate={todayDate}
            setActiveTab={setActiveTab}
            setSelectedStudentForReport={handleOpenReportCard}
            setCurrentRole={() => {}}
            t={t}
          />
        )}

        {/* View 2: Classes & Sections */}
        {activeTab === 'classes' && (
          <ClassManager
            classes={currentSchoolData.classes || []}
            students={currentSchoolData.students || []}
            teachers={currentSchoolData.teachers || []}
            onSelectClassFilter={(className) => setClassFilter(className)}
            setActiveTab={setActiveTab}
            t={t}
          />
        )}

        {/* View 3: Student Directory */}
        {activeTab === 'students' && (
          <StudentDirectory
            students={currentSchoolData.students || []}
            classes={currentSchoolData.classes || []}
            onAddStudent={handleAddStudent}
            onViewStudentReport={handleOpenReportCard}
            classFilter={classFilter}
            setClassFilter={setClassFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            t={t}
          />
        )}

        {/* View 4: Teachers & Contact Directory */}
        {activeTab === 'teachers' && (
          <TeacherDirectory
            teachers={currentSchoolData.teachers || []}
            onAddTeacher={handleAddTeacher}
            t={t}
          />
        )}

        {/* View 5: Daily Attendance */}
        {activeTab === 'attendance' && (
          <AttendanceManager
            students={currentSchoolData.students || []}
            classes={currentSchoolData.classes || []}
            attendance={currentSchoolData.attendance || {}}
            onSaveAttendance={handleSaveAttendance}
            todayDate={todayDate}
            t={t}
          />
        )}

        {/* View 6: Exams & Academic Marksheets */}
        {activeTab === 'exams' && (
          <ExamReports
            students={currentSchoolData.students || []}
            classes={currentSchoolData.classes || []}
            exams={currentSchoolData.exams || {}}
            onOpenReportCard={handleOpenReportCard}
            t={t}
          />
        )}

        {/* View 7: School Notices */}
        {activeTab === 'notices' && (
          <NoticeBoard
            notices={currentSchoolData.notices || []}
            onAddNotice={handleAddNotice}
            t={t}
          />
        )}

        {/* View 8: Parent Portal */}
        {activeTab === 'parent-view' && (
          <ParentPortal
            activeSchool={activeSchool}
            currentSession={currentSession}
            students={currentSchoolData.students || []}
            teachers={currentSchoolData.teachers || []}
            attendance={currentSchoolData.attendance || {}}
            exams={currentSchoolData.exams || {}}
            homework={currentSchoolData.homework || []}
            notices={currentSchoolData.notices || []}
            todayDate={todayDate}
            onOpenReportCard={handleOpenReportCard}
            t={t}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 no-print text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{activeSchool?.name}</span>
            <span>•</span>
            <span className="text-slate-400">Private School ERP • Protected Account</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Isolated School Session</span>
            </span>
            <span>•</span>
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-red-600 flex items-center gap-1 transition"
              title="Reset to factory sample data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Official CBSE Marksheet / Report Card Modal */}
      {selectedStudentForReport && (
        <ReportCardModal
          student={selectedStudentForReport}
          examData={selectedExamForReport}
          activeSchool={activeSchool}
          onClose={() => {
            setSelectedStudentForReport(null);
            setSelectedExamForReport(null);
          }}
          t={t}
        />
      )}
    </div>
  );
}
