// Initial Multi-School Dataset for VidyaSetu ERP

export const initialSchools = [
  {
    id: "SCH-1",
    name: "St. Xavier's International Academy",
    code: "CBSE-20491",
    board: "CBSE",
    affiliation: "Affiliated to CBSE, New Delhi | Affiliation No: 20491",
    principal: "Dr. K.K. Mathur",
    phone: "+91 11-28934500",
    email: "info@stxaviers.edu.in",
    address: "Sector 14, Main Institutional Area, New Delhi - 110001",
    city: "New Delhi",
    state: "Delhi",
    established: "1998",
    theme: "blue",
    badgeColor: "from-blue-700 to-indigo-600",
    status: "Active"
  },
  {
    id: "SCH-2",
    name: "Delhi Public Model School",
    code: "CBSE-41285",
    board: "CBSE",
    affiliation: "Affiliated to CBSE, New Delhi | Affiliation No: 41285",
    principal: "Mrs. Rachna Goel",
    phone: "+91 124-4589200",
    email: "contact@dpms-gurgaon.edu.in",
    address: "Golf Course Road, DLF Phase 5, Gurugram - 122002",
    city: "Gurugram",
    state: "Haryana",
    established: "2006",
    theme: "emerald",
    badgeColor: "from-emerald-700 to-teal-600",
    status: "Active"
  },
  {
    id: "SCH-3",
    name: "Saraswati Vidya Mandir Sr. Sec.",
    code: "RAJ-88192",
    board: "State Board",
    affiliation: "Recognized by Board of Secondary Education | Code: 88192",
    principal: "Pt. Rameshwar Dayal",
    phone: "+91 141-2678120",
    email: "admin@svmschooljaipur.org",
    address: "Bapu Nagar, Near University Circle, Jaipur - 302015",
    city: "Jaipur",
    state: "Rajasthan",
    established: "1992",
    theme: "amber",
    badgeColor: "from-amber-600 to-orange-600",
    status: "Active"
  }
];

// Initial Users with Credentials (School Admins, Teachers, Parents)
export const initialUsers = [
  // School 1 (St. Xavier's) Admin
  {
    id: "USR-SCH-1",
    schoolId: "SCH-1",
    name: "Dr. K.K. Mathur (Admin)",
    email: "xavier@school.com",
    username: "xavier_admin",
    password: "123",
    role: "school_admin"
  },
  // School 2 (DPS) Admin
  {
    id: "USR-SCH-2",
    schoolId: "SCH-2",
    name: "Mrs. Rachna Goel (Admin)",
    email: "dps@school.com",
    username: "dps_admin",
    password: "123",
    role: "school_admin"
  },
  // School 3 (Saraswati Vidya Mandir) Admin
  {
    id: "USR-SCH-3",
    schoolId: "SCH-3",
    name: "Pt. Rameshwar Dayal (Admin)",
    email: "svm@school.com",
    username: "svm_admin",
    password: "123",
    role: "school_admin"
  },
  // Teacher in School 1
  {
    id: "USR-T10",
    schoolId: "SCH-1",
    name: "Dr. Rajesh Sharma (Faculty / Teacher)",
    email: "rajesh@school.com",
    username: "rajesh_teacher",
    phone: "9876543210",
    password: "123",
    role: "teacher"
  },
  // Fee Counter / Accountant in School 1
  {
    id: "USR-ACC-1",
    schoolId: "SCH-1",
    name: "Suresh Gupta (Fee Counter / Accountant)",
    email: "accountant@school.com",
    username: "accountant",
    phone: "9812345678",
    password: "123",
    role: "accountant"
  },
  // Parent of Aarav (School 1)
  {
    id: "USR-P1001",
    schoolId: "SCH-1",
    studentId: "STU-1001",
    name: "Manoj Sharma (Aarav's Parent)",
    email: "parent@school.com",
    phone: "9871122334",
    password: "123",
    role: "parent"
  }
];

