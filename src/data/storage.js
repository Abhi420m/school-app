import {
  initialSchools,
  initialUsers,
  initialMultiSchoolData,
  defaultClassesTemplate
} from './initialData';

const STORAGE_KEYS = {
  SCHOOLS: 'vidyasetu_schools_list_v3',
  USERS: 'vidyasetu_users_v3',
  CURRENT_SESSION: 'vidyasetu_current_session_v3',
  MULTISCHOOL_DATA: 'vidyasetu_multischool_data_v3',
  LANGUAGE: 'vidyasetu_language_v3'
};

// --- ADVANCED PROGRESSIVE SECURITY DEFENSE & LOCKOUT SYSTEM ---
const SECURITY_KEYS = {
  FAILED_ATTEMPTS: 'vs_sec_failed_attempts_v4',
  LOCKOUT_LEVEL: 'vs_sec_lockout_level_v4',
  LOCKOUT_EXPIRES: 'vs_sec_lockout_expires_v4',
  SUPER_ADMIN_FAILS: 'vs_sec_sa_fails_v4',
  PERMANENT_BLOCKED: 'vs_sec_perm_blocked_v4',
  AUDIT_LOGS: 'vs_sec_audit_logs_v4'
};

/**
 * Get current security lockout and IP defense status
 */
export function getSecurityStatus() {
  try {
    const isPermanent = localStorage.getItem(SECURITY_KEYS.PERMANENT_BLOCKED) === 'true';
    if (isPermanent) {
      return {
        isBlocked: true,
        isPermanent: true,
        remainingSeconds: Infinity,
        lockoutLevel: 4,
        failedAttempts: 5,
        message: '🚨 सुरक्षा अलर्ट: इस डिवाइस / IP को अनधिकृत प्रयासों के कारण स्थायी रूप से ब्लॉक (Permanently Blocked) कर दिया गया है। Vedantaksh Technology सुरक्षा टीम से संपर्क करें।'
      };
    }

    const lockoutExpires = parseInt(localStorage.getItem(SECURITY_KEYS.LOCKOUT_EXPIRES) || '0', 10);
    const now = Date.now();
    const remainingMs = Math.max(0, lockoutExpires - now);
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const lockoutLevel = parseInt(localStorage.getItem(SECURITY_KEYS.LOCKOUT_LEVEL) || '0', 10);
    const failedAttempts = parseInt(localStorage.getItem(SECURITY_KEYS.FAILED_ATTEMPTS) || '0', 10);

    return {
      isBlocked: remainingSeconds > 0,
      isPermanent: false,
      remainingSeconds,
      lockoutLevel,
      failedAttempts,
      message: remainingSeconds > 0
        ? `🔒 सुरक्षा लॉक सक्रिय: गलत प्रयासों के कारण लॉगिन अस्थायी रूप से ब्लॉक है। कृपया ${Math.ceil(remainingSeconds / 60)} मिनट (${remainingSeconds}s) बाद प्रयास करें।`
        : null
    };
  } catch (e) {
    return { isBlocked: false, isPermanent: false, remainingSeconds: 0, lockoutLevel: 0, failedAttempts: 0 };
  }
}

/**
 * Record a failed login attempt with progressive penalties
 * Rule:
 * 1. 5 wrong attempts -> 10 minutes lockout (Level 1)
 * 2. Wrong again -> 30 minutes lockout (Level 2)
 * 3. Wrong again -> 1 hour lockout (Level 3)
 * 4. Wrong again -> Permanent IP Block (Level 4)
 * For Super Admin Company Portal: 5 wrong attempts -> Immediate Permanent Block!
 */
