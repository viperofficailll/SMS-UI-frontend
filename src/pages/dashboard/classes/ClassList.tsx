import { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  BookOpen,
  Search,
  RefreshCcw,
  Loader2,
  Filter,
  X,
  AlertCircle,
} from "lucide-react";

export default function ClassesList() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    pageSize: 100,
    pageNumber: 0,
  });

  const [totalPages, setTotalPages] = useState(1);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/v1/Class/list", filters);
      const data = res.data?.data || res.data || [];
      setClasses(data.items || data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch classes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [filters.pageNumber]);

  const resetFilters = () => {
    setFilters({
      pageSize: 100,
      pageNumber: 0,
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-700">Classes</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchClasses}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCcw size={18} />}
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading classes...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20 text-red-500">
            <AlertCircle className="mb-2" />
            {error}
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-500">
            <BookOpen size={40} className="mb-2 text-gray-400" />
            No classes found
          </div>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Class ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Class Name</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, idx) => (
                <tr key={cls.id || idx} className="border-t hover:bg-blue-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cls.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{cls.name}</td>
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
              pageNumber: Math.max(1, f.pageNumber - 1),
            }))
          }
          disabled={filters.pageNumber <= 1}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {filters.pageNumber} of {totalPages}
        </span>
        <button
          onClick={() =>
            setFilters((f) => ({
              ...f,
              pageNumber: Math.min(totalPages, f.pageNumber + 1),
            }))
          }
          disabled={filters.pageNumber >= totalPages}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
