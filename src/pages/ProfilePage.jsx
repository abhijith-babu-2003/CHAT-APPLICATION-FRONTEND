import { useState } from "react";
import { userAuthStore } from "../store/userAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdateingProfile, updateProfile } = userAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-900 text-gray-100 flex justify-center items-start sm:pt-20">
      <div className="w-full max-w-3xl p-4 sm:p-6 md:p-8">
        <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-lg">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold">Profile</h1>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">
              Your profile information
            </p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-gray-700"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 
                  bg-gray-700 hover:bg-gray-600 p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdateingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                📷
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdateingProfile}
                />
              </label>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 text-center">
              {isUpdateingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                👤 Full Name
              </div>
              <p className="px-4 py-2.5 bg-gray-700 rounded-lg border border-gray-600 break-words">
                {authUser?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-gray-400 flex items-center gap-2">
                📧 Email Address
              </div>
              <p className="px-4 py-2.5 bg-gray-700 rounded-lg border border-gray-600 break-words">
                {authUser?.email}
              </p>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-gray-800 rounded-2xl p-6">
            <h2 className="text-lg sm:text-xl font-medium mb-4">
              Account Information
            </h2>
            <div className="space-y-3 text-sm sm:text-base">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 border-b border-gray-700">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
