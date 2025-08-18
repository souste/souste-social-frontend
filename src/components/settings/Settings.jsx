import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <button
        onClick={() => navigate("/")}
        className="-mx-2 mb-4 inline-flex items-center gap-2 rounded-md px-2 py-1 text-stone-600 transition hover:bg-stone-100 hover:text-stone-800"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Timeline
      </button>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <header className="border-b border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-stone-800">Settings</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage your account, appearance, and preferences.
          </p>
        </header>

        <div className="divide-y divide-gray-100">
          <section className="p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Appearance
            </h2>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <div>
                <p className="font-medium text-stone-800">Theme</p>
                <p className="text-sm text-stone-500">
                  Switch between light and dark mode.
                </p>
              </div>
              <ThemeToggle />
            </div>
          </section>

          <section className="border-t border-gray-100 p-6 dark:border-stone-800">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Profile
            </h2>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-stone-800">
              <div>
                <p className="font-medium text-stone-800 dark:text-stone-100">
                  Edit profile
                </p>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Update photo and details.
                </p>
              </div>
              <button
                onClick={() => navigate("/profile/edit")}
                className="rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-blue-400 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                Open
              </button>
            </div>
          </section>

          <section className="p-6">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-500">
              Account
            </h2>
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4">
              <div>
                <p className="font-medium text-stone-800">Sign out</p>
                <p className="text-sm text-stone-500">
                  You’ll need to log in again to access your account.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label="Log out"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
