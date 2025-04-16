import { useNavigate } from "react-router-dom";

const SidebarMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Create Post", path: "/create-post" },
    { name: "Messages", path: "/messages" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];
  return (
    <div className="h-screen w-60 bg-white p-4 shadow-md">
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li
            key={item.name}
            onClick={() => navigate(item.path)}
            className="cursor-pointer rounded px-4 py-2 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
