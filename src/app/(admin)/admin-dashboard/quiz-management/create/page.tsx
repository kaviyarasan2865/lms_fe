"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Plus, Minus, RotateCcw, Check, X, ChevronDown, Calendar } from "lucide-react"
import { useRouter } from "next/navigation";

interface QuizData {
  name: string
  totalQuestions: number
  subjects: string[]
  instructions: string
  questionDistribution: {
    [subject: string]: {
      count: number
      topics: string[]
      modules: string[]
    }
  }
  questions: Array<{
    id: number
    subject: string
    topic: string
    module: string
    question: string
    options: Array<{
      label: string
      text: string
      isCorrect: boolean
    }>
    explanation: string
  }>
  course: string
  batch: string
  phase: string
  marksPerQuestion: number
  negativeMarks: number
  duration: number
  startDate: string
  endDate: string
  questionOrder: string
  notifyStudents: string
  allowReview: boolean
}

const subjects = [
  "Anatomy",
  "Physiology",
  "Biochemistry",
  "Pathology",
  "Microbiology",
  "Pharmacology",
  "Forensic Medicine",
  "Community Medicine",
]

const topicsBySubject = {
  Anatomy: ["Head & Neck", "Thorax", "Abdomen", "Upper & Lower Extremities"],
  Physiology: ["Cardiovascular System", "Respiratory System", "Nervous System", "Renal System"],
  Biochemistry: ["Carbohydrates", "Proteins", "Lipids", "Enzymes"],
  Pathology: ["General Pathology", "Systemic Pathology", "Clinical Pathology"],
  Microbiology: ["Bacteriology", "Virology", "Mycology", "Parasitology"],
  Pharmacology: ["General Pharmacology", "Autonomic Nervous System", "CNS Drugs"],
  "Forensic Medicine": ["Thanatology", "Toxicology", "Medical Jurisprudence"],
  "Community Medicine": ["Epidemiology", "Biostatistics", "Health Programs"],
}

const modulesByTopic = {
  "Cardiovascular System": [
    "Cardiac Cycle",
    "Blood Pressure Regulation",
    "Electrocardiography",
    "Systemic and Pulmonary Circulation",
  ],
  "Head & Neck": ["Skull and Facial Bones", "Brain and Cranial Nerves", "Neck Muscles", "Blood Supply"],
  "Respiratory System": ["Lung Function", "Gas Exchange", "Respiratory Control"],
  "Nervous System": ["Central Nervous System", "Peripheral Nervous System", "Autonomic Nervous System"],
}

