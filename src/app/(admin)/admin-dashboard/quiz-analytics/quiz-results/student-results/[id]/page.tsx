"use client"

import { useState } from "react"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

const studentData = {
  name: "J Mahibhar Saravanan",
  rollNo: "M012401",
  quizName: "DOC TUTORIAL TEST 1",
  batch: "2024-MBBS-TNMC",
  phase: "1st Year",
  quizDate: "15 March 2024",
  timeTaken: "20:45",
  rank: "#1",
}

const performanceData = {
  correct: 8,
  incorrect: 2,
  skipped: 0,
  finalScore: "8/50",
}

const sampleQuestion = {
  id: 1,
  number: 1,
  totalQuestions: 5,
  question:
    "In order to do a vagotomy (section of vagal nerve trunks) to reduce the secretion of acid by cells of the gastric mucosa in patients with peptic ulcers, one needs to cut the gastric branches and retain vagal innervation to other abdominal viscera. Where would a surgeon look for these branches in relation to the stomach?",
  options: [
    { label: "A", text: "Along the gastrophrenic vessels", isCorrect: false },
    { label: "B", text: "Along the greater curvature", isCorrect: false },
    { label: "C", text: "Along the lesser curvature", isCorrect: true, isSelected: true },
    { label: "D", text: "In the base of the omental apron", isCorrect: false },
  ],
  explanation:
    "The vagal branches to the stomach are found on the lesser curvature. The anterior vagal branches are derived from the left vagal nerve and the posterior vagal branches are derived from the right vagal nerve. This means that in the rotation of the gut, the left side of the stomach rotated to become the ventral aspect of the stomach. Vagotomies are done to reduce the acid secretion of the stomach, since the vagus sends one of the signals that stimulates the parietal cells of the stomach to release HCl.",
  reference: "Textbook of Gray's Anatomy for Students, 4th Edition",
  status: "correct",
}

export default function StudentResultsPage() {
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [selectedFilter, setSelectedFilter] = useState("All (5)")

  const filterOptions = [
    { label: "All (5)", value: "all", active: true },
    { label: "Correct (2)", value: "correct", active: false },
    { label: "Incorrect (2)", value: "incorrect", active: false },
    { label: "Skipped (1)", value: "skipped", active: false },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Quiz Results</span>
                <span>›</span>
                <span>Student Quiz Review</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">{studentData.quizName}</h1>
              <p className="text-sm text-gray-600">Detailed question-by-question review and analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quiz Information */}
        <div className="bg-white rounded-lg p-6 border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">📊</span>
            </div>
            <h3 className="font-semibold text-gray-900">Quiz Information</h3>
          </div>

          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Student</div>
              <div className="font-medium text-gray-900">{studentData.name}</div>
              <div className="text-sm text-gray-500">{studentData.rollNo}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Quiz Date</div>
              <div className="font-medium text-gray-900">{studentData.quizDate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Batch & Phase</div>
              <div className="font-medium text-gray-900">{studentData.batch}</div>
              <div className="text-sm text-gray-500">{studentData.phase}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Time Taken</div>
              <div className="font-medium text-gray-900">{studentData.timeTaken}</div>
              <div className="text-sm text-gray-500">{studentData.rank}</div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{performanceData.correct}</div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">{performanceData.incorrect}</div>
              <div className="text-sm text-gray-500">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600 mb-1">{performanceData.skipped}</div>
              <div className="text-sm text-gray-500">Skipped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{performanceData.finalScore}</div>
              <div className="text-sm text-gray-500">Final Score</div>
            </div>
          </div>
        </div>

        {/* Question Filters */}
        <div className="bg-white rounded-lg p-6 border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold text-gray-900">Question Filters</h3>
            <span className="text-sm text-gray-500">Filter questions by response type</span>
          </div>

          <div className="flex gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.label)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedFilter === filter.label
                    ? "bg-blue-600 text-white"
                    : filter.value === "correct"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : filter.value === "incorrect"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : filter.value === "skipped"
                          ? "bg-gray-50 text-gray-700 border border-gray-200"
                          : "bg-gray-100 text-gray-700"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Question Display */}
        <div className="bg-white rounded-lg border">
          {/* Question Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">Question {sampleQuestion.number}</span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                      sampleQuestion.status === "correct" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {sampleQuestion.status === "correct" ? "✓" : "✗"}
                  </span>
                  <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded">correct</span>
                </div>
                <div className="text-sm text-gray-500">
                  Question {sampleQuestion.number} of {sampleQuestion.totalQuestions}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(sampleQuestion.number / sampleQuestion.totalQuestions) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-900 leading-relaxed">{sampleQuestion.question}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Answer Options:</h4>
              <div className="space-y-3">
                {sampleQuestion.options.map((option) => (
                  <div
                    key={option.label}
                    className={`p-4 rounded-lg border-2 ${
                      option.isCorrect && option.isSelected
                        ? "bg-green-50 border-green-200"
                        : option.isCorrect
                          ? "bg-green-50 border-green-200"
                          : option.isSelected
                            ? "bg-red-50 border-red-200"
                            : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-medium text-gray-900">({option.label})</span>
                      <span className="text-gray-900">{option.text}</span>
                      <div className="ml-auto flex items-center gap-2">
                        {option.isSelected && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            Your Answer (Correct)
                          </span>
                        )}
                        {option.isCorrect && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Explanation:</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 leading-relaxed">{sampleQuestion.explanation}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Reference:</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>📚</span>
                <span>{sampleQuestion.reference}</span>
              </div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentQuestion(num)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium ${
                      num === currentQuestion
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
