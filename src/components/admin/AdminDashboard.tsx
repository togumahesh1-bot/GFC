import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  FileSpreadsheet, 
  Download, 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Save, 
  Eye, 
  ShieldCheck, 
  Award,
  Sparkles,
  Calculator,
  Upload
} from 'lucide-react';
import { useStudents } from '../../context/StudentContext';
import { Student, SubjectResult, SemesterResult } from '../../types/student';
import { STANDARD_SUBJECTS, INSTITUTION_INFO } from '../../data/mockAcademicData';
import { calculateGrade, computeSemesterSummary } from '../../utils/academicCalculations';

export const AdminDashboard: React.FC = () => {
  const { 
    students, 
    addStudent, 
    deleteStudent, 
    saveSemesterResult, 
    togglePublishStatus, 
    resetToDefaultData, 
    exportResultsCSV, 
    exportToJSON,
    lookupResult,
    setActiveView 
  } = useStudents();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'roster' | 'marks_entry' | 'tools'>('roster');

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    rollNumber: '',
    registrationNumber: '',
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '2004-01-01',
    gender: 'Male' as const,
    branch: 'Computer Science & Engineering' as const,
    branchCode: 'CSE' as const,
    currentSemester: 7,
    batchYear: '2021-2025',
    section: 'A',
    email: '',
    phone: '+91 63724 81457',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    collegeName: INSTITUTION_INFO.name,
    status: 'Active' as const,
  });

  // Marks Entry State
  const [marksStudentId, setMarksStudentId] = useState<string>(students[0]?.id || '');
  const [examSession, setExamSession] = useState('Nov/Dec 2025 Regular');
  const [semesterNumber, setSemesterNumber] = useState(7);
  const [inputSubjects, setInputSubjects] = useState<SubjectResult[]>(() => {
    return STANDARD_SUBJECTS.map((sub) => {
      const internal = 25;
      const external = 55;
      const total = internal + external;
      const grade = calculateGrade(total);
      return {
        subjectCode: sub.code,
        subjectName: sub.name,
        credits: sub.credits,
        internalMarks: internal,
        externalMarks: external,
        totalMarks: total,
        gradePoint: grade.gradePoint,
        letterGrade: grade.letterGrade,
        status: grade.status,
      };
    });
  });

  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Handle Marks update in form
  const handleMarkChange = (index: number, field: 'internalMarks' | 'externalMarks', value: number) => {
    setInputSubjects((prev) => {
      const updated = [...prev];
      const target = { ...updated[index] };
      const val = Math.max(0, Number(value) || 0);

      if (field === 'internalMarks') target.internalMarks = Math.min(30, val);
      if (field === 'externalMarks') target.externalMarks = Math.min(70, val);

      target.totalMarks = target.internalMarks + target.externalMarks;
      const grade = calculateGrade(target.totalMarks);
      target.gradePoint = grade.gradePoint;
      target.letterGrade = grade.letterGrade;
      target.status = grade.status;

      updated[index] = target;
      return updated;
    });
  };

  const computedSummary = computeSemesterSummary(inputSubjects);

  const handleSaveMarks = () => {
    if (!marksStudentId) return;

    const student = students.find((s) => s.id === marksStudentId);
    if (!student) return;

    const newSemResult: SemesterResult = {
      id: `sem-${semesterNumber}-${student.rollNumber}`,
      studentId: student.id,
      semesterNumber,
      semesterName: `IV Year I Semester (R20)`,
      examSession,
      examType: 'Regular',
      publishDate: new Date().toISOString().slice(0, 10),
      isPublished: true,
      memoNumber: `NSRIT/EXAM/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
      subjects: inputSubjects,
      totalCredits: computedSummary.totalCredits,
      creditsSecured: computedSummary.creditsSecured,
      totalMarks: computedSummary.totalMarks,
      maxMarks: computedSummary.maxMarks,
      percentage: computedSummary.percentage,
      sgpa: computedSummary.sgpa,
      cgpa: computedSummary.sgpa,
      resultStatus: computedSummary.resultStatus,
    };

    saveSemesterResult(student.id, newSemResult);
    setSaveSuccessMessage(`Successfully updated & published semester result for ${student.fullName} (${student.rollNumber})!`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.rollNumber) return;

    const created = addStudent(newStudent);
    setShowAddStudentModal(false);
    setMarksStudentId(created.id);
    setSaveSuccessMessage(`Student ${created.fullName} added successfully to examination database.`);
    setTimeout(() => setSaveSuccessMessage(null), 4000);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = selectedBranch === 'ALL' || s.branchCode === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Autonomous Examination Cell Administration
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Student & Result Management Portal
          </h2>
        </div>

        {/* Global Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Student</span>
          </button>

          <button
            onClick={exportResultsCSV}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            title="Download CSV for Excel"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={exportToJSON}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>Backup JSON</span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'roster'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Directory ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('marks_entry')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'marks_entry'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Marks Entry & SGPA Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'tools'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>System Reset & Tools</span>
        </button>
      </div>

      {/* TAB 1: STUDENT ROSTER */}
      {activeTab === 'roster' && (
        <div>
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, roll no..."
                className="w-full bg-[#12151e] border border-zinc-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              {['ALL', 'CSE', 'ECE', 'AI&DS', 'MECH'].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBranch(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedBranch === b
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'bg-[#12151e] text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#12151e] shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181d2a] text-zinc-300 font-bold uppercase tracking-wider text-[11px] border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Branch</th>
                  <th className="py-3 px-3">Sem</th>
                  <th className="py-3 px-3 text-center">CGPA</th>
                  <th className="py-3 px-3 text-center">Latest Result</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredStudents.map((st) => {
                  const latestSem = st.semesters[0];
                  return (
                    <tr key={st.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={st.avatarUrl}
                          alt={st.fullName}
                          className="w-9 h-9 rounded-lg object-cover border border-zinc-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{st.fullName}</div>
                          <div className="text-[11px] text-zinc-400">{st.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">{st.rollNumber}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                          {st.branchCode}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-zinc-300">Sem {st.currentSemester}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400">
                        {st.overallCgpa > 0 ? st.overallCgpa.toFixed(2) : 'N/A'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {latestSem ? (
                          <button
                            onClick={() => togglePublishStatus(st.id, latestSem.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                              latestSem.isPublished
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                            }`}
                            title="Click to toggle result publishing"
                          >
                            {latestSem.isPublished ? 'PUBLISHED' : 'DRAFT (HIDDEN)'}
                          </button>
                        ) : (
                          <span className="text-zinc-600">No Exams</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              lookupResult(st.rollNumber);
                              setActiveView('marksheet');
                            }}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white"
                            title="View Official Marksheet"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                          </button>

                          <button
                            onClick={() => {
                              setMarksStudentId(st.id);
                              setActiveTab('marks_entry');
                            }}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white"
                            title="Edit / Enter Marks"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete student record for ${st.fullName}?`)) {
                                deleteStudent(st.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950 text-zinc-400 hover:text-red-400"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MARKS ENTRY & SGPA CALCULATOR */}
      {activeTab === 'marks_entry' && (
        <div className="bg-[#12151e] border border-zinc-800 rounded-2xl p-5 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-400" />
                Semester Marks Entry & SGPA Calculator
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Enter internal and external marks. Grades, SGPA, and Result Status calculate automatically in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Select Student</label>
                <select
                  value={marksStudentId}
                  onChange={(e) => setMarksStudentId(e.target.value)}
                  className="bg-[#090b10] border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-blue-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.rollNumber} - {s.fullName} ({s.branchCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">Exam Session</label>
                <input
                  type="text"
                  value={examSession}
                  onChange={(e) => setExamSession(e.target.value)}
                  className="bg-[#090b10] border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium w-44"
                />
              </div>
            </div>
          </div>

          {/* Marks Table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800 mb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181d2a] text-zinc-300 font-bold uppercase text-[11px] border-b border-zinc-800">
                <tr>
                  <th className="py-2.5 px-3">Subject Code</th>
                  <th className="py-2.5 px-4">Subject Title</th>
                  <th className="py-2.5 px-2 text-center">Credits</th>
                  <th className="py-2.5 px-3 text-center">Internal (Max 30)</th>
                  <th className="py-2.5 px-3 text-center">External (Max 70)</th>
                  <th className="py-2.5 px-3 text-center">Total</th>
                  <th className="py-2.5 px-2 text-center">Grade</th>
                  <th className="py-2.5 px-2 text-center">Points</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {inputSubjects.map((sub, idx) => (
                  <tr key={sub.subjectCode} className="hover:bg-zinc-800/20">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{sub.subjectCode}</td>
                    <td className="py-2.5 px-4 font-semibold text-white">{sub.subjectName}</td>
                    <td className="py-2.5 px-2 text-center font-mono">{sub.credits}</td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={sub.internalMarks}
                        onChange={(e) => handleMarkChange(idx, 'internalMarks', Number(e.target.value))}
                        className="w-16 bg-[#090b10] border border-zinc-700 rounded-lg py-1 px-2 text-center font-mono text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="70"
                        value={sub.externalMarks}
                        onChange={(e) => handleMarkChange(idx, 'externalMarks', Number(e.target.value))}
                        className="w-16 bg-[#090b10] border border-zinc-700 rounded-lg py-1 px-2 text-center font-mono text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-white">{sub.totalMarks}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold text-blue-400">{sub.letterGrade}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold">{sub.gradePoint}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Computed Summary KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-[#0d1017] border border-zinc-800 text-center mb-6">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Total Credits</span>
              <span className="text-base font-black font-mono text-white">{computedSummary.totalCredits}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Credits Secured</span>
              <span className="text-base font-black font-mono text-emerald-400">{computedSummary.creditsSecured}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Percentage</span>
              <span className="text-base font-black font-mono text-white">{computedSummary.percentage}%</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-400 uppercase font-bold block">Calculated SGPA</span>
              <span className="text-lg font-black font-mono text-blue-400">{computedSummary.sgpa} / 10.0</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Result Status</span>
              <span className="text-xs font-black text-amber-400">{computedSummary.resultStatus}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleSaveMarks}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Semester Result</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: TOOLS & RESET */}
      {activeTab === 'tools' && (
        <div className="bg-[#12151e] border border-zinc-800 rounded-2xl p-6 shadow-xl max-w-xl">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-amber-400" />
            Database & System Operations
          </h3>
          <p className="text-xs text-zinc-400 mb-6">
            Manage your offline storage database. All student modifications, added subjects, and newly generated results are preserved in your browser's persistent storage.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0a0c12] border border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Reset to Default Seed Data</h4>
                <p className="text-[11px] text-zinc-500">Restores all original topper and sample student records.</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Reset examination database to original default records?')) {
                    resetToDefaultData();
                    setSaveSuccessMessage('Database reset to original records successfully.');
                  }
                }}
                className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-bold rounded-lg transition-colors"
              >
                Reset Database
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0c12] border border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Export Results to CSV</h4>
                <p className="text-[11px] text-zinc-500">Download formatted tabular records for Microsoft Excel.</p>
              </div>
              <button
                onClick={exportResultsCSV}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD STUDENT */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12151e] border border-zinc-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-400" />
                Register New Student
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Roll / Hall Ticket No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 22A91A0589"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-[#0a0c12] border border-zinc-700 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Registration No</label>
                  <input
                    type="text"
                    placeholder="e.g. REG-2022-CSE-0589"
                    value={newStudent.registrationNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, registrationNumber: e.target.value })}
                    className="w-full bg-[#0a0c12] border border-zinc-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={newStudent.fullName}
                  onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                  className="w-full bg-[#0a0c12] border border-zinc-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Father's Name</label>
                  <input
                    type="text"
                    placeholder="Father Name"
                    value={newStudent.fatherName}
                    onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                    className="w-full bg-[#0a0c12] border border-zinc-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Branch / Department</label>
                  <select
                    value={newStudent.branchCode}
                    onChange={(e) => {
                      const code = e.target.value as any;
                      const branchMap: Record<string, string> = {
                        CSE: 'Computer Science & Engineering',
                        ECE: 'Electronics & Communication',
                        'AI&DS': 'Artificial Intelligence & Data Science',
                        MECH: 'Mechanical Engineering',
                        IT: 'Information Technology',
                        CIVIL: 'Civil Engineering',
                      };
                      setNewStudent({
                        ...newStudent,
                        branchCode: code,
                        branch: branchMap[code] as any,
                      });
                    }}
                    className="w-full bg-[#0a0c12] border border-zinc-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="CSE">CSE - Computer Science</option>
                    <option value="ECE">ECE - Electronics</option>
                    <option value="AI&DS">AI&DS - Artificial Intelligence</option>
                    <option value="MECH">MECH - Mechanical</option>
                    <option value="IT">IT - Information Tech</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full bg-[#0a0c12] border border-zinc-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full bg-[#0a0c12] border border-zinc-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
