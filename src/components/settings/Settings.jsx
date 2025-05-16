import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
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
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">Settings</h1>
        <div className="text-center text-gray-500">
          <h1>This will be the settings page</h1>
        </div>
      </div>
    </div>
  );
};

export default Settings;
