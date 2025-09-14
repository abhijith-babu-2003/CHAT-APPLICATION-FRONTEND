import { Link } from "react-router-dom";
import { userAuthStore } from "../store/userAuthStore";

const Navbar = () => {
  const { logout, authUser } = userAuthStore();

  return (
    <header className="fixed w-full top-0 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-700">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-all"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-800/30 flex items-center justify-center">
            💬
          </div>
          <h1 className="text-lg font-bold text-gray-100">Chatty</h1>
        </Link>

        <div className="flex items-center gap-2">
          {authUser && (
            <>
              <Link
                to="/profile"
                className="px-3 py-1 rounded-lg bg-gray-800 text-gray-200 hover:bg-blue-600 hover:text-white transition flex items-center gap-1"
              >
                👤
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                onClick={logout}
                className="px-3 py-1 rounded-lg bg-gray-800 text-gray-200 hover:bg-red-600 hover:text-white transition flex items-center gap-1"
              >
                🔓
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
