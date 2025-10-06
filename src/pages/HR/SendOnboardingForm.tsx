// import React, { useState } from "react";
// import { sendOnboardingForm } from "../../api/onboarding";
// import { toast } from "react-toastify";

// const SendOnboardingForm: React.FC = () => {
//   const [email, setEmail] = useState("");

//   const handleSend = async () => {
//     try {
//       await sendOnboardingForm(email);
//       toast.success("Onboarding form sent successfully!");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to send onboarding form.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="flex flex-col bg-white p-6 justify-center gap-4 w-full max-w-md rounded-lg shadow-md">
//         <h1 className="text-2xl text-[#113F67] font-bold text-center">
//           Send Onboarding Form
//         </h1>

//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter employee email"
//           className="bg-gray-50 border border-gray-300 h-10 p-2 rounded-sm"
//         />

//         <button
//           onClick={handleSend}
//           className="bg-[#226597] text-white cursor-pointer p-2 rounded-sm"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SendOnboardingForm;








import React, { useState } from "react";
import { sendOnboardingForm } from "../../api/onboarding";
import { toast } from "react-toastify";

interface Props {
  onSuccess?: () => void;
}

const SendOnboardingForm: React.FC<Props> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");

  const handleSend = async () => {
    try {
      await sendOnboardingForm(email);
      toast.success("Onboarding form sent successfully!");
      setEmail("");
      onSuccess?.(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to send onboarding form.");
    }
  };

  return (
    <div className="flex flex-col bg-white p-6 justify-center gap-4 w-full max-w-md rounded-lg shadow-md">
      <h1 className="text-2xl text-[#113F67] font-bold text-center">
        Send Onboarding Form
      </h1>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter employee email"
        className="bg-gray-50 border border-gray-300 h-10 p-2 rounded-sm"
      />

      <button
        onClick={handleSend}
        className="bg-[#226597] text-white cursor-pointer p-2 rounded-sm"
      >
        Send
      </button>
    </div>
  );
};

export default SendOnboardingForm;