// Standard 12 Classes template for any school
export const defaultClassesTemplate = [
  { id: "1", name: "Class 1", sections: ["A", "B"], stream: "Primary", classTeacherId: "T1" },
  { id: "2", name: "Class 2", sections: ["A", "B"], stream: "Primary", classTeacherId: "T2" },
  { id: "3", name: "Class 3", sections: ["A", "B"], stream: "Primary", classTeacherId: "T3" },
  { id: "4", name: "Class 4", sections: ["A", "B"], stream: "Primary", classTeacherId: "T4" },
  { id: "5", name: "Class 5", sections: ["A", "B"], stream: "Primary", classTeacherId: "T5" },
  { id: "6", name: "Class 6", sections: ["A", "B", "C"], stream: "Middle", classTeacherId: "T6" },
  { id: "7", name: "Class 7", sections: ["A", "B"], stream: "Middle", classTeacherId: "T7" },
  { id: "8", name: "Class 8", sections: ["A", "B"], stream: "Middle", classTeacherId: "T8" },
  { id: "9", name: "Class 9", sections: ["A", "B", "C"], stream: "Secondary", classTeacherId: "T9" },
  { id: "10", name: "Class 10", sections: ["A", "B", "C"], stream: "Secondary", classTeacherId: "T10" },
  { id: "11", name: "Class 11", sections: ["Science", "Commerce", "Arts"], stream: "Sr. Secondary", classTeacherId: "T11" },
  { id: "12", name: "Class 12", sections: ["Science", "Commerce", "Arts"], stream: "Sr. Secondary", classTeacherId: "T12" }
];

