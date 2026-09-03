import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, SemesterResult } from '../types/student';
import { INITIAL_STUDENTS, INSTITUTION_INFO } from '../data/mockAcademicData';

export interface UserSession {
  id?: string;
  rollNumber?: string;
  fullName: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  branch?: string;
  branchCode?: string;
  avatarUrl?: string;
  overallCgpa?: number;
}

interface StudentContextType {
  students: Student[];
  searchRollNumber: string;
  setSearchRollNumber: (roll: string) => void;
  selectedStudent: Student | null;
  selectedSemester: SemesterResult | null;
  setSelectedStudent: (student: Student | null) => void;
  setSelectedSemester: (sem: SemesterResult | null) => void;
  lookupResult: (roll: string, semId?: string) => { student: Student; semester: SemesterResult } | null;
  addStudent: (newStudent: Omit<Student, 'id' | 'overallCgpa' | 'semesters'>) => Student;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  saveSemesterResult: (studentId: string, result: SemesterResult) => void;
  togglePublishStatus: (studentId: string, semesterId: string) => void;
  resetToDefaultData: () => void;
  exportToJSON: () => void;
  exportResultsCSV: () => void;
  activeView: 'search' | 'marksheet' | 'admin' | 'directory' | 'analytics';
  setActiveView: (view: 'search' | 'marksheet' | 'admin' | 'directory' | 'analytics') => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  // Auth state
  isAuthenticated: boolean;
  currentUser: UserSession | null;
  login: (identifier: string, password?: string) => { success: boolean; message: string; user?: UserSession };
  logout: () => void;
  quickLoginAsStudent: (rollNumber: string) => void;
  quickLoginAsAdmin: () => void;
}

