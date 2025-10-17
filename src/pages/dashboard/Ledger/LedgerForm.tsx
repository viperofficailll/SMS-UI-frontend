import { useState } from "react";
import api from "../../../api/axios";
import {
  FileSpreadsheet,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function LedgerForm() {
  const [formData, setFormData] = useState({
    accountName: "",
    accountCode: "",
    accountGroup: "",
    accountType: "Assets",
    pageSize: 10,
    pageNumber: 1,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const payload = {
        id: formData.id || "00000000-0000-0000-0000-000000000000", // or leave empty if optional
        accountName: formData.accountName,
        accountCode: formData.accountCode,
        accountGroup: formData.accountGroup,
        accountType: formData.accountType, // must match enum (e.g., "Assets")
        pageSize: formData.pageSize || 10,
        pageNumber: formData.pageNumber || 1,
      };

      console.log("Payload being sent:", payload); // 🔍 check in console

      const res = await api.post("/v1/LedgerAccount/add-update", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response:", res.data);
      setSuccessMsg("Ledger account saved successfully!");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Failed to save ledger record. Please check your input or try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white rounded-2xl shadow p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-700">
            Ledger Account Form
          </h2>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {successMsg && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg mb-4">
          <CheckCircle2 size={18} />
          {successMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Name
            </label>
            <input
              type="text"
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Enter account name"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Code
            </label>
            <input
              type="text"
              name="accountCode"
              value={formData.accountCode}
              onChange={handleChange}
              placeholder="Enter account code"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Group
            </label>
            <input
              type="text"
              name="accountGroup"
              value={formData.accountGroup}
              onChange={handleChange}
              placeholder="Enter account group"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="Assets">Assets</option>
              <option value="Liabilities">Liabilities</option>
              <option value="Income">Income</option>
              <option value="Expenses">Expenses</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {loading ? "Saving..." : "Save Ledger"}
          </button>
        </div>
      </form>
    </div>
  );
}
