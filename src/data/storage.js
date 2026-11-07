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

export function loadMultiSchoolData() {
  try {
    const schools = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOOLS)) || initialSchools;
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || initialUsers;
    const currentSession = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION)) || null;
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEYS.MULTISCHOOL_DATA)) || initialMultiSchoolData;
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';

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
      localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
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

// Register School With Admin Account
export function registerSchoolWithAdminAccount(schoolDetails, adminCredentials, existingSchools, existingUsers, existingData) {
  const schoolId = `SCH-${Date.now().toString().slice(-4)}`;
  const userId = `USR-${Date.now().toString().slice(-4)}`;

  const newSchool = {
    ...schoolDetails,
    id: schoolId,
    status: 'Active',
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
    name: `${schoolDetails.principal} (Admin)`,
    email: adminCredentials.email.trim().toLowerCase(),
    username: adminCredentials.username ? adminCredentials.username.trim().toLowerCase() : adminCredentials.email.split('@')[0],
    password: adminCredentials.password.trim(),
    role: 'school_admin'
  };

  const updatedSchools = [...existingSchools, newSchool];
  const updatedUsers = [...existingUsers, newAdminUser];
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
