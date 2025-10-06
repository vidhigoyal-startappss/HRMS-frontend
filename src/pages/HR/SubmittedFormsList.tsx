// import { useEffect, useState } from "react";
// import API from "../../api/auth";

// const SubmittedFormsList = () => {
//   const [forms, setForms] = useState([]);

//   useEffect(() => {
//     API.get("/api/onboarding/submitted")

//       .then(res => {
//         console.log("API response data:", res.data);
//         setForms(res.data);
//       })
//       .catch(err => {
//         console.error("Failed to fetch submitted forms:", err);
//       });
//   }, []);

//   if (!Array.isArray(forms)) {
//     return <div>Unexpected data format</div>;
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Submitted Onboarding Forms</h2>

//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Submitted At</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {forms.map((form: any) => (
//             <tr key={form._id}>
//               <td className="border p-2">{form.email}</td>
//               <td className="border p-2">
//                 {form.basicDetails?.firstName} {form.basicDetails?.lastName}
//               </td>
//               <td className="border p-2">
//                 {new Date(form.submittedAt).toLocaleString()}
//               </td>
//               <td className="border p-2">
//                 <a
//                   href={`/admin/onboarding/${form.token}`}
//                   className="text-blue-600 underline"
//                 >
//                   View Details
//                 </a>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SubmittedFormsList;

import { useEffect, useState } from "react";
import API from "../../api/auth";
import SendOnboardingForm from "../HR/SendOnboardingForm";

const SubmittedFormsList = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    API.get("/api/onboarding/submitted")
      .then((res) => {
        setForms(res.data);
        setFilteredForms(res.data); 
      })
      .catch((err) => {
        console.error("Failed to fetch submitted forms:", err);
      });
  }, []);

  
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredForms(forms);
      return;
    }

    const lowerSearch = searchText.toLowerCase();

    const filtered = forms.filter((form: any) => {
      const fullName = `${form.basicDetails?.firstName ?? ""} ${
        form.basicDetails?.lastName ?? ""
      }`.toLowerCase();
      return (
        form.email.toLowerCase().includes(lowerSearch) ||
        fullName.includes(lowerSearch)
      );
    });

    setFilteredForms(filtered);
  }, [searchText, forms]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!Array.isArray(forms)) {
    return <div>Unexpected data format</div>;
  }

  return (
    <div className="p-6 relative">
      <button
        onClick={openModal}
        className="absolute top-4 right-4 bg-[#226597] text-white px-4 py-2 rounded-md hover:bg-[#1b4e7a] transition"
      >
        Send Onboarding Form
      </button>

      <h2 className="text-2xl font-bold mb-4">Submitted Onboarding Forms</h2>

      <input
        type="text"
        placeholder="Search by email or name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4 w-full max-w-sm px-3 py-1 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-[#226597]"
      />

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Email</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Submitted At</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredForms.length === 0 ? (
            <tr>
              <td colSpan={4} className="border p-4 text-center text-gray-500">
                No forms found.
              </td>
            </tr>
          ) : (
            filteredForms.map((form: any) => (
              <tr key={form._id}>
                <td className="border p-2">{form.email}</td>
                <td className="border p-2">
                  {form.basicDetails?.firstName} {form.basicDetails?.lastName}
                </td>
                <td className="border p-2">
                  {new Date(form.submittedAt).toLocaleString()}
                </td>
                <td className="border p-2 text-center">
                  <a
                    href={`/admin/onboarding/${form.token}`}
                    className="inline-block bg-[#226597] text-white px-4 py-1.5 rounded-md hover:bg-[#1b4e7a] text-sm transition text-center"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md max-h-[600px] mx-5 bg-white rounded-2xl shadow-2xl p-0 animate-fadeIn overflow-hidden">
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-gray-500 text-2xl hover:text-black focus:outline-none"
              aria-label="Close Modal"
            >
              &times;
            </button>

            <div className="pt-2 h-full">
              <SendOnboardingForm onSuccess={closeModal} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedFormsList;
