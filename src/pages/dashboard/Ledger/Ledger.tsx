import { useEffect, useState } from "react";
import {
  Library,
  Search,
  RefreshCcw,
  Loader2,
  Filter,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate


export default function LedgerList() {
  const navigate = useNavigate(); //

  const [ledgers, setLedgers] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    accountName: "",
    accountCode: "",
    accountGroup: "",
    pageSize: 10,
    pageNumber: 0,
  });

  const [totalPages, setTotalPages] = useState(1);

  const fetchLedgers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/v1/LedgerAccount/list", filters);
      const data = res.data?.data || [];
      setLedgers(data);
      setTotalPages(Math.ceil(data.length / filters.pageSize) || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ledger accounts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  useEffect(() => {
    fetchLedgers();
  }, [filters.pageNumber]);

  const resetFilters = () => {
    setFilters({
      accountName: "",
      accountCode: "",
      accountGroup: "",
      pageSize: 10,
      pageNumber: 0,
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Library className="text-green-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-700">Ledger Accounts</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <Filter size={18} />
            Filters
          </button>
          <button
            onClick={fetchLedgers}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <RefreshCcw size={18} />
            )}
            Refresh
          </button>
          {/* New Add Ledger Button */}
          <button
            onClick={() => navigate("/dashboard/ledger/add")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Ledger
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-600">Account Name</label>
              <input
                type="text"
                value={filters.accountName}
                onChange={(e) =>
                  setFilters({ ...filters, accountName: e.target.value })
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Student Ledger"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Account Code</label>
              <input
                type="text"
                value={filters.accountCode}
                onChange={(e) =>
                  setFilters({ ...filters, accountCode: e.target.value })
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                placeholder="e.g. STU001"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Group</label>
              <input
                type="text"
                value={filters.accountGroup}
                onChange={(e) =>
                  setFilters({ ...filters, accountGroup: e.target.value })
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                placeholder="e.g. Students"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Type</label>
              <select
                value={filters.accountType}
                onChange={(e) =>
                  setFilters({ ...filters, accountType: e.target.value })
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All</option>
                <option value="Assets">Assets</option>
                <option value="Liabilities">Liabilities</option>
                <option value="Income">Income</option>
                <option value="Expenses">Expenses</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              <X size={16} /> Reset
            </button>
            <button
              onClick={fetchLedgers}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Search size={16} /> Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading ledger accounts...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20 text-red-500">
            <AlertCircle className="mb-2" />
            {error}
          </div>
        ) : ledgers.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-500">
            <Library size={40} className="mb-2 text-gray-400" />
            No ledger accounts found
          </div>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Account Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Group
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Type
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {ledgers.map((ledger, index) => (
                <tr
                  key={ledger.id || index}
                  className="border-t hover:bg-green-50 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {ledger.accountName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ledger.accountCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ledger.accountGroup}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ledger.accountType}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedLedger(ledger)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
        <button
          onClick={() =>
            setFilters((f) => ({
              ...f,
              pageNumber: Math.max(0, f.pageNumber - 1),
            }))
          }
          disabled={filters.pageNumber <= 0}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft size={16} /> Prev
        </button>

        <span>
          Page {filters.pageNumber + 1} of {totalPages}
        </span>

        <button
          onClick={() =>
            setFilters((f) => ({
              ...f,
              pageNumber: f.pageNumber + 1,
            }))
          }
          disabled={filters.pageNumber + 1 >= totalPages}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* Modal */}
      {selectedLedger && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedLedger(null)}
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Ledger Account Details
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Name:</strong> {selectedLedger.accountName}
              </p>
              <p>
                <strong>Code:</strong> {selectedLedger.accountCode}
              </p>
              <p>
                <strong>Group:</strong> {selectedLedger.accountGroup}
              </p>
              <p>
                <strong>Type:</strong> {selectedLedger.accountType}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {selectedLedger.description || "—"}
              </p>
              <p>
                <strong>Created On:</strong>{" "}
                {selectedLedger.createdAt?.slice(0, 10)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
