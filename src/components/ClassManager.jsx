import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  Contact,
  Plus,
  BookOpen,
  ArrowRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function ClassManager({
  classes,
  students,
  teachers,
  onSelectClassFilter,
  setActiveTab,
  t
}) {
  const [selectedStream, setSelectedStream] = useState('All');

  const filteredClasses = selectedStream === 'All'
    ? classes
    : classes.filter(c => c.stream === selectedStream);

  const streams = ['All', 'Primary', 'Middle', 'Secondary', 'Sr. Secondary'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Classes & Sections (कक्षाएं एवं अनुभाग)</h2>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              {classes.length} Total Grades
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Overview of standard 1st to 12th curriculum, sections, student capacity, and appointed in-charge teachers.
          </p>
        </div>

        {/* Stream Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {streams.map((stream) => (
            <button
              key={stream}
              onClick={() => setSelectedStream(stream)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedStream === stream
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {stream}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const classStudents = students.filter(s => s.className === cls.name);
          const teacher = teachers.find(t => t.id === cls.classTeacherId);
          
          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {cls.stream} School
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-1">{cls.name}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                    {cls.id}
                  </div>
                </div>

                {/* Sections & Strength */}
                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Sections:</span>
                    <div className="flex gap-1">
                      {cls.sections.map((sec) => (
                        <span key={sec} className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-xs">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">Enrolled Students:</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {classStudents.length} Students
                    </span>
                  </div>

                  {/* Class Teacher */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Class Teacher</p>
                    {teacher ? (
                      <div className="mt-1 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{teacher.name}</p>
                          <p className="text-[11px] text-slate-500">{teacher.phone}</p>
                        </div>
                        <a
                          href={`tel:${teacher.phone}`}
                          className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition"
                          title="Call Class Teacher"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 font-medium mt-1">To be assigned</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    onSelectClassFilter(cls.name);
                    setActiveTab('students');
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition"
                >
                  View Students <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    onSelectClassFilter(cls.name);
                    setActiveTab('attendance');
                  }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >
                  Mark Hazri
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
