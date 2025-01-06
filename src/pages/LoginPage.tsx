// import { FcGoogle } from "react-icons/fc";
// import { HiClipboard } from "react-icons/hi";
// import { auth, provider } from "../config/firebaseConfig";
// import { signInWithPopup } from "firebase/auth";
// import { useUser } from "../../userContext/UserContext";
// import { useNavigate } from "react-router-dom";

// const LoginPage = () => {
//   const { setUser } = useUser();
//   const navigate = useNavigate();

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       setUser({
//         name: user.displayName,
//         photo: user.photoURL,
//         email: user.email,
//       });
//       navigate("/home");
//     } catch (error) {
//       console.error("Error signing in:", error);
//     }
//   };

//   return (
//     <div className="h-screen bg-pink-50 flex items-center justify-center relative overflow-hidden">
//       {/* Decorative Circles */}
//       <div className="absolute inset-0 pointer-events-none">
//         <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
//           {/* Largest outer circle */}
//           <circle
//             cx="50"
//             cy="50"
//             r="35"
//             fill="none"
//             stroke="#8a28b5"
//             strokeWidth="0.2"
//             className="opacity-60"
//           />
//           {/* Medium circle */}
//           <circle
//             cx="50"
//             cy="50"
//             r="25"
//             fill="none"
//             stroke="#8a28b5"
//             strokeWidth="0.2"
//             className="opacity-60"
//           />
//           {/* Smallest inner circle */}
//           <circle
//             cx="50"
//             cy="50"
//             r="15"
//             fill="none"
//             stroke="#8a28b5"
//             strokeWidth="0.2"
//             className="opacity-60"
//           />
//         </svg>
//       </div>

//       {/* Login Card */}
//       <div className="bg-white shadow-lg rounded-lg p-8 w-96 relative z-10">
//         {/* Logo */}
//         <div className="flex flex-col items-center">
//           <div className="flex items-center text-[#8a28b5] text-3xl font-bold mb-2">
//             <HiClipboard className="mr-2" size={30} /> TaskBuddy
//           </div>
//           <p className="text-gray-600 text-center mb-6">
//             Streamline your workflow and track progress efficiently with our all-in-one task management app.
//           </p>
//         </div>

//         {/* Google Login Button */}
//         <button
//           className="flex items-center justify-center gap-2 w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
//           onClick={handleGoogleSignIn}
//         >
//           <FcGoogle size={20} />
//           Continue with Google
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;



import { FcGoogle } from "react-icons/fc";
import { HiClipboard } from "react-icons/hi";
import { auth, provider } from "../config/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useUser } from "../../userContext/UserContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser({
        name: user.displayName,
        photo: user.photoURL,
        email: user.email,
      });
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center relative overflow-hidden">
      {/* Decorative Circles - Adjusted for better mobile visibility */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="#8a28b5"
            strokeWidth="0.2"
            className="opacity-30"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="#8a28b5"
            strokeWidth="0.2"
            className="opacity-30"
          />
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke="#8a28b5"
            strokeWidth="0.2"
            className="opacity-30"
          />
        </svg>
      </div>

      {/* Login Card - Made responsive */}
      <div className="bg-white shadow-lg rounded-lg p-8 mx-4 w-full max-w-[400px] md:w-96 relative z-10 flex flex-col items-center">
        {/* Logo and Title */}
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center text-[#8a28b5] text-2xl md:text-3xl font-bold mb-2">
            <HiClipboard className="mr-2" size={24} /> TaskBuddy
          </div>
          <p className="text-gray-600 text-center text-sm md:text-base mb-8 max-w-[280px]">
            Streamline your workflow and track progress efficiently
          </p>
        </div>

        {/* Google Login Button - Mobile optimized */}
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-2 w-full max-w-[280px] bg-black text-white py-3 rounded-lg hover:bg-gray-800 text-sm md:text-base transition-colors duration-200"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
