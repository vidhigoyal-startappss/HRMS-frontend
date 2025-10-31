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
              <td colSpan={4} className="border p-6">
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mb-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m4-6v6m0 0H5m14 0a2 2 0 002-2v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h14z"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-2">No forms found</p>
                  <p className="text-sm text-gray-400">
                    Try adjusting your search or check back later.
                  </p>
                </div>
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
