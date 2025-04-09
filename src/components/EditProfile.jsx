import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, uploadProfileImage } from "../api/user";
import { useAuth } from "../context/AuthContext";
import UploadProfileImage from "./UploadProfileImage";

const EditProfile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [imageFile, setImageFile] = useState(null);
  const [profile, setProfile] = useState({
    picture: "",
    bio: "",
    location: "",
    birth_date: null,
    occupation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(userId);
        setProfile({
          picture: profile.picture,
          bio: profile.bio,
          location: profile.location,
          birth_date: profile.birth_date,
          occupation: profile.occupation,
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (imageFile) {
        const imageResult = await uploadProfileImage(userId, imageFile);
        if (imageResult && imageResult.picture) {
          profile.picture = imageResult.picture;
          setProfile((prev) => ({
            ...prev,
            picture: imageResult.picture,
          }));
        } else {
          console.warn(
            "No valid image URL found in imageResult.imageUrl",
            imageResult,
          );
        }
      }
      const response = await updateProfile(userId, profile);
      if (response.errors) {
        setErrors(response.errors);
        setIsSubmitting(false);
        return;
      }

      navigate("/profile");
    } catch (err) {
      console.error("Failed to Update profile", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Edit Profile
      </h1>
      <UploadProfileImage
        currentImage={profile.picture}
        setImageFile={setImageFile}
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div>
          <label
            htmlFor="bio"
            className="text-sm font-semibold text-gray-700"
          >
            **Bio:
          </label>
          <input
            type="text"
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleChange}
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
            id="location"
            name="location"
            value={profile.location}
            onChange={handleChange}
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
            id="birth_date"
            name="birth_date"
            value={profile.birth_date}
            onChange={handleChange}
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
            id="occupation"
            name="occupation"
            value={profile.occupation}
            onChange={handleChange}
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
        >
          {"Edit Profile"}
        </button>
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
