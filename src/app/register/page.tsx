// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    currentJobTitle: "",
    company: "",
    location: "",
    bio: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      // Convert image to base64
      let imageData = null;
      if (imageFile) {
        imageData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          profileImage: imageData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#6F4E37] mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">Your account has been created. Redirecting to login...</p>
          <Link href="/login" className="text-[#6F4E37] font-semibold hover:underline">
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#6F4E37] mb-2">JSS3 Student Registration</h1>
          <p className="text-gray-600">Create your alumni profile</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-[#6F4E37]/20">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-4xl">📷</div>
                )}
              </div>
              <label className="cursor-pointer bg-[#6F4E37] text-white px-4 py-2 rounded-lg hover:bg-[#5a3e2b] transition-colors">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">Max size: 5MB (JPG, PNG)</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Account Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                  placeholder="student@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                  placeholder="Min. 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                placeholder="Re-enter password"
              />
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current School/Job Title</label>
                <input
                  type="text"
                  value={formData.currentJobTitle}
                  onChange={(e) => setFormData({ ...formData, currentJobTitle: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                  placeholder="e.g., SSS1 Student"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current School/Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                  placeholder="e.g., Virtue College"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                placeholder="e.g., Lagos, Nigeria"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6F4E37] focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6F4E37] text-white py-3 rounded-lg font-semibold hover:bg-[#5a3e2b] transition-colors disabled:bg-gray-400"
            >
              {loading ? "Creating Account..." : "Register as JSS Alumni"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#6F4E37] font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}