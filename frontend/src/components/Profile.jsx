import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Save, UserCircle, Lock } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const url = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = ({ currentUser, onLogout, setCurrentUser }) => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const navigate = useNavigate();

  // 🟣 Load profile info
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${url}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(({ data }) => {
          if (data.success) {
            setProfile({ name: data.user.name, email: data.user.email });
          } else toast.error(data.message);
        })
        .catch(() => toast.error("Unable to load profile"));
    }
  }, []);

  // 🟣 Update profile (name, email)
  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${url}/api/user/profile`,
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        if (setCurrentUser) {
          setCurrentUser((prev) => ({
            ...prev,
            name: profile.name,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              profile.name
            )}&background=random`,
          }));
        }
        toast.success("Profile Updated");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile not updated");
    }
  };

  // 🟣 Change password (fixed syntax)
  const changePassword = async (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      return toast.error("Passwords do not match");
    }
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${url}/api/user/password`,
        {
          currentPassword: password.current,
          newPassword: password.new,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Password changed successfully");
        setPassword({ current: "", new: "", confirm: "" });
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    }
  };

  const personalFields = [
    { name: "name", type: "text", placeholder: "Full Name", icon: UserCircle },
    { name: "email", type: "email", placeholder: "Email", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-purple-600 hover:text-purple-800 transition mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Account Settings
            </h1>
            <p className="text-gray-500">Manage your profile and security</p>
          </div>
        </div>

        {/* Forms Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Info Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle className="text-purple-600 w-5 h-5" />
              <h2 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h2>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div
                  key={name}
                  className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-purple-400 transition"
                >
                  <Icon className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name]}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="w-full outline-none bg-transparent text-gray-700"
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </form>
          </section>

          {/* Password Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="text-purple-600 w-5 h-5" />
              <h2 className="text-lg font-semibold text-gray-800">
                Change Password
              </h2>
            </div>

            <form onSubmit={changePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={password.current}
                onChange={(e) =>
                  setPassword({ ...password, current: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={password.new}
                onChange={(e) =>
                  setPassword({ ...password, new: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={password.confirm}
                onChange={(e) =>
                  setPassword({ ...password, confirm: e.target.value })
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-purple-400"
                required
              />

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition"
              >
                <Save className="w-4 h-4" />
                Update Password
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
