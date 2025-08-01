"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", { ...form, redirect: false });
    if (!res.error) router.push("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-700 p-6 rounded shadow-md space-y-4 w-96"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
