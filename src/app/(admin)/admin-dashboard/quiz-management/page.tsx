"use client"

import { useState } from "react"
import { Plus, Search, Filter, FileText, Edit, Trash2, Send, Calendar, Users } from "lucide-react"
import { useRouter } from "next/navigation";

interface Quiz {
  id: string
  name: string
  status: "draft" | "live" | "scheduled" | "completed"
  subjects: string[]
  totalQuestions: number
  quizDate: string | null
  createdAt: string
}

const sampleQuizzes: Quiz[] = [
  {
    id: "1",
    name: "Test",
    status: "live",
    subjects: ["Anatomy", "Physiology", "Pathology"],
    totalQuestions: 10,
    quizDate: "2025-07-28 04:30:29",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "test_1",
    status: "draft",
    subjects: ["Anatomy"],
    totalQuestions: 7,
    quizDate: null,
    createdAt: "2025-01-14",
  },
  {
    id: "3",
    name: "test",
    status: "draft",
    subjects: ["Anatomy"],
    totalQuestions: 0,
    quizDate: null,
    createdAt: "2025-01-13",
  },
]

const statusConfig = {
  draft: { label: "Draft", color: "bg-orange-100 text-orange-800", count: 2 },
  live: { label: "Live", color: "bg-green-100 text-green-800", count: 1 },
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-800", count: 0 },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-800", count: 0 },
}

export default function QuizListPage() {
  const [activeTab, setActiveTab] = useState<"all" | "draft" | "live" | "scheduled" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")

  const router = useRouter();

  const filteredQuizzes = sampleQuizzes.filter((quiz) => {
    const matchesSearch = quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || quiz.status === activeTab
    return matchesSearch && matchesTab
  })

  const getStatusBadge = (status: Quiz["status"]) => {
    const config = statusConfig[status]
    return <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>{config.label}</span>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not Posted"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Quiz Create</h1>
            <p className="text-gray-600">Create and manage your quizzes</p>
          </div>
          <button onClick={()=>router.push("/admin-dashboard/quiz-management/create")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Quiz Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 bg-white">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-8 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "all"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{sampleQuizzes.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "draft"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Draft
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {statusConfig.draft.count}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("scheduled")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "scheduled"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Scheduled
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {statusConfig.scheduled.count}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("live")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "live"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Live
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {statusConfig.live.count}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "completed"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Completed
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {statusConfig.completed.count}
            </span>
          </button>
        </div>

        {/* Quiz Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Quiz Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{quiz.name}</h3>
                  {getStatusBadge(quiz.status)}
                </div>
              </div>

              {/* Quiz Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>Subject: {quiz.subjects.join(", ")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Total Questions: {quiz.totalQuestions}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Quiz Date: {formatDate(quiz.quizDate)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                  <FileText className="w-4 h-4" />
                  Get Questions
                </button>

                <div className="flex gap-2">
                  {quiz.status === "draft" && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  )}
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 text-sm">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Get started by creating your first quiz"}
            </p>
            {!searchQuery && (
              <button 
              onClick={()=>router.push("/admin-dashboard/quiz-management/create")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-auto">
                <Plus className="w-4 h-4" />
                Create Quiz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
