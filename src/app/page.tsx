"use client";

export default function LandingPage() {
  return (
    <div className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          NEET PG LMS Platform
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto">
          A centralized learning system with smart question banks, video explanations, and interactive modules — built for NEET PG aspirants and managed seamlessly by colleges.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/register"
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Centralized Question Bank
            </h3>
            <p className="text-gray-600">
              Questions categorized by course, subject, and module — each with
              multiple choices, correct answers, video explanations, and
              detailed notes.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Interactive Quizzes
            </h3>
            <p className="text-gray-600">
              Faculty can create, update, and assign quizzes to batches. Students
              attempt tests and instantly view results with analytics.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-blue-600 mb-3">
              Video & Explanation
            </h3>
            <p className="text-gray-600">
              Each question is enriched with optional videos and explanations to
              strengthen concept clarity for students.
            </p>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">Roles & Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Product Owner
            </h3>
            <p className="text-gray-600">
              Manages multiple colleges on the platform, oversees licensing and
              ensures smooth administration.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              College Admin
            </h3>
            <p className="text-gray-600">
              College owner/manager can manage faculty, students, batches,
              assign courses, and oversee performance.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Faculty</h3>
            <p className="text-gray-600">
              Create and update quiz questions, organize modules, and share posts
              or announcements directly to assigned batches.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Students</h3>
            <p className="text-gray-600">
              Login to attempt quizzes, access course content, view results, and
              track progress with personalized insights.
            </p>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <span className="text-blue-600 font-bold text-lg">Step 1</span>
            <p className="mt-2 text-gray-600">College registers on the platform.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <span className="text-blue-600 font-bold text-lg">Step 2</span>
            <p className="mt-2 text-gray-600">Faculty set up question banks and quizzes.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <span className="text-blue-600 font-bold text-lg">Step 3</span>
            <p className="mt-2 text-gray-600">
              Students log in, practice, and attempt tests.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <span className="text-blue-600 font-bold text-lg">Step 4</span>
            <p className="mt-2 text-gray-600">
              Results & analytics are available instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose Our LMS?</h2>
        <p className="max-w-2xl mx-auto text-lg mb-8">
          Designed exclusively for NEET PG aspirants, our LMS empowers colleges,
          faculty, and students with centralized resources, interactive learning,
          and real-time analytics.
        </p>
        <a
          href="/register"
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
        >
          Start Free Trial
        </a>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 bg-gray-100">
        © {new Date().getFullYear()} NEET PG LMS. All rights reserved.
      </footer>
    </div>
  );
}
