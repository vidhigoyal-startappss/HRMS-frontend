import React, { useRef, useEffect, useState } from "react";
import SignaturePad from "signature_pad";
import { PDFDocument } from "pdf-lib";

interface SignLetterPageProps {
  pdfUrl: string;
}

const SignLetterPage: React.FC<SignLetterPageProps> = ({ pdfUrl, userId }) => {
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useRef<number>(0);

  const [signaturePosition, setSignaturePosition] = useState<{
    x: number;
    y: number;
  }>({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const signatureZones = [
    { page: 1, x: 0.2, y: 0.8, width: 0.4, height: 0.1 },
    { page: 2, x: 0.2, y: 0.8, width: 0.4, height: 0.1 },
    { page: 3, x: 0.5, y: 0.5, width: 0.4, height: 0.1 },
    { page: 8, x: 0.2, y: 0.8, width: 0.4, height: 0.1 },
    { page: 9, x: 0.5, y: 0.5, width: 0.4, height: 0.1 },
  ];

  useEffect(() => {
    fetch(pdfUrl)
      .then((res) => res.arrayBuffer())
      .then(async (data) => {
        setPdfBytes(new Uint8Array(data));
        const pdfDoc = await PDFDocument.load(data);
        totalPages.current = pdfDoc.getPages().length;
      });
  }, [pdfUrl]);

  useEffect(() => {
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current);
    }
  }, []);

  const handleSaveSignature = () => {
    if (signaturePadRef.current?.isEmpty()) {
      alert("Please sign before saving");
      return;
    }
    const dataUrl = signaturePadRef.current.toDataURL("image/png");
    setSignatureDataUrl(dataUrl);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDragStart = () => setDragging(true);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragging || !signatureDataUrl) return;
    const rect = pdfContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setSignaturePosition({ x, y });
    }
  };

  const handleDragEnd = () => setDragging(false);

  const handleSubmit = async () => {
    if (!pdfBytes || !signatureDataUrl)
      return alert("Missing PDF or signature");

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pngImage = await pdfDoc.embedPng(signatureDataUrl);

    const signatureZone = signatureZones.find(
      (zone) => zone.page === currentPage
    );
    if (!signatureZone) {
      return alert(`No signature zone found for page ${currentPage}`);
    }

    const page = pdfDoc.getPage(currentPage - 1);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    const pngDims = pngImage.scale(0.3);
    const signatureX = Math.min(signaturePosition.x, pageWidth - pngDims.width);
    const signatureY = Math.min(
      signaturePosition.y,
      pageHeight - pngDims.height
    );

    page.drawImage(pngImage, {
      x: signatureX,
      y: signatureY,
      width: pngDims.width,
      height: pngDims.height,
    });

    const signedPdfBytes = await pdfDoc.save();
    const signedPdfBlob = new Blob([signedPdfBytes], {
      type: "application/pdf",
    });

    // const formData = new FormData();
    // formData.append("file", signedPdfBlob, "signed-appointment.pdf");
    const formData = new FormData();
    formData.append("file", signedPdfBlob, "signed-appointment.pdf");
    formData.append("userId", userId);

    const res = await fetch("http://localhost:3000/api/letters/signed-upload", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (res.ok) {
      alert("Uploaded!");
      console.log("Signed PDF link:", result.link);
      window.open(result.link, "_blank");
    } else {
      alert("Upload failed");
    }
    if (res.ok) alert("Uploaded!");
    else alert("Upload failed");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Sign Your Appointment Letter
      </h2>

      <div
        ref={pdfContainerRef}
        className="relative w-[70%] max-w-4xl h-[80vh] border-2 border-gray-300 rounded-lg overflow-hidden bg-white mb-6"
        onDragOver={(e) => e.preventDefault()}
        onMouseMove={handleDrag}
        onMouseUp={handleDragEnd}
      >
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          className="border-none"
          title="PDF Preview"
        />
        {signatureDataUrl && (
          <img
            src={signatureDataUrl}
            alt="Signature"
            className="absolute w-40 h-auto cursor-grab"
            style={{
              left: `${signaturePosition.x}px`,
              top: `${signaturePosition.y}px`,
            }}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        )}
      </div>

      <div className="flex flex-col items-center mb-6">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className="border-2 border-dashed border-gray-400 rounded-md bg-white"
        />
        <div className="mt-3 flex gap-3">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSaveSignature}
          >
            Save Signature
          </button>
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            onClick={() => signaturePadRef.current?.clear()}
          >
            Clear
          </button>
        </div>
      </div>

      <button
        className="px-6 py-3 rounded bg-green-600 text-white text-lg font-medium hover:bg-green-700"
        onClick={handleSubmit}
      >
        Submit Signed PDF
      </button>
    </div>
  );
};

export default SignLetterPage;
