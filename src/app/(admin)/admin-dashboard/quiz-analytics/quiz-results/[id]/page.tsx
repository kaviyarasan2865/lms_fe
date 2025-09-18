"use client"

import { useState } from "react"
import { ArrowLeft, Download, Search, Trophy, Users, TrendingUp, Award } from "lucide-react"

const quizData = {
  name: "DOC TUTORIAL TEST 1",
  subject: "General Medicine",
  batch: "2024-MBBS-TNMC",
  phase: "1st Year",
  date: "15 March 2024",
  duration: "60 minutes",
  totalQuestions: 50,
}

const topPerformers = [
  { rank: 1, name: "J Mahibhar Saravanan", rollNo: "M012401", score: "8/10" },
  { rank: 2, name: "Aklah Shailesh Prabhu", rollNo: "M012403", score: "8/10" },
  { rank: 3, name: "G Vijay Anand", rollNo: "M012405", score: "8/10" },
]

const summaryStats = {
  totalStudents: 10,
  averageScore: "7.4/50",
  passRate: "100.0%",
  highestScore: "48/50",
}

const studentResults = [
  {
    rank: 1,
    name: "J Mahibhar Saravanan",
    batch: "2024-MBBS-TNMC",
    rollNo: "M012401",
    score: "8/10",
    percentage: "80.0%",
    performance: { correct: 8, incorrect: 1, skipped: 1 },
    timeTaken: "20:45",
  },
  {
    rank: 2,
    name: "Aklah Shailesh Prabhu",
    batch: "2024-MBBS-TNMC",
    rollNo: "M012403",
    score: "8/10",
    percentage: "80.0%",
    performance: { correct: 8, incorrect: 1, skipped: 1 },
    timeTaken: "19:16",
  },
  {
    rank: 3,
    name: "G Vijay Anand",
    batch: "2024-MBBS-TNMC",
    rollNo: "M012408",
    score: "8/10",
    percentage: "80.0%",
    performance: { correct: 8, incorrect: 1, skipped: 1 },
    timeTaken: "22:58",
  },
  {
    rank: 4,
    name: "DR ARUN ASHWIN",
    batch: "2024-MBBS-TNMC",
    rollNo: "M012412",
    score: "8/10",
    percentage: "80.0%",
    performance: { correct: 8, incorrect: 1, skipped: 1 },
    timeTaken: "21:29",
  },
  {
    rank: 5,
    name: "Abram D",
    batch: "2024-MBBS-TNMC",
    rollNo: "M012474",
    score: "8/10",
    percentage: "80.0%",
    performance: { correct: 8, incorrect: 1, skipped: 1 },
    timeTaken: "23:43",
  },
]

export default function QuizResultsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedScoreRange, setSelectedScoreRange] = useState("All Scores")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              Back to Analytics
            </button>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Quiz Analytics</span>
                <span>›</span>
                <span>Quiz Results</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">{quizData.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{quizData.subject}</span>
                <span>{quizData.batch}</span>
                <span>{quizData.phase}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Quiz conducted on {quizData.date} • {quizData.duration} • {quizData.totalQuestions} questions
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
            <Download className="w-4 h-4" />
            Download Results
          </button>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-lg p-6 border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">Top Performers</h3>
            <span className="text-sm text-gray-500">Leaderboard for this quiz</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {topPerformers.map((performer, index) => (
              <div
                key={performer.rank}
                className={`p-4 rounded-lg border-2 ${
                  index === 0
                    ? "bg-yellow-50 border-yellow-200"
                    : index === 1
                      ? "bg-gray-50 border-gray-200"
                      : "bg-orange-50 border-orange-200"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold mb-2 ${
                      index === 0 ? "text-yellow-600" : index === 1 ? "text-gray-600" : "text-orange-600"
                    }`}
                  >
                    {performer.rank}
                  </div>
                  <div className="font-medium text-gray-900">{performer.name}</div>
                  <div className="text-sm text-gray-500">{performer.rollNo}</div>
                  <div className="font-semibold text-lg mt-2">{performer.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-600 font-medium">Total Students</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{summaryStats.totalStudents}</div>
            <div className="text-sm text-gray-500">Attempted the quiz</div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-600 font-medium">Average Score</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{summaryStats.averageScore}</div>
            <div className="text-sm text-gray-500">74.0% average</div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-600 font-medium">Pass Rate</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{summaryStats.passRate}</div>
            <div className="text-sm text-gray-500">10 students passed</div>
          </div>

          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-gray-600 font-medium">Highest Score</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{summaryStats.highestScore}</div>
            <div className="text-sm text-gray-500">Best performance</div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg p-6 border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Search & Filters</h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Status</option>
                <option>Passed</option>
                <option>Failed</option>
                <option>Absent</option>
              </select>
            </div>

            <div>
              <select
                value={selectedScoreRange}
                onChange={(e) => setSelectedScoreRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Scores</option>
                <option>90-100%</option>
                <option>80-89%</option>
                <option>70-79%</option>
                <option>60-69%</option>
                <option>Below 60%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Student Results Table */}
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Student Results (10)</h3>
              <p className="text-sm text-gray-500">Click "Review" to view detailed student performance</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Review
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentResults.map((student) => (
                  <tr key={student.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            student.rank === 1
                              ? "bg-yellow-100 text-yellow-800"
                              : student.rank === 2
                                ? "bg-gray-100 text-gray-800"
                                : student.rank === 3
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          #{student.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.batch}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{student.rollNo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{student.score}</div>
                        <div className="text-sm text-gray-500">{student.percentage}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓ {student.performance.correct}</span>
                        <span className="text-red-600">✗ {student.performance.incorrect}</span>
                        <span className="text-gray-500">— {student.performance.skipped}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{student.timeTaken}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        Review
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