// School 1 (St. Xavier's) Dataset
export const school1Data = {
  classes: defaultClassesTemplate,
  teachers: [
    {
      id: "T10",
      name: "Dr. Rajesh Sharma",
      designation: "PGT Mathematics & Senior HOD",
      subject: "Mathematics",
      phone: "+91 98765 43210",
      email: "rajesh.sharma@stxaviers.edu.in",
      qualification: "M.Sc., Ph.D. in Mathematics, B.Ed.",
      experience: "14 Years",
      classInCharge: "Class 10-A",
      gender: "Male"
    },
    {
      id: "T9",
      name: "Mrs. Sunita Verma",
      designation: "TGT Science & Lab In-charge",
      subject: "Science & Biology",
      phone: "+91 98112 34567",
      email: "sunita.verma@stxaviers.edu.in",
      qualification: "M.Sc. Zoology, B.Ed.",
      experience: "9 Years",
      classInCharge: "Class 9-A",
      gender: "Female"
    },
    {
      id: "T8",
      name: "Mr. Amit Kumar Tiwari",
      designation: "TGT English & Debate Club Head",
      subject: "English Literature",
      phone: "+91 94567 89012",
      email: "amit.tiwari@stxaviers.edu.in",
      qualification: "M.A. English, B.Ed.",
      experience: "8 Years",
      classInCharge: "Class 8-A",
      gender: "Male"
    },
    {
      id: "T7",
      name: "Mrs. Meenakshi Sundaram",
      designation: "TGT Social Studies",
      subject: "Social Science & History",
      phone: "+91 97654 32198",
      email: "meenakshi.s@stxaviers.edu.in",
      qualification: "M.A. History, B.Ed.",
      experience: "11 Years",
      classInCharge: "Class 7-A",
      gender: "Female"
    },
    {
      id: "T6",
      name: "Mr. Vikramaditya Rathore",
      designation: "PGT Computer Science",
      subject: "Computer Science & AI",
      phone: "+91 99887 76655",
      email: "vikram.rathore@stxaviers.edu.in",
      qualification: "MCA, B.Tech CS",
      experience: "7 Years",
      classInCharge: "Class 6-A",
      gender: "Male"
    }
  ],
  students: [
    {
      id: "STU-1001",
      admissionNo: "ADM-2023-1001",
      rollNo: "101",
      name: "Aarav Sharma",
      className: "Class 10",
      section: "A",
      fatherName: "Mr. Manoj Sharma",
      motherName: "Mrs. Geeta Sharma",
      phone: "+91 98711 22334",
      email: "manoj.sharma99@gmail.com",
      address: "B-42, Shanti Vihar, New Delhi",
      dob: "2010-04-15",
      gender: "Male",
      bloodGroup: "B+",
      attendancePercentage: 94.5,
      feeStatus: "Paid",
      feeAmount: 36000,
      feePaid: 36000
    },
    {
      id: "STU-1002",
      admissionNo: "ADM-2023-1002",
      rollNo: "102",
      name: "Ananya Verma",
      className: "Class 10",
      section: "A",
      fatherName: "Dr. Alok Verma",
      motherName: "Dr. Shalini Verma",
      phone: "+91 98188 44321",
      email: "alok.verma@yahoo.com",
      address: "C-12, Green Park Extension, New Delhi",
      dob: "2010-08-22",
      gender: "Female",
      bloodGroup: "O+",
      attendancePercentage: 97.2,
      feeStatus: "Paid",
      feeAmount: 36000,
      feePaid: 36000
    },
    {
      id: "STU-1003",
      admissionNo: "ADM-2023-1003",
      rollNo: "103",
      name: "Rohan Patel",
      className: "Class 10",
      section: "A",
      fatherName: "Mr. Suresh Patel",
      motherName: "Mrs. Rekha Patel",
      phone: "+91 98250 67890",
      email: "suresh.patel@rediffmail.com",
      address: "Flat 402, Royal Residency, New Delhi",
      dob: "2010-01-10",
      gender: "Male",
      bloodGroup: "A+",
      attendancePercentage: 78.4,
      feeStatus: "Partial",
      feeAmount: 36000,
      feePaid: 24000
    },
    {
      id: "STU-1004",
      admissionNo: "ADM-2023-1004",
      rollNo: "104",
      name: "Priya Nair",
      className: "Class 10",
      section: "A",
      fatherName: "Mr. Ramesh Nair",
      motherName: "Mrs. Lakshmi Nair",
      phone: "+91 97455 12345",
      email: "ramesh.nair@gmail.com",
      address: "Plot 89, Mayur Vihar, New Delhi",
      dob: "2010-11-05",
      gender: "Female",
      bloodGroup: "AB+",
      attendancePercentage: 91.8,
      feeStatus: "Paid",
      feeAmount: 36000,
      feePaid: 36000
    },
    {
      id: "STU-1005",
      admissionNo: "ADM-2023-1005",
      rollNo: "105",
      name: "Vihaan Gupta",
      className: "Class 10",
      section: "A",
      fatherName: "Mr. Rajiv Gupta",
      motherName: "Mrs. Anita Gupta",
      phone: "+91 99100 88776",
      email: "rajiv.gupta@corp.in",
      address: "H-15, Model Town, New Delhi",
      dob: "2010-03-30",
      gender: "Male",
      bloodGroup: "O-",
      attendancePercentage: 68.5,
      feeStatus: "Pending",
      feeAmount: 36000,
      feePaid: 12000
    }
  ],
  attendance: {
    "2026-11-04": {
      "STU-1001": "Present",
      "STU-1002": "Present",
      "STU-1003": "Absent",
      "STU-1004": "Present",
      "STU-1005": "Absent"
    },
    "2026-11-03": {
      "STU-1001": "Present",
      "STU-1002": "Present",
      "STU-1003": "Absent",
      "STU-1004": "Present",
      "STU-1005": "Absent"
    }
  },
  exams: {
    "STU-1001": [
      {
        term: "Mid-Term Examination (अर्धवार्षिक परीक्षा)",
        session: "2026-2027",
        date: "October 2026",
        maxTotal: 500,
        obtainedTotal: 462,
        percentage: 92.4,
        overallGrade: "A1",
        rank: 2,
        attendancePercentage: 95.0,
        teacherRemarks: "Outstanding academic dedication! Aarav is attentive, disciplined, and very strong in analytical skills.",
        subjects: [
          { name: "Mathematics", maxMarks: 100, marksObtained: 98, grade: "A1", classAvg: 74, highest: 98 },
          { name: "Science", maxMarks: 100, marksObtained: 94, grade: "A1", classAvg: 71, highest: 96 },
          { name: "English Language & Lit", maxMarks: 100, marksObtained: 88, grade: "A2", classAvg: 76, highest: 92 },
          { name: "Hindi Course-A", maxMarks: 100, marksObtained: 90, grade: "A1", classAvg: 78, highest: 94 },
          { name: "Social Science", maxMarks: 100, marksObtained: 92, grade: "A1", classAvg: 70, highest: 95 }
        ],
        coScholastic: [
          { activity: "Work Education & Computer", grade: "A" },
          { activity: "Art & Cultural Activities", grade: "A" },
          { activity: "Physical & Health Education", grade: "A" },
          { activity: "Discipline & Value Education", grade: "A+" }
        ]
      }
    ],
    "STU-1002": [
      {
        term: "Mid-Term Examination (अर्धवार्षिक परीक्षा)",
        session: "2026-2027",
        date: "October 2026",
        maxTotal: 500,
        obtainedTotal: 479,
        percentage: 95.8,
        overallGrade: "A1",
        rank: 1,
        attendancePercentage: 97.5,
        teacherRemarks: "Class topper with exemplary conceptual clarity and participation in co-curriculars.",
        subjects: [
          { name: "Mathematics", maxMarks: 100, marksObtained: 96, grade: "A1", classAvg: 74, highest: 98 },
          { name: "Science", maxMarks: 100, marksObtained: 96, grade: "A1", classAvg: 71, highest: 96 },
          { name: "English Language & Lit", maxMarks: 100, marksObtained: 92, grade: "A1", classAvg: 76, highest: 92 },
          { name: "Hindi Course-A", maxMarks: 100, marksObtained: 95, grade: "A1", classAvg: 78, highest: 95 },
          { name: "Social Science", maxMarks: 100, marksObtained: 100, grade: "A1", classAvg: 70, highest: 100 }
        ],
        coScholastic: [
          { activity: "Work Education & Computer", grade: "A+" },
          { activity: "Art & Cultural Activities", grade: "A+" },
          { activity: "Physical & Health Education", grade: "A" },
          { activity: "Discipline & Value Education", grade: "A+" }
        ]
      }
    ]
  },
  homework: [
    {
      id: "HW-1",
      className: "Class 10",
      section: "A",
      subject: "Mathematics",
      teacherName: "Dr. Rajesh Sharma",
      title: "Quadratic Equations - Ex 4.3 (Q 1 to 7)",
      description: "Solve all word problems in Ex 4.3 in your fair register.",
      assignedDate: "2026-11-04",
      dueDate: "2026-11-05"
    }
  ],
  notices: [
    {
      id: "NOT-1",
      title: "Parent-Teacher Meeting (PTM) for Term 1 Results",
      date: "2026-11-08",
      category: "Academic",
      priority: "High",
      description: "Dear Parents, the Parent-Teacher Meeting is scheduled for Saturday, November 8th, 2026."
    }
  ]
};

