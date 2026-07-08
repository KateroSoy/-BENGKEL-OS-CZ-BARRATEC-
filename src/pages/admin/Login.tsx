import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        navigate("/admin/dashboard");
      } else {
        const result = await res.json();
        setError(result.error || "Login gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-100/40 to-indigo-100/40 blur-3xl -z-10 rounded-full opacity-70"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-200/60 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <div className="space-y-1 text-center pb-8 pt-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-800">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Admin BENGKEL OS CZ-BARRATEC</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Masuk ke ruang kerja Anda</p>
          </div>
          <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl font-medium border border-red-100 text-center">
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-1">Email Admin</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue="admin@bengkel.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="admin@bengkel.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  defaultValue="admin123"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mengautentikasi...' : (
                    <>Masuk <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          &copy; {new Date().getFullYear()} BENGKEL OS CZ-BARRATEC. Hak cipta dilindungi.
        </p>
      </motion.div>
    </div>
  );
}
