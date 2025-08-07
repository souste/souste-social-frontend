import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-[60vh] flex-col rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-6">
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Timeline
        </button>
      </div>
      <div className="flex flex-1 flex-col text-gray-700">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Settings</h1>
        <div className="text-center text-gray-500">
          <div
            title="Logout"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-x-2 text-gray-600 transition hover:text-red-400"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-lg font-medium">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
