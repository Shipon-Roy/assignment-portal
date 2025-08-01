"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push(
        session.user.role === "INSTRUCTOR"
          ? "/dashboard/instructor"
          : "/dashboard/student"
      );
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (status === "authenticated") return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6 text-white">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-center">
        📚 Assignment Submission Portal
      </h1>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
        Submit your assignments, track your progress, and get feedback from
        instructors — all in one place.
      </p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300"
        >
          🔑 Login
        </Link>
        <Link
          href="/register"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300"
        >
          📝 Register
        </Link>
      </div>

      {/* Illustration */}
      <div className="mt-12">
        <Image
          src="https://illustrations.popsy.co/blue/success.svg"
          alt="Assignment Portal"
          width={400}
          height={400}
          className="max-w-md w-full"
        />
      </div>
    </div>
  );
}
