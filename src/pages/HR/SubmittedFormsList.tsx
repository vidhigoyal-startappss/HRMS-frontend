import { useEffect, useState } from "react";
import API from "../../api/auth"; 

const SubmittedFormsList = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    API.get("/api/onboarding/submitted")

      .then(res => {
        console.log("API response data:", res.data);
        setForms(res.data);
      })
      .catch(err => {
        console.error("Failed to fetch submitted forms:", err);
      });
  }, []);

  if (!Array.isArray(forms)) {
    return <div>Unexpected data format</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Submitted Onboarding Forms</h2>

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
          {forms.map((form: any) => (
            <tr key={form._id}>
              <td className="border p-2">{form.email}</td>
              <td className="border p-2">
                {form.basicDetails?.firstName} {form.basicDetails?.lastName}
              </td>
              <td className="border p-2">
                {new Date(form.submittedAt).toLocaleString()}
              </td>
              <td className="border p-2">
                <a
                  href={`/admin/onboarding/${form.token}`}
                  className="text-blue-600 underline"
                >
                  View Details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmittedFormsList;
