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
        className="-mx-2 mb-4 inline-flex items-center gap-2 rounded-md px-2 py-1 text-stone-600 transition hover:bg-stone-100 hover:text-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Profile
      </button>

      {errors.length > 0 && (
        <div className="mb-6 rounded-md border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          <ul className="list-inside list-disc">
            {errors.map((error, index) => (
              <li key={index}>{error.msg}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <h2 className="mb-6 text-center text-2xl font-bold text-stone-800 dark:text-stone-100">
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
              className="block text-sm font-medium text-stone-700 dark:text-stone-200"
            >
              Bio:
            </label>
            <input
              type="text"
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-stone-700 dark:text-stone-200"
            >
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            />
          </div>

          <div>
            <label
              htmlFor="birth_date"
              className="block text-sm font-medium text-stone-700 dark:text-stone-200"
            >
              Birthday:
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={profile.birth_date || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            />
          </div>

          <div>
            <label
              htmlFor="occupation"
              className="block text-sm font-medium text-stone-700 dark:text-stone-200"
            >
              Occupation:
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={profile.occupation}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors duration-200 ease-in-out hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
          >
            {isSubmitting ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
