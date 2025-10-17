import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../src/pages/auth/Login";
import DashboardLayout from "../src/layouts/DashboardLayout";
import DashboardHome from "../src/pages/dashboard";
import NotFound from "../src/pages/NotFound";
import ExportManager from "./pages/settings/ExportManager";
import ClassesList from "./pages/dashboard/classes/ClassList";
import Students from "./pages/dashboard/students/Students";
import Teachers from "./pages/dashboard/teachers/Teachers";
import StudentForm from "./pages/dashboard/students/StudentForm";
import TeacherForm from "./pages/dashboard/teachers/TeacherForm";
import { Toaster } from "sonner";
import LedgerForm from "./pages/dashboard/Ledger/LedgerForm";
import Ledgers from "./pages/dashboard/Ledger/Ledger";

export default function App() {
  return (
    <>
      {/* Global Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="students" element={<Students />} />
          <Route path="students/add" element={<StudentForm />} />{" "}
          {/* ✅ Add route for creating */}
          <Route path="students/edit/:id" element={<StudentForm />} />{" "}
          {/* ✅ Add route for editing */}
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/add" element={<TeacherForm />} />{" "}
          {/* ✅ Add route for creating */}
          <Route path="teachers/edit/:id" element={<TeacherForm />} />{" "}
          {/* ✅ Add route for editing */}
          <Route path="classes" element={<ClassesList />} />
          <Route path="Ledger" element={<Ledgers />} />
          <Route path="Ledger/add" element={<LedgerForm />} />
        </Route>

        <Route path="/settings" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="export" element={<ExportManager />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