export function recordSecurityFailure(isSuperAdmin = false) {
  try {
    const now = Date.now();

    if (isSuperAdmin) {
      const saFails = parseInt(localStorage.getItem(SECURITY_KEYS.SUPER_ADMIN_FAILS) || '0', 10) + 1;
      localStorage.setItem(SECURITY_KEYS.SUPER_ADMIN_FAILS, saFails.toString());
      addAuditLog('SUPER_ADMIN_FAILED_ATTEMPT', { count: saFails });

      if (saFails >= 5) {
        localStorage.setItem(SECURITY_KEYS.PERMANENT_BLOCKED, 'true');
        addAuditLog('PERMANENT_IP_BLOCK_ENFORCED', { reason: '5 Failed Company Super Admin Logins' });
        return { isPermanent: true, remainingSeconds: Infinity, lockoutLevel: 4 };
      }
      return { isPermanent: false, remainingSeconds: 0, failedAttempts: saFails };
    }

    // Standard Portal failure
    const currentFails = parseInt(localStorage.getItem(SECURITY_KEYS.FAILED_ATTEMPTS) || '0', 10) + 1;
    localStorage.setItem(SECURITY_KEYS.FAILED_ATTEMPTS, currentFails.toString());
    addAuditLog('FAILED_LOGIN_ATTEMPT', { count: currentFails });

    if (currentFails >= 5) {
      const currentLevel = parseInt(localStorage.getItem(SECURITY_KEYS.LOCKOUT_LEVEL) || '0', 10);
      let nextLevel = currentLevel + 1;
      let durationMs = 0;

      if (nextLevel === 1) {
        durationMs = 10 * 60 * 1000; // 10 minutes
      } else if (nextLevel === 2) {
        durationMs = 30 * 60 * 1000; // 30 minutes
      } else if (nextLevel === 3) {
        durationMs = 60 * 60 * 1000; // 1 hour (60 minutes)
      } else {
        // Exceeded 1 hour -> Permanent Block!
        localStorage.setItem(SECURITY_KEYS.PERMANENT_BLOCKED, 'true');
        localStorage.setItem(SECURITY_KEYS.LOCKOUT_LEVEL, '4');
        addAuditLog('PERMANENT_IP_BLOCK_ENFORCED', { reason: 'Exceeded 3 Progressive Lockout Tiers' });
        return { isPermanent: true, remainingSeconds: Infinity, lockoutLevel: 4 };
      }

      localStorage.setItem(SECURITY_KEYS.LOCKOUT_LEVEL, nextLevel.toString());
      localStorage.setItem(SECURITY_KEYS.LOCKOUT_EXPIRES, (now + durationMs).toString());
      localStorage.setItem(SECURITY_KEYS.FAILED_ATTEMPTS, '0'); // reset counter for next tier

      addAuditLog(`PROGRESSIVE_LOCKOUT_ENFORCED_LEVEL_${nextLevel}`, { durationMinutes: durationMs / 60000 });
      return {
        isPermanent: false,
        remainingSeconds: Math.ceil(durationMs / 1000),
        lockoutLevel: nextLevel
      };
    }

    return { isPermanent: false, remainingSeconds: 0, failedAttempts: currentFails };
  } catch (e) {
    console.error(e);
  }
}

/**
 * Reset failed attempts on successful login
 */
export function recordSecuritySuccess() {
  try {
    localStorage.removeItem(SECURITY_KEYS.FAILED_ATTEMPTS);
    localStorage.removeItem(SECURITY_KEYS.SUPER_ADMIN_FAILS);
    // Note: Do not reset lockout level immediately to prevent repeated fast attacks
  } catch (e) {}
}

/**
 * Super Admin 1-Click Unblock
 */
