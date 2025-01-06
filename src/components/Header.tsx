import { HiClipboard } from "react-icons/hi";
import { FaList, FaColumns } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  view: "list" | "board";
  setView: (view: "list" | "board") => void;
  userName: string | null;
  userPhoto: string | null;
  onLogout: () => void;
  showViewToggle: boolean;
}

const Header = ({ view, setView, userName, userPhoto, onLogout }: HeaderProps) => {
  console.log('userPhoto in Header:', userPhoto);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); 
    navigate("/");
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white">
      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center text-gray-800 text-lg font-medium">
            <HiClipboard className="mr-2" size={20} />
            TaskBuddy
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setView("list")}
              className={`flex items-center text-sm space-x-2 ${
                view === "list"
                  ? "text-purple-700 font-semibold"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaList size={16} />
              <span>List</span>
            </button>
            <button
              onClick={() => setView("board")}
              className={`flex items-center text-sm space-x-2 ${
                view === "board"
                  ? "text-purple-700 font-semibold"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <FaColumns size={16} />
              <span>Board</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <img
            src={userPhoto || "/default-profile.png"}
            alt={userName || "User"}
            className="w-8 h-8 rounded-full"
            style={{ objectFit: "cover" }}
          />
          <span className="text-sm hidden md:inline">{userName || "User"}</span>
        </div>
        <button
          className="text-sm flex items-center text-gray-600 hover:text-gray-800 space-x-1"
          onClick={handleLogout}
        >
          <FiLogOut size={16} />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;