// School 2 (Delhi Public Model School, Gurugram) Dataset
export const school2Data = {
  classes: defaultClassesTemplate,
  teachers: [
    {
      id: "T201",
      name: "Mr. Sandeep Mathur",
      designation: "PGT Physics & Senior Faculty",
      subject: "Physics",
      phone: "+91 98114 55667",
      email: "sandeep.mathur@dpms.edu.in",
      qualification: "M.Sc. Physics, B.Ed.",
      experience: "12 Years",
      classInCharge: "Class 10-A",
      gender: "Male"
    },
    {
      id: "T202",
      name: "Mrs. Shalini Chhabra",
      designation: "TGT Mathematics",
      subject: "Mathematics",
      phone: "+91 98223 88990",
      email: "shalini.c@dpms.edu.in",
      qualification: "M.Sc. Maths, B.Ed.",
      experience: "10 Years",
      classInCharge: "Class 9-A",
      gender: "Female"
    }
  ],
  students: [
    {
      id: "STU-2001",
      admissionNo: "DPMS-2024-001",
      rollNo: "101",
      name: "Devansh Singhania",
      className: "Class 10",
      section: "A",
      fatherName: "Mr. Vikram Singhania",
      motherName: "Mrs. Natasha Singhania",
      phone: "+91 98105 11223",
      email: "vikram.singhania@gmail.com",
      address: "Tower 4, The Aralias, Golf Course Road, Gurugram",
      dob: "2010-09-14",
      gender: "Male",
      bloodGroup: "B+",
      attendancePercentage: 96.5,
      feeStatus: "Paid",
      feeAmount: 48000,
      feePaid: 48000
    },
    {
      id: "STU-2002",
      admissionNo: "DPMS-2024-002",
      rollNo: "102",
      name: "Myra Kapoor",
      className: "Class 10",
      section: "A",
      fatherName: "Mr. Siddharth Kapoor",
      motherName: "Mrs. Ritu Kapoor",
      phone: "+91 98733 44556",
      email: "siddharth.kapoor@corp.com",
      address: "House 28, South City 1, Gurugram",
      dob: "2010-12-01",
      gender: "Female",
      bloodGroup: "O+",
      attendancePercentage: 93.0,
      feeStatus: "Paid",
      feeAmount: 48000,
      feePaid: 48000
    }
  ],
  attendance: {
    "2026-11-04": {
      "STU-2001": "Present",
      "STU-2002": "Present"
    }
  },
  exams: {
    "STU-2001": [
      {
        term: "Mid-Term Examination 2026",
        session: "2026-2027",
        date: "October 2026",
        maxTotal: 500,
        obtainedTotal: 455,
        percentage: 91.0,
        overallGrade: "A1",
        rank: 1,
        attendancePercentage: 96.5,
        teacherRemarks: "Devansh is a passionate learner with high analytical acumen.",
        subjects: [
          { name: "Mathematics", maxMarks: 100, marksObtained: 94, grade: "A1", classAvg: 75 },
          { name: "Science", maxMarks: 100, marksObtained: 92, grade: "A1", classAvg: 72 },
          { name: "English", maxMarks: 100, marksObtained: 90, grade: "A1", classAvg: 78 },
          { name: "Hindi", maxMarks: 100, marksObtained: 89, grade: "A2", classAvg: 80 },
          { name: "Social Science", maxMarks: 100, marksObtained: 90, grade: "A1", classAvg: 74 }
        ],
        coScholastic: [
          { activity: "Computer Applications", grade: "A+" },
          { activity: "Sports & Athletics", grade: "A" }
        ]
      }
    ]
  },
  homework: [
    {
      id: "HW-DPMS-1",
      className: "Class 10",
      section: "A",
      subject: "Physics",
      teacherName: "Mr. Sandeep Mathur",
      title: "Light & Optics Ray Diagrams",
      description: "Draw ray diagrams for concave and convex mirrors in practical file.",
      assignedDate: "2026-11-04",
      dueDate: "2026-11-06"
    }
  ],
  notices: [
    {
      id: "NOT-DPMS-1",
      title: "Inter-School Science Olympiad Registrations",
      date: "2026-11-12",
      category: "Academic",
      priority: "Normal",
      description: "Students interested in participating in the Science Olympiad must register by Friday."
    }
  ]
};

