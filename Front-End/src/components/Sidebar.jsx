import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/UserRoleContext';
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  MessageSquare,
  Settings,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin, isTeacher, isLearner } = useRole();
  const location = useLocation();

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/courses', label: 'Courses', icon: BookOpen },
    { path: '/admin/quizzes', label: 'Quizzes', icon: FileQuestion },
    { path: '/discussions', label: 'Discussions', icon: MessageSquare },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  const teacherMenuItems = [
    { path: '/teacher/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/courses', label: 'My Courses', icon: BookOpen },
    { path: '/admin/quizzes', label: 'Quizzes', icon: FileQuestion },
    { path: '/discussions', label: 'Discussions', icon: MessageSquare },
  ];

  const learnerMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/discussions', label: 'Discussions', icon: MessageSquare },
  ];

  const menuItems = isAdmin ? adminMenuItems : isTeacher ? teacherMenuItems : learnerMenuItems;

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <li key={item.path} className="sidebar-item">
              <Link
                to={item.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