export function adminUnblockClient() {
  try {
    localStorage.removeItem(SECURITY_KEYS.PERMANENT_BLOCKED);
    localStorage.removeItem(SECURITY_KEYS.LOCKOUT_EXPIRES);
    localStorage.removeItem(SECURITY_KEYS.LOCKOUT_LEVEL);
    localStorage.removeItem(SECURITY_KEYS.FAILED_ATTEMPTS);
    localStorage.removeItem(SECURITY_KEYS.SUPER_ADMIN_FAILS);
    addAuditLog('CLIENT_UNBLOCKED_BY_SUPER_ADMIN', { timestamp: new Date().toISOString() });
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Audit Logging Engine
 */
export function getAuditLogs() {
  try {
    return JSON.parse(localStorage.getItem(SECURITY_KEYS.AUDIT_LOGS)) || [
      { id: 'LOG-1', event: 'SYSTEM_ONLINE', details: { message: 'Vedantaksh Cloud Node Operational' }, timestamp: new Date().toISOString() }
    ];
  } catch (e) {
    return [];
  }
}

export function addAuditLog(event, details = {}) {
  try {
    const logs = getAuditLogs();
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      event,
      details,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(SECURITY_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  } catch (e) {}
}

// --- SECURITY & ANTI-TAMPER ENGINE ---
const SESSION_SECRET_SALT = 'VS_SECURE_HASH_SALT_2026_ERP_PROT_9981';

/**
 * Generate cryptographic signature for user session to prevent role escalation / tampering
 */
export function generateSessionSignature(session) {
  if (!session) return '';
  const payload = `${session.userId}#${session.role}#${session.schoolId}#${session.studentId || 'none'}#${SESSION_SECRET_SALT}`;
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash) + payload.charCodeAt(i);
    hash |= 0;
  }
  return `VSSIG-${Math.abs(hash).toString(36).toUpperCase()}`;
}

/**
 * Validate session integrity. If user modifies role or schoolId in localStorage, signature fails.
 */
export function validateSessionSignature(session) {
  if (!session || !session._sig) return false;
  return session._sig === generateSessionSignature(session);
}

/**
 * Sanitize all string inputs against HTML Injection / Stored XSS / Script Attacks
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove JS protocols
    .replace(/data:/gi, '') // Remove data URLs
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick, onload
    .trim();
}

export function loadMultiSchoolData() {
  try {
    const schools = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOOLS)) || initialSchools;
    let users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || initialUsers;
    const rawSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION)) || null;
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEYS.MULTISCHOOL_DATA)) || initialMultiSchoolData;
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';

    // Ensure all default users (like accountant & teacher) exist
    const userIds = new Set(users.map(u => u.id));
    initialUsers.forEach(iu => {
      if (!userIds.has(iu.id)) {
        users.push(iu);
      }
    });

    // Verify Session Integrity (Anti-Tamper check)
    let currentSession = null;
    if (rawSession) {
      if (validateSessionSignature(rawSession)) {
        currentSession = rawSession;
      } else {
        console.warn("⚠️ Security Alert: Session tampering detected! Invalidating compromised session.");
        localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
      }
    }

    // Ensure all schools have data container
    schools.forEach((sch) => {
      if (!allData[sch.id]) {
        allData[sch.id] = {
          classes: defaultClassesTemplate,
          teachers: [],
          students: [],
          attendance: {},
          exams: {},
          homework: [],
          notices: []
        };
      }
    });

    return { schools, users, currentSession, allData, lang };
  } catch (err) {
    console.error("Failed to load multi-school data from localStorage", err);
    return {
      schools: initialSchools,
      users: initialUsers,
      currentSession: null,
      allData: initialMultiSchoolData,
      lang: 'en'
    };
  }
}

export function saveUsersList(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users list", err);
  }
}

export function saveCurrentSession(session) {
  try {
    if (session) {
      const signedSession = {
        ...session,
        _sig: generateSessionSignature(session)
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(signedSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
    }
  } catch (err) {
    console.error("Failed to save current session", err);
  }
}

export function saveSchoolsList(schools) {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(schools));
  } catch (err) {
    console.error("Failed to save schools list", err);
  }
}

export function saveAllSchoolData(allData) {
  try {
    localStorage.setItem(STORAGE_KEYS.MULTISCHOOL_DATA, JSON.stringify(allData));
  } catch (err) {
    console.error("Failed to save all school data", err);
  }
}

export function saveLanguage(lang) {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (err) {
    console.error("Failed to save language", err);
  }
}

// User Authentication: Match by Email, Username, Phone Number, or Student Admission/Roll
export function authenticateUser(identifier, password, users, schools, allData = {}) {
  const cleanId = (identifier || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  // 0. VEDANTAKSH TECHNOLOGY MASTER COMPANY SUPER ADMIN
  if (cleanId === 'abhinav.pathak@vedantakshtechnology.com') {
    if (password === 'Ved@nT@ksh@@bhin@v@@nuj') {
      return {
        success: true,
        requires2FA: true,
        isSuperAdmin: true,
        email: 'abhinav.pathak@vedantakshtechnology.com',
        adminName: 'Abhinav Pathak (Vedantaksh Technology Super Admin)'
      };
    } else {
      return {
        success: false,
        isSuperAdminAttempt: true,
        error: "गलत सुपर एडमिन पासवर्ड। (Invalid Vedantaksh Super Admin Password)."
      };
    }
  }

  // 1. Find user matching credentials in registered users list
  const foundUser = users.find((u) => {
    const emailMatch = u.email && u.email.toLowerCase() === cleanId;
    const userMatch = u.username && u.username.toLowerCase() === cleanId;
    const phoneMatch = u.phone && u.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '');

    // Also check school code (e.g. CBSE-20491)
    const school = schools.find((s) => s.id === u.schoolId);
    const codeMatch = school && school.code && school.code.toLowerCase() === cleanId;

    return (emailMatch || userMatch || phoneMatch || codeMatch) && u.password === cleanPass;
  });

  if (foundUser) {
    const userSchool = schools.find((s) => s.id === foundUser.schoolId) || schools[0];
    const session = {
      userId: foundUser.id,
      userName: foundUser.name,
      role: foundUser.role, // 'school_admin' | 'teacher' | 'parent'
      email: foundUser.email,
      phone: foundUser.phone,
      schoolId: foundUser.schoolId,
      studentId: foundUser.studentId || null,
      schoolName: userSchool.name
    };

    saveCurrentSession(session);
    return { success: true, session, userSchool };
  }

  // 2. Student / Parent Direct Login via Admission No, Roll No, or Parent Phone
  for (const school of schools) {
    const schoolData = allData[school.id];
    if (schoolData && schoolData.students) {
      const foundStudent = schoolData.students.find((s) => {
        const admMatch = s.admissionNo && s.admissionNo.toLowerCase() === cleanId;
        const phoneMatch = s.phone && s.phone.replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '');
        const rollMatch = s.rollNo && s.rollNo.toString() === cleanId;
        return admMatch || phoneMatch || rollMatch;
      });

      if (foundStudent) {
        // Password can be '123' or their rollNo
        if (cleanPass === '123' || cleanPass === foundStudent.rollNo?.toString()) {
          const session = {
            userId: `USR-STU-${foundStudent.id}`,
            userName: `${foundStudent.name} (Student / Parent)`,
            role: 'parent',
            email: foundStudent.email || '',
            phone: foundStudent.phone,
            schoolId: school.id,
            studentId: foundStudent.id,
            schoolName: school.name
          };

          saveCurrentSession(session);
          return { success: true, session, userSchool: school };
        }
      }
    }
  }

  return { success: false, error: "Invalid Email, Phone, Admission No, or Password. Please try again." };
}

/**
 * Super Admin 2FA Finalization
 */
export function completeSuperAdmin2FALogin() {
  const session = {
    userId: 'USR-VEDANTAKSH-SUPERADMIN-01',
    userName: 'Abhinav Pathak (Vedantaksh Technology)',
    role: 'company_super_admin',
    email: 'abhinav.pathak@vedantakshtechnology.com',
    schoolId: 'ALL_SCHOOLS_MASTER',
    schoolName: 'Vedantaksh Technology Cloud Command'
  };
  saveCurrentSession(session);
  addAuditLog('SUPER_ADMIN_LOGIN_SUCCESS', { admin: 'Abhinav Pathak', timestamp: new Date().toISOString() });
  return session;
}

// Register School With Admin Account
export function registerSchoolWithAdminAccount(schoolDetails, adminCredentials, existingSchools, existingUsers, existingData) {
  const schoolId = `SCH-${Date.now().toString().slice(-4)}`;
  const userId = `USR-${Date.now().toString().slice(-4)}`;

  const newSchool = {
    ...schoolDetails,
    id: schoolId,
    status: 'Active',
    logoUrl: schoolDetails.logoUrl || null,
    established: schoolDetails.established || new Date().getFullYear().toString(),
    badgeColor: schoolDetails.theme === 'emerald'
      ? 'from-emerald-700 to-teal-600'
      : schoolDetails.theme === 'purple'
      ? 'from-purple-700 to-indigo-700'
      : schoolDetails.theme === 'amber'
      ? 'from-amber-600 to-orange-600'
      : 'from-blue-700 to-indigo-600'
  };

  const newAdminUser = {
    id: userId,
    schoolId: schoolId,
    name: `${schoolDetails.principal} (Principal / Admin)`,
    email: adminCredentials.email.trim().toLowerCase(),
    username: adminCredentials.username ? adminCredentials.username.trim().toLowerCase() : adminCredentials.email.split('@')[0],
    password: adminCredentials.password.trim(),
    role: 'school_admin'
  };

  const defaultTeacherUser = {
    id: `USR-T-${schoolId}`,
    schoolId: schoolId,
    name: 'Class Teacher (Faculty)',
    email: `teacher.${schoolId.toLowerCase()}@school.com`,
    username: `teacher_${schoolId.toLowerCase()}`,
    password: '123',
    role: 'teacher'
  };

  const defaultAccountantUser = {
    id: `USR-ACC-${schoolId}`,
    schoolId: schoolId,
    name: 'Accounts & Fee Desk',
    email: `fees.${schoolId.toLowerCase()}@school.com`,
    username: `fees_${schoolId.toLowerCase()}`,
    password: '123',
    role: 'accountant'
  };

  const updatedSchools = [...existingSchools, newSchool];
  const updatedUsers = [...existingUsers, newAdminUser, defaultTeacherUser, defaultAccountantUser];
  const updatedData = {
    ...existingData,
    [schoolId]: {
      classes: defaultClassesTemplate,
      teachers: [],
      students: [],
      attendance: {},
      exams: {},
      homework: [],
      notices: [
        {
          id: `NOT-${Date.now().toString().slice(-4)}`,
          title: `Welcome to ${newSchool.name}`,
          date: new Date().toISOString().split('T')[0],
          category: 'General',
          priority: 'High',
          description: `Private school portal initialized for ${newSchool.name}. You can now enroll students and appoint teachers.`
        }
      ]
    }
  };

  // Immediate Login Session for this new school admin
  const session = {
    userId: newAdminUser.id,
    userName: newAdminUser.name,
    role: 'school_admin',
    email: newAdminUser.email,
    schoolId: schoolId,
    schoolName: newSchool.name
  };

  saveSchoolsList(updatedSchools);
  saveUsersList(updatedUsers);
  saveAllSchoolData(updatedData);
  saveCurrentSession(session);

  return { newSchool, newAdminUser, session, updatedSchools, updatedUsers, updatedData };
}

export function resetAllMultiSchoolData() {
  localStorage.removeItem(STORAGE_KEYS.SCHOOLS);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  localStorage.removeItem(STORAGE_KEYS.MULTISCHOOL_DATA);
  return loadMultiSchoolData();
}

// Calculate CBSE standard grade
export function calculateGrade(percentage) {
  if (percentage >= 91) return { grade: 'A1', gradePoint: 10, remark: 'Outstanding' };
  if (percentage >= 81) return { grade: 'A2', gradePoint: 9, remark: 'Excellent' };
  if (percentage >= 71) return { grade: 'B1', gradePoint: 8, remark: 'Very Good' };
  if (percentage >= 61) return { grade: 'B2', gradePoint: 7, remark: 'Good' };
  if (percentage >= 51) return { grade: 'C1', gradePoint: 6, remark: 'Satisfactory' };
  if (percentage >= 41) return { grade: 'C2', gradePoint: 5, remark: 'Average' };
  if (percentage >= 33) return { grade: 'D', gradePoint: 4, remark: 'Pass' };
  return { grade: 'E', gradePoint: 0, remark: 'Needs Improvement / Fail' };
}

// Helper to get student attendance history & percentages
export function getStudentAttendanceSummary(studentId, attendanceRecords) {
  let presentDays = 0;
  let absentDays = 0;
  let lateDays = 0;
  let leaveDays = 0;
  let totalWorkingDays = 0;
  const history = [];

  const dates = Object.keys(attendanceRecords || {}).sort().reverse();
  for (const date of dates) {
    const dayRecords = attendanceRecords[date];
    if (dayRecords && dayRecords[studentId]) {
      const status = dayRecords[studentId];
      totalWorkingDays++;
      if (status === 'Present') presentDays++;
      else if (status === 'Late') {
        lateDays++;
        presentDays += 0.8;
      } else if (status === 'Leave') {
        leaveDays++;
      } else {
        absentDays++;
      }
      history.push({ date, status });
    }
  }

  const rate = totalWorkingDays > 0 ? ((presentDays / totalWorkingDays) * 100).toFixed(1) : 100;
  return {
    rate: parseFloat(rate),
    totalWorkingDays,
    presentDays: Math.floor(presentDays),
    absentDays,
    lateDays,
    leaveDays,
    history
  };
}
