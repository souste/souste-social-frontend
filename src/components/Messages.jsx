import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>This will be the messages pages</h1>
      <button
        onClick={() => navigate("/")}
        className="rounded-full border bg-red-300 px-3 py-3 font-semibold text-white hover:bg-red-200"
      >
        Back
      </button>
    </div>
  );
};

export default Messages;
