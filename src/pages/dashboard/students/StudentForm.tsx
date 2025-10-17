import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import FloatingInput from "../../../components/ui/FloatingInput";
import { v4 as uuidv4 } from "uuid";
interface ClassItem {
  id: string;
  name: string;
}

interface Student {
  id?: string|null;
  idNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  permanentAddress: string;
  phoneNumber: string;
  email: string;
  admissionNumber: string|null;
  admissionDate: string;
  rollNumber: string;
  previousSchool: string;
  isScholarship: boolean;
  citizenshipNumber: string;
  passportNumber: string;
  nationalId: string;
  photoUrl: string;
  signatureUrl: string;
  idIssuedDate: string;
  idIssuedPlace: string;
  bloodGroup: string;
  medicalNotes: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  relationWithEmergencyContact: string;
  className: string;
  classId: string | null;
}

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [student, setStudent] = useState<Student>({
    idNumber: "",
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    permanentAddress: "",
    phoneNumber: "",
    email: "s@noemail.com",
    admissionNumber: "UNSET",
    admissionDate: "",
    rollNumber: "",
    previousSchool: "",
    isScholarship: false,
    citizenshipNumber: "",
    passportNumber: "",
    nationalId: "",
    photoUrl: "",
    signatureUrl: "",
    idIssuedDate: "0001-01-01T00:00:00Z",
    idIssuedPlace: "",
    bloodGroup: "",
    medicalNotes: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    relationWithEmergencyContact: "",
    className: "",
    classId: "00000000-0000-0000-0000-000000000000",
    id: "00000000-0000-0000-0000-000000000000",
  });

  // Fetch classes
  const fetchClasses = async () => {
    try {
      const res = await api.post("/v1/Class/list", {
        pageSize: 100,
        pageNumber: 1,
      });
      setClasses(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  // Fetch student for edit
  const fetchStudent = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.get(`/v1/Students/detail/${id}`);
      setStudent({
        ...res.data.data,
        classId: res.data.data.classId || null,
        className: res.data.data.className || "",
      });
    } catch (err) {
      console.error("Error fetching student:", err);
      toast.error("Failed to load student data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    if (id) fetchStudent();
  }, [id]);

  // Handle field change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, checked } = e.target;
    setStudent({
      ...student,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/v1/Students/add-update", student);
      toast.success("Student saved successfully!");
      navigate("/dashboard/students");
    } catch (err) {
      console.error("Error saving student:", err);
      toast.error("Failed to save student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">
        {id ? "Edit Student" : "Add New Student"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
       
       
        <FloatingInput
          label="Class"
          name="classId"
          required
          error="Class is required"
          value={student.classId || ""}
          onChange={(e) =>
            setStudent({
              ...student,
              classId: e.target.value || null,
              className:
                classes.find((c) => c.id === e.target.value)?.name || "",
            })
          }
          select
          options={classes.map((c) => ({ value: c.id, label: c.name }))}
        />

       
        <FloatingInput label="ID Number" 
         minLength={3}
         maxLength={30}
         name="idNumber" error="ID is required." value={student.idNumber} onChange={handleChange} required/>
         <FloatingInput label="First Name"
         minLength={3}
         maxLength={30}
         name="firstName" error="First name is required." value={student.firstName} onChange={handleChange} required/>
        <FloatingInput label="Middle Name" name="middleName"value={student.middleName} onChange={handleChange} />
        <FloatingInput
        maxLength={30}
        minLength={3} label="Last Name" name="lastName" error="Last name is required." value={student.lastName} onChange={handleChange} required />
       
       
        <FloatingInput
          label="Gender"
          name="gender"
          required
          value={student.gender}
          onChange={handleChange}
          select
          options={[
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ]}
        />
        
            <FloatingInput
        label="Blood Group"
        name="bloodGroup"
        value={student.bloodGroup}
        onChange={handleChange}
        required
        select
        options={[
            { value: "x", label: "Unknown" },
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" }
        ]}
        />

        <FloatingInput
          label="Date Of Birth"
          name="dateOfBirth"
          type="date"
          required
          value={student.dateOfBirth}
          onChange={handleChange}
        />

     <FloatingInput label="Phone Number" minLength={6} maxLength={15} required error="Contact number is required." name="phoneNumber" value={student.phoneNumber} onChange={handleChange} />
    
       
       <FloatingInput label="Email" name="email" minLength={5} maxLength={30} required error="Email is required." type="email" value={student.email} onChange={handleChange} />


  <FloatingInput label="Medical Notes" name="medicalNotes" value={student.medicalNotes} onChange={handleChange} />
       
  <FloatingInput label="Previous School" name="previousSchool" value={student.previousSchool} onChange={handleChange} />
       


        <label className="flex items-center space-x-2 col-span-2">
          <input
            type="checkbox"
            name="isScholarship"
            checked={student.isScholarship}
            onChange={handleChange}
          />
          <span>Scholarship Student</span>
        </label>
        
        <FloatingInput
          label="Admission Date"
          name="admissionDate"
          type="date"
          required
          error="Admission date is required."
          value={student.admissionDate}
          onChange={handleChange}
        />

  <FloatingInput label="Citizenship Number" name="citizenshipNumber" value={student.citizenshipNumber} onChange={handleChange} />
       
  <FloatingInput label="Passport Number" name="passportNumber" value={student.passportNumber} onChange={handleChange} />
       
       
        <FloatingInput
          label="Current Address"
          name="address"
          required
          error="Current address is required."
          value={student.address}
          onChange={handleChange}
          textarea
          className="col-span-2"
        />
        <FloatingInput
          label="Permanent Address"
          required
          error="Permanent address is required."
          name="permanentAddress"
          value={student.permanentAddress}
          onChange={handleChange}
          textarea
          className="col-span-2"
        />


  <FloatingInput error="Emergency contact is required." label="Emergency Contact Name" required name="emergencyContactName" value={student.emergencyContactName} onChange={handleChange} />
       
       
  <FloatingInput error="Contact Number is required." label="Emergency Contact Number" required name="emergencyContactNumber" value={student.emergencyContactNumber} onChange={handleChange} />
       
  <FloatingInput error="Relation is required." label="Emergency Contact Relation" required name="relationWithEmergencyContact" value={student.relationWithEmergencyContact} onChange={handleChange} />
       
        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 flex items-center"
          >
            {loading && <Loader2 size={20} className="animate-spin mr-2" />}
            {id ? "Update Student" : "Create Student"}
          </button>
        </div>
      </form>
    </div>
  );
}
