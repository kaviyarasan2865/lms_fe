"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminRegister() {
  const [form, setForm] = useState({
    name: "",
    college: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: form.email.split('@')[0], // Use email prefix as username
          email: form.email,
          first_name: form.name.split(' ')[0] || form.name,
          last_name: form.name.split(' ').slice(1).join(' ') || '',
          password: form.password,
          password_confirm: form.confirmPassword,
          phone_number: form.phone_number || '',
          role: 'college_admin',
          college_name: form.college,
          college_code: form.college.replace(/\s+/g, '').toUpperCase().substring(0, 10), // Generate code from college name
          course: 'MBBS', // Default course for medical colleges
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        // Auto-login after successful registration
        const loginResult = await login(form.email.split('@')[0], form.password);

        if (loginResult.success) {
          // Redirect to admin dashboard
          window.location.href = '/admin-dashboard';
        } else {
          alert('Registration successful! Please login to continue.');
          window.location.href = '/login';
        }
      } else {
        console.error('Registration failed:', data);
        alert(`Registration failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create Admin Account</h1>
          <p className="text-sm text-gray-500">Register your college portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              suppressHydrationWarning
            />
          </div>

          {/* College Name */}
          <div>
            <label
              htmlFor="college"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              College Name
            </label>
            <input
              id="college"
              name="college"
              type="text"
              required
              value={form.college}
              onChange={handleChange}
              placeholder="ABC Medical College"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              suppressHydrationWarning
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="admin@college.edu"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              suppressHydrationWarning
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              id="phone_number"
              name="phone_number"
              type="tel"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="+1234567890"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              suppressHydrationWarning
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              suppressHydrationWarning
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              suppressHydrationWarning
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors disabled:opacity-70"
            suppressHydrationWarning
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
