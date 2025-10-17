import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  BookOpen,
  DollarSign,
  CalendarCheck,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api/axios";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    attendancePercentage: 0,
    feesCollected: 0,
    studentsPerClass: [],
  });

  // Fetch dashboard data (replace with your API if available)
  const fetchDashboardStats = async () => {
    try {
      // Example: call multiple APIs to get data
      const studentsRes = await api.post("/v1/Students/list", {
        pageSize: 0,
        pageNumber: 1,
      });
      const teachersRes = await api.post("/v1/Teacher/list", {
        pageSize: 0,
        pageNumber: 1,
      });
      const attendancePercentage = 0; // replace with actual API
      const feesCollected = 0; // replace with actual API

      // Example: calculate students per class
      const studentsPerClassMap = {};
      (studentsRes.data?.data || []).forEach((s) => {
        const cls = s.className || "Unknown";
        studentsPerClassMap[cls] = (studentsPerClassMap[cls] || 0) + 1;
      });
      const studentsPerClass = Object.entries(studentsPerClassMap).map(([name, count]) => ({ name, count }));

      setStats({
        totalStudents: (studentsRes.data?.data?.length) || 0,
        totalTeachers: (teachersRes.data?.data?.length) || 0,
        attendancePercentage,
        feesCollected,
        studentsPerClass,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-700">Overview</h2>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-400 text-white p-6 rounded-xl shadow flex items-center gap-4">
          <Users size={36} className="opacity-80" />
          <div>
            <p className="text-lg font-semibold">Total Students</p>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6 rounded-xl shadow flex items-center gap-4">
          <UserCheck size={36} className="opacity-80" />
          <div>
            <p className="text-lg font-semibold">Teachers</p>
            <p className="text-2xl font-bold">{stats.totalTeachers}</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-400 text-white p-6 rounded-xl shadow flex items-center gap-4">
          <CalendarCheck size={36} className="opacity-80" />
          <div>
            <p className="text-lg font-semibold">Attendance</p>
            <p className="text-2xl font-bold">{stats.attendancePercentage}%</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-6 rounded-xl shadow flex items-center gap-4">
          <DollarSign size={36} className="opacity-80" />
          <div>
            <p className="text-lg font-semibold">Fees Collected</p>
            <p className="text-2xl font-bold">Rs. {stats.feesCollected.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Students per Class Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Students per Class</h3>
        {stats.studentsPerClass.length === 0 ? (
          <p className="text-gray-400">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.studentsPerClass}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
