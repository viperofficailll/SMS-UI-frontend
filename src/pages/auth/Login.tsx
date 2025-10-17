import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const { setToken } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await axios.post("https://app.efox.com.np/api/v1/Auth/getToken", {
        serviceUrl: "erp.com.np",
        userName: data.username,
        password: data.password,
      });
console.log(res);
      if (typeof res.data === "string") {
        setToken(res.data);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error(res?.data?.msg || "Invalid login credentials");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/70 shadow-lg rounded-3xl p-8 w-full max-w-md border border-white/40"
      >
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">
          School Management Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              {...register("username")}
              placeholder="Enter your username"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg p-2 outline-none transition"
            />
            {formState.errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-lg p-2 outline-none transition"
            />
            {formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 font-medium transition flex items-center justify-center"
          >
            {formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          © {new Date().getFullYear()} Efox Systems — School Management
        </p>
      </motion.div>
    </div>
  );
}
