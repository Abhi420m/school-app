-- ==============================================================================
-- SCHOOL PARENT APP - COMPLETE SUPABASE / POSTGRESQL DATABASE SCHEMA
-- Matches Specification Section 4 & 5 (Tables, Foreign Keys, RLS, Audit Logs)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. SETUP & LOGIN TABLES
-- ==============================================================================

-- Schools table
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    board VARCHAR(50) DEFAULT 'CBSE',
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    logo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Academic Years
CREATE TABLE IF NOT EXISTS public.academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g. '2026-2027'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users (Admin, Teacher, Parent)
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent', 'superadmin');

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(100),
    role user_role NOT NULL DEFAULT 'parent',
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g. 'Class 10'
    numeric_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- e.g. 'A', 'B', 'Science'
    class_teacher_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. 'Mathematics', 'Science'
    code VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. STUDENT, PARENT & TEACHER TABLES
-- ==============================================================================

-- Students
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    admission_no VARCHAR(50) UNIQUE NOT NULL,
    roll_no VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    photo TEXT,
    section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    address TEXT,
    status VARCHAR(20) DEFAULT 'active', -- active, passed_out, tc_issued
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parents profile
CREATE TABLE IF NOT EXISTS public.parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(50) DEFAULT 'Father', -- Father, Mother, Guardian
    occupation VARCHAR(100),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-Many: Student <-> Parents (Sibling support: 1 parent has multiple students)
CREATE TABLE IF NOT EXISTS public.student_parents (
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.parents(id) ON DELETE CASCADE,
    is_primary_contact BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (student_id, parent_id)
);

-- Teachers Profile
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE,
    qualification VARCHAR(255),
    designation VARCHAR(100),
    experience VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teacher Assignments (Which teacher teaches which subject in which section)
CREATE TABLE IF NOT EXISTS public.teacher_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (teacher_id, section_id, subject_id)
);

-- ==============================================================================
-- 3. ATTENDANCE & LEAVES (CORE WORKFLOW)
-- ==============================================================================

CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'leave');

CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_status NOT NULL DEFAULT 'present',
    marked_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    marked_at TIMESTAMPTZ DEFAULT NOW(),
    remarks VARCHAR(255),
    UNIQUE (student_id, date) -- Constraint from Spec Section 4
);

CREATE INDEX idx_attendance_student_date ON public.attendance (student_id, date);
CREATE INDEX idx_attendance_date ON public.attendance (date);

-- Leave Requests applied by Parents
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    applied_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. FEE & PAYMENTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    fee_type VARCHAR(100) NOT NULL, -- Tuition, Admission, Sports, Exam
    amount DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.student_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    fee_structure_id UUID REFERENCES public.fee_structures(id) ON DELETE CASCADE,
    amount_due DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, partial, paid
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_fee_id UUID REFERENCES public.student_fees(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    mode VARCHAR(50) DEFAULT 'UPI', -- UPI, Cash, Card, NetBanking, Cheque
    transaction_id VARCHAR(100),
    receipt_no VARCHAR(100) UNIQUE NOT NULL,
    paid_on DATE DEFAULT CURRENT_DATE,
    received_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. EXAM & RESULTS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    academic_year_id UUID REFERENCES public.academic_years(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Unit Test 1', 'Mid-Term', 'Final Annual'
    max_marks INT DEFAULT 100,
    status VARCHAR(20) DEFAULT 'draft', -- draft, ongoing, completed, published
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5, 2) NOT NULL,
    entered_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (exam_id, student_id, subject_id)
);

-- ==============================================================================
-- 6. COMMUNICATION (NOTICES, HOMEWORK, REMARKS, MESSAGES)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    attachment TEXT,
    target VARCHAR(50) DEFAULT 'all', -- 'all', 'class', 'teachers', 'parents'
    section_id UUID REFERENCES public.sections(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    attachment TEXT,
    posted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.remarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    text TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'good', -- 'good', 'concern', 'disciplinary'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'attendance', -- attendance, fee, exam, notice, homework
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    fcm_token TEXT NOT NULL,
    platform VARCHAR(20) DEFAULT 'android', -- android, ios, web
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, fcm_token)
);

-- ==============================================================================
-- 7. SAFETY & AUDIT LOGS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. Admin can access everything in their school
CREATE POLICY admin_all_students ON public.students
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid() 
      AND users.role = 'admin' 
      AND users.school_id = students.school_id
  )
);

-- 2. Teacher can view students in assigned sections
CREATE POLICY teacher_assigned_students ON public.students
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teachers t
    JOIN public.teacher_assignments ta ON ta.teacher_id = t.id
    WHERE t.user_id = auth.uid()
      AND ta.section_id = students.section_id
  )
);

-- 3. Parents can only view their own linked children
CREATE POLICY parent_linked_students ON public.students
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.student_parents sp
    JOIN public.parents p ON p.id = sp.parent_id
    WHERE p.user_id = auth.uid()
      AND sp.student_id = students.id
  )
);

-- Attendance: Parents can only view their linked children's attendance
CREATE POLICY parent_child_attendance ON public.attendance
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.student_parents sp
    JOIN public.parents p ON p.id = sp.parent_id
    WHERE p.user_id = auth.uid()
      AND sp.student_id = attendance.student_id
  )
);

-- Attendance: Teacher can insert/update attendance for assigned sections
CREATE POLICY teacher_mark_attendance ON public.attendance
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.students s
    JOIN public.teacher_assignments ta ON ta.section_id = s.section_id
    JOIN public.teachers t ON t.id = ta.teacher_id
    WHERE t.user_id = auth.uid()
      AND s.id = attendance.student_id
  )
);
