"use client"

import { useState } from "react"
import { BarChart3, Users, TrendingUp, Award, Search, Filter, Eye, Download } from "lucide-react"

const analyticsData = {
  totalQuizzes: 8,
  totalAttempts: 1115,
  averagePassRate: 82.2,
  averageScore: 23.7,
}

const quizPerformanceData = [
  {
    id: 1,
    name: "DOC TUTORIAL TEST 1",
    date: "15/03/2024 - 16/03/2024",
    creator: "Dr. Sharma",
    batch: "2024-MBBS-TNMC",
    phase: "1st Year",
    subject: "General Medicine",
    duration: "60 mins",
    totalQuestions: 50,
    attempts: 185,
    avgTime: "30:47",
    avgScore: "32.5/50",
    scoreRange: "12-48",
    passRate: 78.5,
    status: "Completed",
  },
  {
    id: 2,
    name: "PAED DT 2",
    date: "11/06/2024 - 12/06/2024",
    creator: "Dr. Patel",
    batch: "2024-MBBS-TNMC",
    phase: "1st Year",
    subject: "Pediatrics",
    duration: "30 mins",
    totalQuestions: 20,
    attempts: 192,
    avgTime: "16:58",
    avgScore: "14.2/20",
    scoreRange: "5-20",
    passRate: 85.4,
    status: "Completed",
  },
  {
    id: 3,
    name: "General Surgery DT 2",
    date: "13/06/2024 - 14/06/2024",
    creator: "Dr. Kumar",
    batch: "2023-MBBS-TNMC",
    phase: "2nd Year",
    subject: "Surgery",
    duration: "45 mins",
    totalQuestions: 25,
    attempts: 156,
    avgTime: "13:00",
    avgScore: "18.3/25",
    scoreRange: "6-25",
    passRate: 72.4,
    status: "Completed",
  },
]

export default function AnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBatch, setSelectedBatch] = useState("All Batches")
  const [selectedPhase, setSelectedPhase] = useState("All Phases")
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [selectedStatus, setSelectedStatus] = useState("Completed")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-6 h-6 text-gray-700" />
              <h1 className="text-2xl font-semibold text-gray-900">Quiz Analytics & Performance</h1>
            </div>
            <p className="text-gray-600">
              Comprehensive analytics for all completed quizzes with batch-wise and subject-wise insights.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export Analytics
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-600 font-medium">Total Quizzes</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{analyticsData.totalQuizzes}</div>
            <div className="text-sm text-gray-500">Completed assessments</div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-600 font-medium">Total Attempts</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{analyticsData.totalAttempts.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Student participations</div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-gray-600 font-medium">Average Pass Rate</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{analyticsData.averagePassRate}%</div>
            <div className="text-sm text-gray-500">Overall success rate</div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-600 font-medium">Average Score</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{analyticsData.averageScore}</div>
            <div className="text-sm text-gray-500">Mean performance</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-lg p-6 border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters & Search</h3>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by quiz name, subject, date, or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All Batches</option>
                  <option>2024-MBBS-TNMC</option>
                  <option>2023-MBBS-TNMC</option>
                  <option>2022-MBBS-TNMC</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phase/Year</label>
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All Phases</option>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All Subjects</option>
                  <option>General Medicine</option>
                  <option>Pediatrics</option>
                  <option>Surgery</option>
                  <option>Anatomy</option>
                  <option>Physiology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Completed</option>
                  <option>Live</option>
                  <option>Scheduled</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Performance Table */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Quiz Performance Analytics (8)</h3>
              <p className="text-sm text-gray-500">Click any quiz row to view detailed analytics</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch & Phase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pass Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quizPerformanceData.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{quiz.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <span>📅</span>
                          {quiz.date}
                        </div>
                        <div className="text-sm text-gray-500">Created by: {quiz.creator}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-blue-600">{quiz.batch}</div>
                        <div className="text-gray-500">{quiz.phase}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {quiz.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <span>⏱️</span>
                          {quiz.duration}
                        </div>
                        <div className="text-gray-500">{quiz.totalQuestions} questions</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{quiz.attempts}</div>
                        <div className="text-gray-500">Avg time: {quiz.avgTime}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">{quiz.avgScore}</div>
                        <div className="text-gray-500">Range: {quiz.scoreRange}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-green-600">{quiz.passRate}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {quiz.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
