import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  Pencil,
  MessageCircle,
  Bell,
  User,
  Settings,
  Users,
  UserPlus,
  UserCheck,
} from "lucide-react";

const SidebarMenu = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const baseMenuItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Create Post", path: "/create-post", icon: <Pencil size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageCircle size={20} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  const mobileOnlyItems = [
    { name: "Friends", path: "/friends", icon: <Users size={20} /> },
    { name: "Requests", path: "/requests", icon: <UserCheck size={20} /> },
    { name: "Suggestions", path: "/suggestions", icon: <UserPlus size={20} /> },
  ];

  const menuItems = isMobile
    ? [...baseMenuItems, ...mobileOnlyItems]
    : baseMenuItems;

  const handleMenuClick = (path) => {
    navigate(path);

    setIsSidebarOpen?.(false);
  };

  return (
    <aside className="h-full w-64 border-r border-gray-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => handleMenuClick(item.path)}
              className={`group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-blue-600 dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-blue-300 ${isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : ""} `}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarMenu;
