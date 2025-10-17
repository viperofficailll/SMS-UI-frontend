import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";
import FloatingInput from "../../../components/ui/FloatingInput";
import { Loader2 } from "lucide-react";

interface Teacher {
  id?: string | null;
  idNumber: string;
  fullName: string;
  gender: string;
  phoneNumber: string;
  email: string;
  address: string;
  hireDate: string;
}

export default function TeacherForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState<Teacher>({
    id: "00000000-0000-0000-0000-000000000000",
    idNumber: "",
    fullName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    address: "",
    hireDate: "",
  });

  // Fetch teacher if editing
  const fetchTeacher = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/v1/Teacher/detail/${id}`);
      setTeacher({
        ...res.data.data,
        id: res.data.data.id || null,
        hireDate: res.data.data.hireDate?.split("T")[0] || "",
      });
    } catch (err) {
      console.error("Error fetching teacher:", err);
      toast.error("Failed to load teacher data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTeacher();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setTeacher((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple front-end validation
    if (!teacher.fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }
    if (!teacher.idNumber.trim()) {
      toast.error("ID Number is required");
      return;
    }

    setLoading(true);
    try {
      // Assign a default UUID if id is null
      const payload = {
        ...teacher,
        id: teacher.id,
      };

      await api.post("/v1/Teacher/add-update", payload);
      toast.success("Teacher saved successfully!");
      navigate("/dashboard/teachers");
    } catch (err) {
      console.error("Error saving teacher:", err);
      toast.error("Failed to save teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">
        {id ? "Edit Teacher" : "Add New Teacher"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FloatingInput
          label="ID Number"
          name="idNumber"
          value={teacher.idNumber}
          onChange={handleChange}
          required
        />
        <FloatingInput
          label="Full Name"
          name="fullName"
          value={teacher.fullName}
          onChange={handleChange}
          required
        />
        <FloatingInput
          label="Gender"
          name="gender"
          value={teacher.gender}
          onChange={handleChange}
          select
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
        <FloatingInput
          label="Phone Number"
          name="phoneNumber"
          value={teacher.phoneNumber}
          onChange={handleChange}
        />
        <FloatingInput
          label="Email"
          name="email"
          type="email"
          value={teacher.email}
          onChange={handleChange}
        />
        
        <FloatingInput
          label="Hire Date"
          name="hireDate"
          type="date"
          value={teacher.hireDate}
          onChange={handleChange}
          required
        />
        <FloatingInput
          label="Address"
          name="address"
          value={teacher.address}
          onChange={handleChange}
          textarea
        />

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center"
          >
            {loading && <Loader2 size={20} className="animate-spin mr-2" />}
            {id ? "Update Teacher" : "Create Teacher"}
          </button>
        </div>
      </form>
    </div>
  );
}
