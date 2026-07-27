// src/app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // We handle the redirect manually
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/"); // Redirect to home page on success
      router.refresh(); // Refresh to update session state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-[#6F4E37]/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#6F4E37]">
            Virtue College JSS Alumni
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your JSS 3 Graduate Account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-md text-white bg-[#6F4E37] hover:bg-[#5a3e2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6F4E37] disabled:bg-gray-400 transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
            
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link href="/register" className="text-[#6F4E37] hover:text-[#5a3e2b] font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}