export default function QuizCreationWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [quizData, setQuizData] = useState<QuizData>({
    name: "",
    totalQuestions: 5,
    subjects: [],
    instructions: "",
    questionDistribution: {},
    questions: [],
    course: "",
    batch: "",
    phase: "",
    marksPerQuestion: 1,
    negativeMarks: 0,
    duration: 60,
    startDate: "",
    endDate: "",
    questionOrder: "Random Order",
    notifyStudents: "Notify before test only",
    allowReview: false,
  })

  const [dropdownStates, setDropdownStates] = useState<{ [key: string]: boolean }>({})

  const router = useRouter();

  const toggleDropdown = (key: string) => {
    setDropdownStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const updateQuestionCount = (subject: string, increment: boolean) => {
    setQuizData((prev) => ({
      ...prev,
      questionDistribution: {
        ...prev.questionDistribution,
        [subject]: {
          ...prev.questionDistribution[subject],
          count: Math.max(0, (prev.questionDistribution[subject]?.count || 0) + (increment ? 1 : -1)),
        },
      },
    }))
  }

  const toggleSubject = (subject: string) => {
    setQuizData((prev) => {
      const isSelected = prev.subjects.includes(subject)
      const newSubjects = isSelected ? prev.subjects.filter((s) => s !== subject) : [...prev.subjects, subject]

      const newDistribution = { ...prev.questionDistribution }
      if (!isSelected) {
        newDistribution[subject] = { count: 1, topics: [], modules: [] }
      } else {
        delete newDistribution[subject]
      }

      return {
        ...prev,
        subjects: newSubjects,
        questionDistribution: newDistribution,
      }
    })
  }

  const toggleTopic = (subject: string, topic: string) => {
    setQuizData((prev) => ({
      ...prev,
      questionDistribution: {
        ...prev.questionDistribution,
        [subject]: {
          ...prev.questionDistribution[subject],
          topics: prev.questionDistribution[subject]?.topics.includes(topic)
            ? prev.questionDistribution[subject].topics.filter((t) => t !== topic)
            : [...(prev.questionDistribution[subject]?.topics || []), topic],
        },
      },
    }))
  }

  const toggleModule = (subject: string, module: string) => {
    setQuizData((prev) => ({
      ...prev,
      questionDistribution: {
        ...prev.questionDistribution,
        [subject]: {
          ...prev.questionDistribution[subject],
          modules: prev.questionDistribution[subject]?.modules.includes(module)
            ? prev.questionDistribution[subject].modules.filter((m) => m !== module)
            : [...(prev.questionDistribution[subject]?.modules || []), module],
        },
      },
    }))
  }

  const generateSampleQuestions = () => {
    const questions = []
    let questionId = 1

    Object.entries(quizData.questionDistribution).forEach(([subject, config]) => {
      for (let i = 0; i < config.count; i++) {
        const selectedTopics =
          config.topics.length > 0 ? config.topics : topicsBySubject[subject as keyof typeof topicsBySubject] || []
        const topic = selectedTopics[Math.floor(Math.random() * selectedTopics.length)] || "General"
        const modules =
          config.modules.length > 0
            ? config.modules
            : modulesByTopic[topic as keyof typeof modulesByTopic] || ["General"]
        const module = modules[Math.floor(Math.random() * modules.length)]

        questions.push({
          id: questionId++,
          subject,
          topic,
          module,
          question: `Sample question ${questionId - 1} from ${subject} - ${topic} - ${module}`,
          options: [
            { label: "A", text: "Option A - Correct answer", isCorrect: true },
            { label: "B", text: "Option B - Incorrect", isCorrect: false },
            { label: "C", text: "Option C - Incorrect", isCorrect: false },
            { label: "D", text: "Option D - Incorrect", isCorrect: false },
          ],
          explanation: "This is a sample explanation for the correct answer.",
        })
      }
    })

    setQuizData((prev) => ({ ...prev, questions }))
  }

  const nextStep = () => {
    if (currentStep === 2) {
      generateSampleQuestions()
    }
    setCurrentStep((prev) => Math.min(4, prev + 1))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const totalDistributedQuestions = Object.values(quizData.questionDistribution).reduce(
    (sum, config) => sum + config.count,
    0,
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button 
            onClick={()=>router.push('/admin-dashboard/quiz-management')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Create New Quiz</h1>
              <p className="text-gray-600">
                Step {currentStep} of 4:{" "}
                {currentStep === 1
                  ? "Basic Information"
                  : currentStep === 2
                    ? "Question Distribution & Topic Selection"
                    : currentStep === 3
                      ? "Question Review"
                      : "Post Configuration"}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step < currentStep
                      ? "bg-blue-600 text-white"
                      : step === currentStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-0.5 mx-2 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Step 1: Basic Quiz Information</h2>
              <p className="text-gray-600 mb-6">Enter the basic details for your quiz</p>

              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Quiz Details</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quiz Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={quizData.name}
                        onChange={(e) => setQuizData((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter quiz name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Number of Questions <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={quizData.totalQuestions}
                        onChange={(e) =>
                          setQuizData((prev) => ({ ...prev, totalQuestions: Number.parseInt(e.target.value) || 0 }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Subjects <span className="text-red-500">*</span> (Multiple Selection)
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown("subjects")}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <div className="flex flex-wrap gap-1">
                            {quizData.subjects.map((subject) => (
                              <span
                                key={subject}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                              >
                                {subject}
                                <X
                                  className="w-3 h-3 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleSubject(subject)
                                  }}
                                />
                              </span>
                            ))}
                            {quizData.subjects.length === 0 && <span className="text-gray-500">Select subjects</span>}
                          </div>
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {dropdownStates.subjects && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            {subjects.map((subject) => (
                              <div
                                key={subject}
                                onClick={() => toggleSubject(subject)}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                                  quizData.subjects.includes(subject) ? "bg-blue-50 text-blue-700" : ""
                                }`}
                              >
                                {subject}
                                {quizData.subjects.includes(subject) && <Check className="w-4 h-4" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (Optional)</label>
                      <textarea
                        value={quizData.instructions}
                        onChange={(e) => setQuizData((prev) => ({ ...prev, instructions: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter instructions for students (e.g., 'Read all questions carefully...', 'No negative marking...', etc.)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Question Distribution */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Step 2: Question Distribution & Topic Selection</h2>
              <p className="text-gray-600 mb-6">Distribute questions across subjects and select topics & modules</p>

              <div className="space-y-6">
                {quizData.subjects.map((subject) => (
                  <div key={subject} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{subject}</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuestionCount(subject, false)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {quizData.questionDistribution[subject]?.count || 0}
                        </span>
                        <button
                          onClick={() => updateQuestionCount(subject, true)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Topics <span className="text-red-500">*</span> (Multiple Selection)
                        </label>
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(`topics-${subject}`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <span className="text-gray-500">Select topics for {subject}</span>
                            <ChevronDown className="w-4 h-4" />
                          </button>

                          {dropdownStates[`topics-${subject}`] && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                              {(topicsBySubject[subject as keyof typeof topicsBySubject] || []).map((topic) => (
                                <div
                                  key={topic}
                                  onClick={() => toggleTopic(subject, topic)}
                                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                                    quizData.questionDistribution[subject]?.topics.includes(topic)
                                      ? "bg-blue-50 text-blue-700"
                                      : ""
                                  }`}
                                >
                                  {topic}
                                  {quizData.questionDistribution[subject]?.topics.includes(topic) && (
                                    <Check className="w-4 h-4" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Selected Topics */}
                        {quizData.questionDistribution[subject]?.topics.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {quizData.questionDistribution[subject].topics.map((topic) => (
                              <span
                                key={topic}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                              >
                                {topic}
                                <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTopic(subject, topic)} />
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Modules for selected topics */}
                      {quizData.questionDistribution[subject]?.topics.some(
                        (topic) => modulesByTopic[topic as keyof typeof modulesByTopic],
                      ) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Modules <span className="text-red-500">*</span> (Multiple Selection)
                          </label>
                          <div className="space-y-2">
                            {quizData.questionDistribution[subject]?.topics.map((topic) => {
                              const modules = modulesByTopic[topic as keyof typeof modulesByTopic]
                              if (!modules) return null

                              return (
                                <div key={topic} className="border rounded p-3">
                                  <h4 className="font-medium text-sm mb-2">{topic}</h4>
                                  <div className="space-y-1">
                                    {modules.map((module) => (
                                      <div
                                        key={module}
                                        onClick={() => toggleModule(subject, module)}
                                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between rounded ${
                                          quizData.questionDistribution[subject]?.modules.includes(module)
                                            ? "bg-blue-50 text-blue-700"
                                            : ""
                                        }`}
                                      >
                                        {module}
                                        {quizData.questionDistribution[subject]?.modules.includes(module) && (
                                          <Check className="w-4 h-4" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {/* Selected Modules */}
                          {quizData.questionDistribution[subject]?.modules.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {quizData.questionDistribution[subject].modules.map((module) => (
                                <span
                                  key={module}
                                  className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                                >
                                  {module}
                                  <X className="w-3 h-3 cursor-pointer" onClick={() => toggleModule(subject, module)} />
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Total Questions:</span>
                  <span className="font-medium">
                    {totalDistributedQuestions} / {quizData.totalQuestions}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Question Review */}
          {currentStep === 3 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Step 3: Question Review</h2>
                  <p className="text-gray-600">Review and replace questions as needed</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <RotateCcw className="w-4 h-4" />
                  Replace All Questions
                </button>
              </div>

              <div className="space-y-6">
                {quizData.questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">Question {index + 1}</h3>
                        <p className="text-sm text-gray-600">
                          {question.subject} • {question.topic} • {question.module}
                        </p>
                      </div>
                      <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                        <RotateCcw className="w-4 h-4" />
                        Replace
                      </button>
                    </div>

                    <div className="mb-4">
                      <p className="font-medium">{question.question}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {question.options.map((option) => (
                        <div
                          key={option.label}
                          className={`p-3 rounded border ${
                            option.isCorrect ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <span className="font-medium">{option.label}. </span>
                          {option.text}
                          {option.isCorrect && <span className="text-green-600 text-sm"> - Correct answer</span>}
                          {!option.isCorrect && <span className="text-gray-500 text-sm"> - Incorrect</span>}
                        </div>
                      ))}
                    </div>

                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Explanation:</span> {question.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Post Configuration */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Step 4: Post Quiz Configuration</h2>
              <p className="text-gray-600 mb-6">
                Configure quiz settings, scheduling, and student notifications for your quiz.
              </p>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Basic Information</h3>
                  <p className="text-sm text-gray-600 mb-4">Configure the basic quiz details and target audience</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Name</label>
                      <input
                        type="text"
                        value={quizData.name}
                        onChange={(e) => setQuizData((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Course <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={quizData.course}
                        onChange={(e) => setQuizData((prev) => ({ ...prev, course: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Course</option>
                        <option value="MBBS">MBBS</option>
                        <option value="BDS">BDS</option>
                        <option value="NEET">NEET</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={quizData.batch}
                        onChange={(e) => setQuizData((prev) => ({ ...prev, batch: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Batch</option>
                        <option value="2022">2022</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phase/Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={quizData.phase}
                      onChange={(e) => setQuizData((prev) => ({ ...prev, phase: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Phase/Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                {/* Scoring & Duration */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Scoring & Duration</h3>
                  <p className="text-sm text-gray-600 mb-4">Configure marks distribution and test duration</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marks Per Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={quizData.marksPerQuestion}
                        onChange={(e) =>
                          setQuizData((prev) => ({ ...prev, marksPerQuestion: Number.parseInt(e.target.value) || 0 }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Negative Marks Per Question <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={quizData.negativeMarks}
                        onChange={(e) =>
                          setQuizData((prev) => ({ ...prev, negativeMarks: Number.parseInt(e.target.value) || 0 }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Duration (Minutes) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={quizData.duration}
                        onChange={(e) =>
                          setQuizData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 0 }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Schedule</h3>
                  <p className="text-sm text-gray-600 mb-4">Set the quiz availability window</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date & Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={quizData.startDate}
                          onChange={(e) => setQuizData((prev) => ({ ...prev, startDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date & Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={quizData.endDate}
                          onChange={(e) => setQuizData((prev) => ({ ...prev, endDate: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quiz Settings */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-4">Quiz Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">Configure quiz behavior and student experience</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Order</label>
                      <select
                        value={quizData.questionOrder}
                        onChange={(e) => setQuizData((prev) => ({ ...prev, questionOrder: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Random Order">Random Order</option>
                        <option value="Sequential Order">Sequential Order</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notify Students</label>
                      <select
                        value={quizData.notifyStudents}
                        onChange={(e) => setQuizData((prev) => ({ ...prev, notifyStudents: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Notify before test only">Notify before test only</option>
                        <option value="Notify before and after test">Notify before and after test</option>
                        <option value="No notifications">No notifications</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={quizData.allowReview}
                        onChange={(e) => setQuizData((prev) => ({ ...prev, allowReview: e.target.checked }))}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Allow students to review answers</span>
                    </label>
                    <p className="text-sm text-gray-500 ml-6">
                      Students can see correct answers after the exam end date and time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Save Draft</button>

              {currentStep === 4 && (
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 mr-2">Cancel</button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Post Quiz</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
