import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>This will be the settings page</h1>
      <button
        onClick={() => navigate("/")}
        className="rounded-full border bg-red-300 px-3 py-3 font-semibold text-white hover:bg-red-200"
      >
        Back
      </button>
    </div>
  );
};

export default Settings;
