import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, uploadProfileImage } from "../../api/user";
import { useAuth } from "../../context/AuthContext";
import UploadProfileImage from "./UploadProfileImage";
import { ArrowLeft } from "lucide-react";

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    <div className="mx-auto max-w-xl px-6 py-8">
      <button
        onClick={() => navigate("/profile")}
        className="mb-4 flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Profile
      </button>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Edit Profile
        </h2>

        <UploadProfileImage
          currentImage={profile.picture}
          setImageFile={setImageFile}
        />

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              Bio:
            </label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="birth_date"
              className="block text-sm font-medium text-gray-700"
            >
              Birthday:
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={profile.birth_date || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="occupation"
              className="block text-sm font-medium text-gray-700"
            >
              Occupation:
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={profile.occupation}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors duration-200 ease-in-out hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
          >
            {isSubmitting ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
