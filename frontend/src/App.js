import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Homepage from './pages/Homepage';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import LoginPage from './pages/LoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import ChooseUser from './pages/ChooseUser';
import AssignmentsPage from './pages/admin/AssignmentsPage';

const App = () => {
  const { currentRole } = useSelector((state) => state.user);

  return (
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/choose" element={<ChooseUser visitor="normal" />} />
          <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />
          <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
          <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
          <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
          <Route path="/Adminregister" element={<AdminRegisterPage />} />

          {/* Role-Based Protected Routes */}
          {currentRole === 'Admin' && (
              <>
                <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
                <Route path="/admin/assignments" element={<AssignmentsPage />} />
              </>
          )}

          {currentRole === 'Student' && (
              <>
                <Route path="/student/dashboard/*" element={<StudentDashboard />} />
                <Route path="/student/dashboard/:classId" element={<StudentDashboard />} />
              </>
          )}

          {currentRole === 'Teacher' && (
              <>
                <Route path="/teacher/dashboard/*" element={<TeacherDashboard />} />
                <Route path="/teacher/dashboard/:classId" element={<TeacherDashboard />} />
              </>
          )}

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
  );
};

export default App;
