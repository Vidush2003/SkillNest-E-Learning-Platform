import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { UserRoleProvider } from "./context/UserRoleContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Discussion from "./pages/Discussion";
import Quiz from "./pages/Quiz";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourseManager from "./pages/AdminCourseManager";
import AdminQuizManager from "./pages/AdminQuizManager";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminUserManager from "./pages/AdminUserManager";

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "teacher") {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <UserRoleProvider>
        <Router>
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<RoleBasedRedirect />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <Courses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute>
                      <CourseDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/discussions"
                  element={
                    <ProtectedRoute>
                      <Discussion />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:id"
                  element={
                    <ProtectedRoute>
                      <Quiz />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute>
                      <AdminUserManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/dashboard"
                  element={
                    <ProtectedRoute>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/courses"
                  element={
                    <ProtectedRoute>
                      <AdminCourseManager />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/quizzes"
                  element={
                    <ProtectedRoute>
                      <AdminQuizManager />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </UserRoleProvider>
    </AuthProvider>
  );
}

export default App;
