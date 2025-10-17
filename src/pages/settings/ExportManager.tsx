import { useState, useRef } from "react";
import api from "../../api/axios";
import {
  FileSpreadsheet,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function ExportManager() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const fileInputRef = useRef(null);
    const [validatedFile, setValidatedFile] = useState(null); // ✅ Store validated file for import

  // 📤 Export sample file
  const handleExportSample = async () => {
    try {
      setLoading(true);
      const res = await api.get("/v1/Export/export-sample", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample.xlsx");
      document.body.appendChild(link);
      link.click();
      setStatus({ type: "success", text: "Sample exported successfully!" });
    } catch (err) {
      setStatus({ type: "error", text: "Failed to export sample file." });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Validate Excel
  const handleValidate = async () => {
    if (!file) {
      setStatus({ type: "error", text: "Please choose a file to validate." });
      return;
    }

    setLoading(true);
    setStatus({ type: "info", text: "Validating Excel file..." });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/v1/Export/validate-excel", formData);

      // Check if the response contains the "message" key
      if (res.data && typeof res.data.message === "string") {
        setValidated(true);
       setValidatedFile(file); // ✅ Keep the validated file
        setStatus({
          type: "success",
          text: res.data.message || "Excel validated successfully!",
        });

        // Reset file input after validation success
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        // Unexpected format, show entire JSON
        setValidated(false);
        setStatus({
          type: "error",
          text: `Invalid response:\n${JSON.stringify(res.data, null, 2)}`,
        });
      }
    } catch (err) {
      setValidated(false);
      if (err.response?.data) {
        setStatus({
          type: "error",
          text: `Validation failed:\n${JSON.stringify(err.response.data, null, 2)}`,
        });
      } else {
        setStatus({ type: "error", text: "Validation failed. Check your file format." });
      }
    } finally {
      setLoading(false);
    }
  };

  // ⬆️ Import the validated Excel file
const handleImport = async () => {
  if (!validated || !validatedFile) {
    setStatus({ type: "error", text: "Please validate before importing." });
    return;
  }

  setLoading(true);
  setStatus({ type: "info", text: "Importing validated Excel file..." });

  try {
    const formData = new FormData();
    formData.append("file", validatedFile); // ✅ attach Excel file under name 'file'

    const res = await api.post("/v1/Export/import-data", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // ✅ If response is an object (like counts), format it neatly
    if (
      res.data &&
      typeof res.data === "object" &&
      !Array.isArray(res.data) &&
      Object.keys(res.data).length > 0
    ) {
      const formatted = Object.entries(res.data)
        .map(([key, val]) => `${key}: ${val}`)
        .join("\n");
      setStatus({
        type: "success",
        text: `✅ Import Summary:\n${formatted}`,
      });
    } else {
      // fallback for string message
      setStatus({
        type: "success",
        text: res.data?.message || "✅ Data imported successfully!",
      });
    }
  } catch (err) {
    setStatus({
      type: "error",
      text:
        err.response?.data?.message ||
        "Import failed. Please check your Excel data.",
    });
  } finally {
    setLoading(false);
  }
};


  // ⚠️ Reset all data
  const handleReset = async () => {
    const confirmReset = window.confirm(
      "⚠️ This will delete all imported data. Are you sure?"
    );
    if (!confirmReset) return;

    setLoading(true);
    setStatus({ type: "info", text: "Resetting data..." });

    try {
      await api.get("/v1/Export/danger-reset-data");
      setValidated(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setStatus({
        type: "success",
        text: "🚨 All imported data has been reset successfully.",
      });
    } catch (err) {
      setStatus({ type: "error", text: "Failed to reset data." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 flex items-center gap-2">
        <FileSpreadsheet className="text-blue-600" /> Data Import & Export
      </h2>

      <div className="space-y-6">
        {/* Export Sample */}
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <Download className="text-blue-600" />
            <div>
              <h4 className="font-semibold">Export Sample Excel</h4>
              <p className="text-sm text-gray-500">
                Download a template Excel file for data import.
              </p>
            </div>
          </div>
          <button
            onClick={handleExportSample}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Download"}
          </button>
        </div>

        {/* Validate Excel */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <CheckCircle2 className="text-green-600" /> Validate Excel File
          </h4>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="mb-3 border p-2 rounded w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={handleValidate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Validate File"}
          </button>
        </div>

        {/* Import */}
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Upload className="text-indigo-600" /> Import Data
          </h4>
          <button
            onClick={handleImport}
            className={`${
              validated
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white px-4 py-2 rounded-lg transition-all`}
            disabled={!validated || loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Import Data"}
          </button>
        </div>

        {/* Danger Reset */}
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-600">
            <AlertTriangle /> Danger Zone
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            This will remove all imported data. This action is irreversible.
          </p>
          <button
            onClick={handleReset}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Reset Data"}
          </button>
        </div>

        {/* Status message area */}
        {status.text && (
          <div
            className={`mt-4 p-4 rounded-md whitespace-pre-wrap transition-all duration-300 ${
              status.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : status.type === "error"
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }`}
          >
            {status.text}
          </div>
        )}
      </div>
    </div>
  );
}
