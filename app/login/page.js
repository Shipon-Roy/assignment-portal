"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    if (!res.error) {
      router.push("/");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="bg-gray-800 rounded-xl shadow-2xl flex overflow-hidden max-w-4xl w-full">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex w-1/2 bg-gray-900 p-8 items-center justify-center">
          <Image
            src="https://illustrations.popsy.co/blue/success.svg"
            alt="Assignment Portal"
            width={400}
            height={400}
            className="max-w-md w-full"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-gray-400 mb-6">
            Login to your account to access assignments and submissions.
          </p>

          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300"
            >
              🔑 Login
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-400 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
