import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { getProfile, updateProfile } from "../api/user";
// import useAuth from "../context/AuthContext";
const EditProfile = () => {
  const navigate = useNavigate();
  //   const { userId } = currentUser.id;
  //   const { currentUser } = useAuth();
  //   const [profile, setProfile] = useState({
  //     picture: "",
  //     bio: "",
  //     location: "",
  //     birth_date: "",
  //     occupation: "",
  //     friend_count: 0,
  //   });
  //   // The friend count logic will likely need to be handled in another table
  //   const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Edit Profile
      </h1>
      <form className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="profile_pic"
            className="text-sm font-semibold text-gray-700"
          >
            Profile Pic:
          </label>
          <input
            type="text"
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="bio"
            className="text-sm font-semibold text-gray-700"
          >
            **Bio:
          </label>
          <input
            type="text"
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="location"
            className="text-sm font-semibold text-gray-700"
          >
            Location:
          </label>
          <input
            type="text"
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="birth_date"
            className="text-sm font-semibold text-gray-700"
          >
            Birthday:
          </label>
          <input
            type="date"
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="occupation"
            className="text-sm font-semibold text-gray-700"
          >
            Occupation:
          </label>
          <input
            type="text"
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
          />
        </div>
      </form>
      <div className="mt-6 flex justify-center gap-6">
        <button
          onClick={() => navigate("/profile")}
          className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-gray-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