// School 3 (Saraswati Vidya Mandir, Jaipur) Dataset
export const school3Data = {
  classes: defaultClassesTemplate,
  teachers: [
    {
      id: "T301",
      name: "Shri Radhey Shyam Sharma",
      designation: "वरिष्ठ अध्यापक (Senior Teacher)",
      subject: "संस्कृत व हिंदी (Sanskrit & Hindi)",
      phone: "+91 94140 22334",
      email: "radheshyam@svmschooljaipur.org",
      qualification: "M.A. Sanskrit, M.A. Hindi, B.Ed.",
      experience: "16 Years",
      classInCharge: "Class 10-A",
      gender: "Male"
    }
  ],
  students: [
    {
      id: "STU-3001",
      admissionNo: "SVM-2025-101",
      rollNo: "101",
      name: "Yashvardhan Rathore",
      className: "Class 10",
      section: "A",
      fatherName: "Shri Bhanwar Singh Rathore",
      motherName: "Smt. Pushpa Kanwar",
      phone: "+91 98290 88776",
      email: "bhanwar.singh@gmail.com",
      address: "Plot 15, Hanuman Nagar, Vaishali, Jaipur",
      dob: "2010-07-11",
      gender: "Male",
      bloodGroup: "A+",
      attendancePercentage: 98.0,
      feeStatus: "Paid",
      feeAmount: 24000,
      feePaid: 24000
    }
  ],
  attendance: {
    "2026-11-04": {
      "STU-3001": "Present"
    }
  },
  exams: {
    "STU-3001": [
      {
        term: "अर्धवार्षिक परीक्षा 2026",
        session: "2026-2027",
        date: "October 2026",
        maxTotal: 500,
        obtainedTotal: 440,
        percentage: 88.0,
        overallGrade: "A2",
        rank: 1,
        attendancePercentage: 98.0,
        teacherRemarks: "यशवर्धन अत्यंत संस्कारी और अध्ययनशील छात्र है।",
        subjects: [
          { name: "गणित (Mathematics)", maxMarks: 100, marksObtained: 88, grade: "A2", classAvg: 68 },
          { name: "विज्ञान (Science)", maxMarks: 100, marksObtained: 90, grade: "A1", classAvg: 70 },
          { name: "हिंदी (Hindi)", maxMarks: 100, marksObtained: 92, grade: "A1", classAvg: 75 },
          { name: "अंग्रेजी (English)", maxMarks: 100, marksObtained: 82, grade: "A2", classAvg: 65 },
          { name: "सामाजिक विज्ञान (Social Science)", maxMarks: 100, marksObtained: 88, grade: "A2", classAvg: 72 }
        ],
        coScholastic: [
          { activity: "योग व शारीरिक शिक्षा", grade: "A+" },
          { activity: "नैतिक शिक्षा व अनुशासन", grade: "A+" }
        ]
      }
    ]
  },
  homework: [
    {
      id: "HW-SVM-1",
      className: "Class 10",
      section: "A",
      subject: "हिंदी",
      teacherName: "Shri Radhey Shyam",
      title: "सूरदास के पद - प्रश्नोत्तर",
      description: "पाठ्यपुस्तक के सभी अभ्यास प्रश्नोत्तर अपनी उत्तर-पुस्तिका में हल करें।",
      assignedDate: "2026-11-04",
      dueDate: "2026-11-05"
    }
  ],
  notices: [
    {
      id: "NOT-SVM-1",
      title: "वार्षिक खेलकूद व सांस्कृतिक उत्सव",
      date: "2026-11-20",
      category: "Cultural",
      priority: "Normal",
      description: "विद्यालय का वार्षिक खेल महोत्सव 20 नवंबर से प्रारंभ होगा।"
    }
  ]
};

// Initial Multi-School Master Map
export const initialMultiSchoolData = {
  "SCH-1": school1Data,
  "SCH-2": school2Data,
  "SCH-3": school3Data
};