const STORAGE_KEY = 'nsrit_student_management_v2';
const AUTH_STORAGE_KEY = 'nsrit_auth_session_v1';

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS;
  });

  const [searchRollNumber, setSearchRollNumber] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterResult | null>(null);
  const [activeView, setActiveView] = useState<'search' | 'marksheet' | 'admin' | 'directory' | 'analytics'>('search');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Auth state: Initially false so FIRST PAGE is always the Student Login page!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth).isLoggedIn : false;
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return savedAuth ? JSON.parse(savedAuth).user : null;
    } catch {
      return null;
    }
  });

  const login = (identifier: string, password = ''): { success: boolean; message: string; user?: UserSession } => {
    const cleanId = identifier.trim().toLowerCase();
    
    // Check if it's admin / faculty credentials
    if (
      cleanId === 'admin' ||
      cleanId === 'admin@nsrit.edu.in' ||
      cleanId === 'examcell' ||
      cleanId === 'examcell@nsrit.edu.in' ||
      cleanId === 'faculty'
    ) {
      const adminUser: UserSession = {
        fullName: 'Dr. G. V. S. Murthy (Controller of Exams)',
        email: 'examcell@nsrit.edu.in',
        role: 'admin',
      };
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      setIsAdminLoggedIn(true);
      setActiveView('admin');
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user: adminUser }));
      } catch {}
      return { success: true, message: 'Welcome to NSRIT Examination & Admin Portal', user: adminUser };
    }

    // Check if identifier matches any student's rollNumber or email
    const student = students.find(
      (s) => s.rollNumber.toLowerCase() === cleanId || s.email.toLowerCase() === cleanId
    );

    if (student) {
      const studentUser: UserSession = {
        id: student.id,
        rollNumber: student.rollNumber,
        fullName: student.fullName,
        email: student.email,
        role: 'student',
        branch: student.branch,
        branchCode: student.branchCode,
        avatarUrl: student.avatarUrl,
        overallCgpa: student.overallCgpa,
      };
      setCurrentUser(studentUser);
      setSelectedStudent(student);
      const latestSem = student.semesters.find((s) => s.isPublished) || student.semesters[0];
      setSelectedSemester(latestSem || null);
      setIsAuthenticated(true);
      setIsAdminLoggedIn(false);
      setActiveView('marksheet');
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user: studentUser }));
      } catch {}
      return { success: true, message: `Welcome back, ${student.fullName}!`, user: studentUser };
    }

    // If candidate enters any roll number like "21A91A..." or valid format
    if (cleanId.length >= 4) {
      // Default to candidate Mahesh Togu or first student
      const defaultStudent = students[2] || students[0];
      const guestUser: UserSession = {
        id: defaultStudent.id,
        rollNumber: identifier.toUpperCase(),
        fullName: defaultStudent.fullName,
        email: `${cleanId}@student.nsrit.edu.in`,
        role: 'student',
        branch: defaultStudent.branch,
        branchCode: defaultStudent.branchCode,
        avatarUrl: defaultStudent.avatarUrl,
        overallCgpa: defaultStudent.overallCgpa,
      };
      setCurrentUser(guestUser);
      setSelectedStudent(defaultStudent);
      const latestSem = defaultStudent.semesters.find((s) => s.isPublished) || defaultStudent.semesters[0];
      setSelectedSemester(latestSem || null);
      setIsAuthenticated(true);
      setActiveView('marksheet');
      try {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isLoggedIn: true, user: guestUser }));
      } catch {}
      return { success: true, message: `Welcome, ${defaultStudent.fullName}!`, user: guestUser };
    }

    return { success: false, message: 'Please enter a valid Roll Number or Email ID.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    setSelectedStudent(null);
    setSelectedSemester(null);
    setActiveView('search');
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
  };

  const quickLoginAsStudent = (rollNumber: string) => {
    login(rollNumber);
  };

  const quickLoginAsAdmin = () => {
    login('examcell@nsrit.edu.in');
  };

  // Sync to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch {
      // ignore quota errors
    }
  }, [students]);

  // Lookup student and specific semester result
  const lookupResult = (roll: string, semId?: string) => {
    const cleanRoll = roll.trim().toUpperCase();
    const found = students.find((s) => s.rollNumber.toUpperCase() === cleanRoll);
    if (!found) return null;

    let sem = found.semesters.find((s) => s.id === semId);
    if (!sem) {
      // Default to latest published semester or latest semester
      sem = found.semesters.find((s) => s.isPublished) || found.semesters[0];
    }

    if (!sem) return null;

    setSelectedStudent(found);
    setSelectedSemester(sem);
    setActiveView('marksheet');
    return { student: found, semester: sem };
  };

  const addStudent = (data: Omit<Student, 'id' | 'overallCgpa' | 'semesters'>) => {
    const newStudent: Student = {
      ...data,
      id: 'std-' + Date.now(),
      overallCgpa: 0,
      semesters: [],
    };
    setStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const updateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedStudent?.id === updated.id) {
      setSelectedStudent(updated);
    }
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudent?.id === id) {
      setSelectedStudent(null);
      setSelectedSemester(null);
      setActiveView('search');
    }
  };

  const saveSemesterResult = (studentId: string, result: SemesterResult) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;

        const existingIndex = student.semesters.findIndex((s) => s.id === result.id);
        let updatedSemesters: SemesterResult[];

        if (existingIndex >= 0) {
          updatedSemesters = [...student.semesters];
          updatedSemesters[existingIndex] = result;
        } else {
          updatedSemesters = [result, ...student.semesters];
        }

        // Recompute overall CGPA
        const publishedSemesters = updatedSemesters.filter((s) => s.isPublished);
        const avgCgpa =
          publishedSemesters.length > 0
            ? Number(
                (
                  publishedSemesters.reduce((acc, curr) => acc + curr.sgpa, 0) /
                  publishedSemesters.length
                ).toFixed(2)
              )
            : 0;

        const updatedStudent: Student = {
          ...student,
          overallCgpa: avgCgpa,
          semesters: updatedSemesters,
        };

        if (selectedStudent?.id === studentId) {
          setSelectedStudent(updatedStudent);
          setSelectedSemester(result);
        }

        return updatedStudent;
      })
    );
  };

  const togglePublishStatus = (studentId: string, semesterId: string) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) return student;
        return {
          ...student,
          semesters: student.semesters.map((sem) =>
            sem.id === semesterId ? { ...sem, isPublished: !sem.isPublished } : sem
          ),
        };
      })
    );
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudents(INITIAL_STUDENTS);
    setSelectedStudent(null);
    setSelectedSemester(null);
    setActiveView('search');
  };

  const exportToJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `NSRIT_Student_Results_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportResultsCSV = () => {
    let csvContent = 'Roll Number,Registration No,Student Name,Branch,Semester,Exam Session,Total Marks,Max Marks,Percentage,SGPA,Result Status\n';

    students.forEach((s) => {
      s.semesters.forEach((sem) => {
        csvContent += `"${s.rollNumber}","${s.registrationNumber}","${s.fullName}","${s.branchCode}","${sem.semesterName}","${sem.examSession}",${sem.totalMarks},${sem.maxMarks},${sem.percentage},${sem.sgpa},"${sem.resultStatus}"\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NSRIT_Student_Results_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <StudentContext.Provider
      value={{
        students,
        searchRollNumber,
        setSearchRollNumber,
        selectedStudent,
        selectedSemester,
        setSelectedStudent,
        setSelectedSemester,
        lookupResult,
        addStudent,
        updateStudent,
        deleteStudent,
        saveSemesterResult,
        togglePublishStatus,
        resetToDefaultData,
        exportToJSON,
        exportResultsCSV,
        activeView,
        setActiveView,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        isAuthenticated,
        currentUser,
        login,
        logout,
        quickLoginAsStudent,
        quickLoginAsAdmin,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};
