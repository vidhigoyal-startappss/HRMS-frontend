import { useEffect, useState } from "react";
import API from "../../api/auth";
import SendOnboardingForm from "../HR/SendOnboardingForm";

const SubmittedFormsList = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // new loading state
  const [error, setError] = useState<string | null>(null); // new error state
  useEffect(() => {
    setLoading(true);
    setError(null);
    API.get("/api/onboarding/submitted")
      .then((res) => {
        setForms(res.data);
        setFilteredForms(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch submitted forms:", err);
        setError("Oops! Something went wrong while fetching forms, please try again later.");
      })
      .finally(() => {
        setLoading(false);
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
          {loading ? (
            <tr>
              <td colSpan={4} className="border p-6 text-center">
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="loader mb-2"></div>
                  <p className="text-gray-500">Loading forms...</p>
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={4} className="border p-6 text-center">
                <p className="text-red-500 font-medium">{error}</p>
              </td>
            </tr>
          ) : filteredForms.length === 0 ? (
            <tr>
              <td colSpan={4} className="border p-6 text-center">
                <p className="text-gray-500 font-medium">No forms found</p>
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
      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #226597;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SubmittedFormsList;
