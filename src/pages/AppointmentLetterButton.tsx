import React, { useState } from "react";

const AppointmentLetterButton = ({
  userId,
  letterStatus,
  signedLetterUrl,
  handleGenerateReport,
  handleSendPdfLink,
}) => {
  return (
    <div>
      {letterStatus === "idle" && (
        <button
          type="button"
          onClick={() => handleGenerateReport(userId)}
          className="bg-white text-[#113F67] px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-700 transition ml-2"
        >
          Generate Appointment Letter
        </button>
      )}

      {letterStatus === "generated" && (
        <button
          type="button"
          onClick={() => handleSendPdfLink(userId)}
          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition ml-2"
        >
          Send to Employee
        </button>
      )}

      {signedLetterUrl && (
        <a
          href={signedLetterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition ml-2"
        >
          View Appointment Letter
        </a>
      )}
    </div>
  );
};

export default AppointmentLetterButton;
