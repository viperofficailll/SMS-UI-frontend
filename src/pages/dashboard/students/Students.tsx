import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../../api/axios";
import {
  Users,
  Search,
  RefreshCcw,
  Loader2,
  Filter,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
} from "lucide-react";
export default function StudentsList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    idNumber: "",
    admissionNumber: "",
    gender: "",
    classId:null,
    className: "",
    pageSize: 10,
    pageNumber: 0
  });

  // Pagination info
  const [totalPages, setTotalPages] = useState(1);

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await api.post("/v1/Class/list", {
        pageSize: 100,
        pageNumber: 1,
      });
      setClasses(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to load classes:", err);
    }
  };

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/v1/Students/list", filters);
      const data = res.data || [];
      console.log(data);
      setStudents(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch students. Please check filters or try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load data
  useEffect(() => {
    fetchClasses();
    fetchStudents();
  }, []);

  // Re-fetch when page changes
  useEffect(() => {
    fetchStudents();
  }, [filters.pageNumber]);

  const resetFilters = () => {
    setFilters({
      idNumber: "",
      classId:null,
      admissionNumber: "",
      gender: "",
      className: "",
      pageSize: 10,
      pageNumber: 0,
    });
  };

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-white rounded-2xl shadow p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Users className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-700">Students</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters((p) => !p)}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            <Filter size={18} />
            Filters
          </button>
          <button
            onClick={fetchStudents}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {loading ? <Loader2 className="animate-spin" /> : <RefreshCcw size={18} />}

    Refresh
  </button>
            <button
    onClick={() => navigate("/dashboard/students/add")}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    + Add Student
  </button>
        </div>
      </div>

      {/* Filter Form */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600">ID Number</label>
              <input
                type="text"
                value={filters.idNumber}
                onChange={(e) => setFilters({ ...filters, idNumber: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                placeholder="e.g. S12345"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Admission Number</label>
              <input
                type="text"
                value={filters.admissionNumber}
                onChange={(e) =>
                  setFilters({ ...filters, admissionNumber: e.target.value })
                }
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
                placeholder="e.g. ADM-001"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Class</label>
              <select
                value={filters.classId}
                onChange={(e) => setFilters({ ...filters, classId: e.target.value || null })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg"
              >
                <option value="">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
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
              onClick={fetchStudents}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
            <Loader2 className="animate-spin mr-2" /> Loading students...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-20 text-red-500">
            <AlertCircle className="mb-2" />
            {error}
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-gray-500">
            <Users size={40} className="mb-2 text-gray-400" />
            No students found
          </div>
        ) : (
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Admission No.</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Class</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Gender</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">DOB</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr
                  key={s.id || index}
                  className="border-t hover:bg-blue-50 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.idNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.admissionNumber}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {s.firstName} {s.middleName} {s.lastName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.className}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{s.gender}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {s.dateOfBirth?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedStudent(s)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>
                    <button
    onClick={() => navigate(`/dashboard/students/edit/${s.id}`)}
    className="text-blue-600 hover:underline font-medium"
  >
    <Edit size={18} />
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
              pageNumber: Math.max(1, f.pageNumber - 1),
            }))
          }
          disabled={filters.pageNumber <= 1}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft size={16} /> Prev
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
          Next <ChevronRight size={16} />
        </button>
      </div>

  {/* Modal for details */}
{selectedStudent && (
  <div
    className="fixed inset-0 flex justify-center items-center z-50"
    style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }} // 30% opacity black
  >
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        onClick={() => setSelectedStudent(null)}
      >
        <X size={18} />
      </button>
      <h3 className="text-lg font-bold text-gray-700 mb-4">
        Student Details
      </h3>
      <div className="space-y-2 text-gray-600">
        <p><strong>ID:</strong> {selectedStudent.idNumber}</p>
        <p><strong>Admission No.:</strong> {selectedStudent.admissionNumber}</p>
        <p><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.middleName} {selectedStudent.lastName}</p>
        <p><strong>Gender:</strong> {selectedStudent.gender}</p>
        <p><strong>Phone:</strong> {selectedStudent.phoneNumber}</p>
        <p><strong>Email:</strong> {selectedStudent.email}</p>
        <p><strong>Class:</strong> {selectedStudent.className}</p>
        <p><strong>Date of Birth:</strong> {selectedStudent.dateOfBirth?.slice(0,10)}</p>
        <p><strong>Admission Date:</strong> {selectedStudent.admissionDate?.slice(0,10)}</p>
        <p><strong>Current Address:</strong> {selectedStudent.address}</p>
        <p><strong>Permanent Address:</strong> {selectedStudent.permanentAddress}</p>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
