import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Pencil,
  MessageCircle,
  Bell,
  User,
  Settings,
} from "lucide-react";

const SidebarMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Create Post", path: "/create-post", icon: <Pencil size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageCircle size={20} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={20} /> },
    { name: "Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];
  return (
    <aside className="h-screen w-64 bg-white p-6 shadow-lg">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition ${
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
