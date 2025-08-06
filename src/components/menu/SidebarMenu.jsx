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
    setIsSidebarOpen(false);
  };

  return (
    <aside className="h-screen w-64 bg-white p-6 shadow-lg">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => handleMenuClick(item.path)}
              className={`text-m flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2 font-medium transition ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              {item.icon}
              {item.name}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarMenu;
