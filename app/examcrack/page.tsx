"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Layers, 
  Award, 
  Activity, 
  Settings as SettingsIcon, 
  Upload, 
  Flame, 
  Plus, 
  Trash2, 
  Sparkles, 
  Clock, 
  Brain, 
  FileText, 
  LayoutDashboard, 
  Play, 
  Check, 
  HelpCircle, 
  X, 
  ChevronRight, 
  AlertTriangle,
  FolderOpen,
  CheckCircle2,
  Lock,
  Moon,
  Sun,
  BookOpenCheck
} from "lucide-react"

import { 
  getAll, 
  getById, 
  put, 
  deleteById, 
  clearAll,
  Semester, 
  Subject, 
  SyllabusUnit, 
  StudyMaterial, 
  PYQAnalysis, 
  StudyTask, 
  Flashcard, 
  Quiz, 
  GameStats 
} from "@/lib/examcrack/db"

import { 
  aiParseDatesheet, 
  aiParseSyllabus, 
  aiAnalyzePYQ, 
  aiGenerateFlashcards, 
  aiGenerateQuiz, 
  aiGenerateExamNightMode 
} from "@/lib/examcrack/ai-client"

export default function ExamcrackOS() {
  // DB State
  const [loading, setLoading] = useState(true)
  const [semester, setSemester] = useState<Semester | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [syllabus, setSyllabus] = useState<SyllabusUnit[]>([])
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [pyqAnalysis, setPyqAnalysis] = useState<PYQAnalysis[]>([])
  const [tasks, setTasks] = useState<StudyTask[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [stats, setStats] = useState<GameStats>({
    id: "stats",
    xp: 0,
    streak: 0,
    level: 1,
    lastActive: "",
    achievements: []
  })

  // Onboarding Wizard State
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [obSemesterName, setObSemesterName] = useState("")
  const [obDatesheetText, setObDatesheetText] = useState("")
  const [obParsing, setObParsing] = useState(false)
  const [obParsedExams, setObParsedExams] = useState<{ name: string; examDate: string; examTime: string }[]>([])
  const [obDifficulties, setObDifficulties] = useState<Record<string, "Easy" | "Medium" | "Hard">>({})
  
  // UI States
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar" | "subjects" | "tasks" | "flashcards" | "quizzes" | "progress" | "resources" | "settings">("dashboard")
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [isExamNightMode, setIsExamNightMode] = useState(false)
  const [nightModeData, setNightModeData] = useState<{
    definitions: string[];
    formulas: string[];
    criticalTopics: string[];
    revisionSummary: string;
  } | null>(null)
  const [nightTimer, setNightTimer] = useState(1800) // 30 mins
  const [nightTimerActive, setNightTimerActive] = useState(false)

  // Subject Workspace Tabs
  const [subjectSubTab, setSubjectSubTab] = useState<"syllabus" | "materials" | "roadmap" | "pyqs" | "flashcards" | "quizzes" | "night">("syllabus")
  const [customSyllabusText, setCustomSyllabusText] = useState("")
  const [parsingSyllabus, setParsingSyllabus] = useState(false)
  
  // Quiz states
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [quizReview, setQuizReview] = useState(false)

  // Flashcards Study states
  const [studyCards, setStudyCards] = useState<Flashcard[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [showCardAnswer, setShowCardAnswer] = useState(false)

  // Timer Ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load database content on mount
  useEffect(() => {
    async function loadDB() {
      try {
        const semesters = await getAll<Semester>("semester")
        if (semesters.length > 0) {
          setSemester(semesters[0])
        }

        const subjectsList = await getAll<Subject>("subjects")
        setSubjects(subjectsList)

        const syllabusList = await getAll<SyllabusUnit>("syllabus")
        setSyllabus(syllabusList)

        const materialsList = await getAll<StudyMaterial>("materials")
        setMaterials(materialsList)

        const pyqsList = await getAll<PYQAnalysis>("pyqs")
        setPyqAnalysis(pyqsList)

        const tasksList = await getAll<StudyTask>("tasks")
        setTasks(tasksList)

        const flashcardsList = await getAll<Flashcard>("flashcards")
        setFlashcards(flashcardsList)

        const quizzesList = await getAll<Quiz>("quizzes")
        setQuizzes(quizzesList)

        const gameStats = await getById<GameStats>("gamestats", "stats")
        if (gameStats) {
          setStats(gameStats)
        } else {
          const initialStats: GameStats = {
            id: "stats",
            xp: 0,
            streak: 1,
            level: 1,
            lastActive: new Date().toISOString().split("T")[0],
            achievements: ["welcome"]
          }
          await put("gamestats", initialStats)
          setStats(initialStats)
        }
      } catch (err) {
        console.error("Failed to load IndexedDB data", err)
      } finally {
        setLoading(false)
      }
    }
    loadDB()
  }, [])

  // Exam Night Timer countdown
  useEffect(() => {
    if (nightTimerActive && nightTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setNightTimer((prev) => prev - 1)
      }, 1000)
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [nightTimerActive, nightTimer])

  // Helper functions
  const awardXP = async (amount: number) => {
    const newXP = stats.xp + amount
    const newLevel = Math.floor(newXP / 1000) + 1
    const newStats = {
      ...stats,
      xp: newXP,
      level: newLevel
    }
    await put("gamestats", newStats)
    setStats(newStats)
  }

  // 1. Create Semester Onboarding step
  const handleCreateSemester = () => {
    if (!obSemesterName.trim()) return
    setOnboardingStep(2)
  }

  // 2. Parse Datesheet Onboarding step
  const handleParseDatesheet = async () => {
    setObParsing(true)
    try {
      const parsed = await aiParseDatesheet(obDatesheetText)
      setObParsedExams(parsed)
      // Set initial difficulties
      const diffs: Record<string, "Easy" | "Medium" | "Hard"> = {}
      parsed.forEach(s => {
        diffs[s.name] = "Medium"
      })
      setObDifficulties(diffs)
      setOnboardingStep(3)
    } catch (e) {
      console.error(e)
    } finally {
      setObParsing(false)
    }
  }

  // 3. Confirm Exams Calendar & proceed to prioritization
  const handleConfirmExams = () => {
    setOnboardingStep(4)
  }

  // 4. Priorities and finish onboarding
  const handleFinishOnboarding = async () => {
    setLoading(true)
    try {
      const semesterId = "semester_current"
      const semObj: Semester = {
        id: semesterId,
        name: obSemesterName,
        created_at: new Date().toISOString()
      }
      await put("semester", semObj)
      setSemester(semObj)

      // Color palette for items
      const colors = [
        "bg-blue-50 border-blue-200 text-blue-800",
        "bg-emerald-50 border-emerald-200 text-emerald-800",
        "bg-purple-50 border-purple-200 text-purple-800",
        "bg-amber-50 border-amber-200 text-amber-800",
        "bg-rose-50 border-rose-200 text-rose-800"
      ]

      // Save subjects
      const subjectsSaved: Subject[] = []
      for (let i = 0; i < obParsedExams.length; i++) {
        const item = obParsedExams[i]
        const diff = obDifficulties[item.name] || "Medium"
        const subId = `subject_${i}`
        
        // Calculate days remaining
        const examD = new Date(item.examDate)
        const today = new Date()
        const diffTime = examD.getTime() - today.getTime()
        const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

        const subObj: Subject = {
          id: subId,
          name: item.name,
          difficulty: diff,
          color: colors[i % colors.length],
          examDate: item.examDate,
          examTime: item.examTime,
          daysRemaining,
          preparedness: 0,
          confidence: 50
        }
        await put("subjects", subObj)
        subjectsSaved.push(subObj)

        // Add dummy syllabus placeholder
        const syllabusUnit: SyllabusUnit = {
          id: `syllabus_unit_${subId}_1`,
          subjectId: subId,
          name: "Unit 1: Introduction",
          topics: [
            { id: `${subId}_t1`, name: `Overview of ${item.name}`, completed: false, difficulty: diff, priority: "High" },
            { id: `${subId}_t2`, name: "Foundational Theories & Formulas", completed: false, difficulty: "Medium", priority: "Medium" }
          ]
        }
        await put("syllabus", syllabusUnit)

        // Add tasks
        const task1: StudyTask = {
          id: `task_${subId}_1`,
          subjectId: subId,
          title: `Study Overview of ${item.name}`,
          completed: false,
          dueDate: item.examDate,
          type: "Read",
          xpReward: 100
        }
        const task2: StudyTask = {
          id: `task_${subId}_2`,
          subjectId: subId,
          title: `Attempt Practice Quiz for ${item.name}`,
          completed: false,
          dueDate: item.examDate,
          type: "Quiz",
          xpReward: 150
        }
        await put("tasks", task1)
        await put("tasks", task2)
      }

      setSubjects(subjectsSaved)
      
      const syllabusList = await getAll<SyllabusUnit>("syllabus")
      setSyllabus(syllabusList)

      const tasksList = await getAll<StudyTask>("tasks")
      setTasks(tasksList)

      // Award Initial XP
      await awardXP(500)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Handle Syllabus upload & parse
  const handleParseSyllabus = async () => {
    if (!selectedSubjectId || !customSyllabusText.trim()) return
    setParsingSyllabus(true)
    try {
      const parsedUnits = await aiParseSyllabus(
        subjects.find(s => s.id === selectedSubjectId)?.name || "Subject",
        customSyllabusText
      )
      
      // Save units to DB
      for (let i = 0; i < parsedUnits.length; i++) {
        const u = parsedUnits[i]
        const unitId = `syllabus_unit_${selectedSubjectId}_${Date.now()}_${i}`
        const topics = u.topics.map((t, tIndex) => ({
          id: `topic_${selectedSubjectId}_${Date.now()}_${i}_${tIndex}`,
          name: t.name,
          completed: false,
          difficulty: t.difficulty,
          priority: t.priority
        }))

        const unitObj: SyllabusUnit = {
          id: unitId,
          subjectId: selectedSubjectId,
          name: u.name,
          topics
        }
        await put("syllabus", unitObj)

        // Generate tasks automatically from new syllabus topics
        topics.forEach(async (topic, index) => {
          const taskObj: StudyTask = {
            id: `task_topic_${topic.id}`,
            subjectId: selectedSubjectId,
            title: `Learn: ${topic.name}`,
            completed: false,
            dueDate: subjects.find(s => s.id === selectedSubjectId)?.examDate || new Date().toISOString().split("T")[0],
            type: "Read",
            xpReward: topic.priority === "High" ? 150 : 100
          }
          await put("tasks", taskObj)
        })
      }

      // Reload syllabus & tasks
      const syllabusList = await getAll<SyllabusUnit>("syllabus")
      setSyllabus(syllabusList)
      const tasksList = await getAll<StudyTask>("tasks")
      setTasks(tasksList)
      setCustomSyllabusText("")
      await awardXP(200)
    } catch (e) {
      console.error(e)
    } finally {
      setParsingSyllabus(false)
    }
  }

  // Toggle Syllabus Topic Completion
  const toggleTopicCompletion = async (unitId: string, topicId: string) => {
    const unit = syllabus.find(u => u.id === unitId)
    if (!unit) return

    const updatedTopics = unit.topics.map(t => {
      if (t.id === topicId) {
        const nextState = !t.completed
        if (nextState) awardXP(50) // 50 XP per topic completed
        return { ...t, completed: nextState }
      }
      return t
    })

    const updatedUnit = { ...unit, topics: updatedTopics }
    await put("syllabus", updatedUnit)

    // Reload syllabus
    const syllabusList = await getAll<SyllabusUnit>("syllabus")
    setSyllabus(syllabusList)

    // Update subject preparedness completion %
    if (selectedSubjectId) {
      const subjectUnits = syllabusList.filter(u => u.subjectId === selectedSubjectId)
      const totalTopics = subjectUnits.reduce((acc, u) => acc + u.topics.length, 0)
      const completedTopics = subjectUnits.reduce((acc, u) => acc + u.topics.filter(t => t.completed).length, 0)
      const preparedness = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0
      
      const subject = subjects.find(s => s.id === selectedSubjectId)
      if (subject) {
        const updatedSub = { ...subject, preparedness }
        await put("subjects", updatedSub)
        setSubjects(subjects.map(s => s.id === selectedSubjectId ? updatedSub : s))
      }
    }
  }

  // Add Study Material file manually (base64 mock helper)
  const handleUploadMaterial = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (!selectedSubjectId || !e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    const reader = new FileReader()
    reader.onload = async () => {
      const base64Data = reader.result as string
      const materialObj: StudyMaterial = {
        id: `material_${Date.now()}`,
        subjectId: selectedSubjectId,
        name: file.name,
        type,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        fileData: base64Data,
        uploadedAt: new Date().toISOString().split("T")[0]
      }
      await put("materials", materialObj)
      setMaterials([...materials, materialObj])
      await awardXP(100)
    }
    reader.readAsDataURL(file)
  }

  // PYQ Analyzer (simulate uploads and generate expect questions)
  const handleUploadPYQ = async (e: React.ChangeEvent<HTMLInputElement>, year: string) => {
    if (!selectedSubjectId || !e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    
    const reader = new FileReader()
    reader.onload = async () => {
      const base64Data = reader.result as string
      
      // Perform mock AI analysis
      const subjectName = subjects.find(s => s.id === selectedSubjectId)?.name || "Subject"
      const analysis = await aiAnalyzePYQ(subjectName, `Mock text extracted from PYQ year ${year} named ${file.name}`)
      
      const pyqObj: PYQAnalysis = {
        id: `pyq_${selectedSubjectId}_${year}`,
        subjectId: selectedSubjectId,
        year,
        fileName: file.name,
        fileData: base64Data,
        repeatedQuestions: analysis.repeatedQuestions,
        repeatedConcepts: analysis.repeatedConcepts,
        expectedQuestions: analysis.expectedQuestions
      }

      await put("pyqs", pyqObj)
      
      // Reload pyq list
      const pyqsList = await getAll<PYQAnalysis>("pyqs")
      setPyqAnalysis(pyqsList)
      await awardXP(200)
    }
    reader.readAsDataURL(file)
  }

  // Toggle study task completed
  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const updatedTask = { ...task, completed: !task.completed }
    await put("tasks", updatedTask)
    setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
    
    if (updatedTask.completed) {
      await awardXP(task.xpReward)
    } else {
      await awardXP(-task.xpReward)
    }
  }

  // Start a Quiz
  const startQuiz = async (subjectId: string) => {
    const subName = subjects.find(s => s.id === subjectId)?.name || "Subject"
    const parsedQuestions = await aiGenerateQuiz(subName, "Core units and syllabus concepts")
    const newQuiz: Quiz = {
      id: `quiz_${subjectId}_${Date.now()}`,
      subjectId,
      title: `${subName} Prep Quiz`,
      questions: parsedQuestions.map((q, idx) => ({
        id: `q_${idx}`,
        ...q
      }))
    }
    
    await put("quizzes", newQuiz)
    setQuizzes([...quizzes, newQuiz])
    setCurrentQuiz(newQuiz)
    setQuizAnswers({})
    setQuizScore(null)
    setQuizReview(false)
  }

  // Submit Quiz Answers
  const submitQuiz = () => {
    if (!currentQuiz) return
    let score = 0
    currentQuiz.questions.forEach(q => {
      if (q.type === "mcq") {
        if (quizAnswers[q.id] === q.correctAnswer) {
          score += 1
        }
      } else {
        // Simple mock score checking for short answers
        score += 1
      }
    })

    const finalScore = Math.round((score / currentQuiz.questions.length) * 100)
    setQuizScore(finalScore)
    setQuizReview(true)
    awardXP(finalScore * 2) // XP Reward = percentage * 2
  }

  // Start Spaced Repetition Flashcards Review Session
  const startFlashcardSession = async (subjectId: string) => {
    let cards = flashcards.filter(c => c.subjectId === subjectId)
    if (cards.length === 0) {
      // Generate initial cards automatically
      const subName = subjects.find(s => s.id === subjectId)?.name || "Subject"
      const generated = await aiGenerateFlashcards(subName, "Unit syllabus key concepts")
      
      const newCards: Flashcard[] = []
      for (let i = 0; i < generated.length; i++) {
        const cardObj: Flashcard = {
          id: `card_${subjectId}_${Date.now()}_${i}`,
          subjectId,
          question: generated[i].question,
          answer: generated[i].answer,
          difficulty: generated[i].difficulty,
          bookmarked: false,
          box: 1,
          nextReviewDate: new Date().toISOString()
        }
        await put("flashcards", cardObj)
        newCards.push(cardObj)
      }
      setFlashcards([...flashcards, ...newCards])
      cards = newCards
    }

    setStudyCards(cards)
    setCardIndex(0)
    setShowCardAnswer(false)
  }

  // Spaced Repetition Rate/Feedback (Leitner system)
  const handleCardFeedback = async (correct: boolean) => {
    const card = studyCards[cardIndex]
    if (!card) return

    let nextBox = card.box
    if (correct) {
      nextBox = Math.min(5, card.box + 1)
      await awardXP(30)
    } else {
      nextBox = 1 // reset on error
    }

    // Schedule next review date based on box number
    // Box 1: 1 day, Box 2: 3 days, Box 3: 7 days, Box 4: 14 days, Box 5: 30 days
    const days = [1, 3, 7, 14, 30][nextBox - 1]
    const reviewDate = new Date()
    reviewDate.setDate(reviewDate.getDate() + days)

    const updatedCard = {
      ...card,
      box: nextBox,
      nextReviewDate: reviewDate.toISOString()
    }

    await put("flashcards", updatedCard)
    
    // Refresh card lists
    const flashcardsList = await getAll<Flashcard>("flashcards")
    setFlashcards(flashcardsList)
    setStudyCards(studyCards.map((c, idx) => idx === cardIndex ? updatedCard : c))

    // Next Card
    if (cardIndex < studyCards.length - 1) {
      setCardIndex(cardIndex + 1)
      setShowCardAnswer(false)
    } else {
      // Session finished
      alert(`Flashcard study session complete! You studied ${studyCards.length} cards.`)
      setStudyCards([])
    }
  }

  // Toggle Bookmark Flashcard
  const toggleBookmarkCard = async (cardId: string) => {
    const card = flashcards.find(c => c.id === cardId)
    if (!card) return
    const updated = { ...card, bookmarked: !card.bookmarked }
    await put("flashcards", updated)
    setFlashcards(flashcards.map(c => c.id === cardId ? updated : c))
    setStudyCards(studyCards.map(c => c.id === cardId ? updated : c))
  }

  // Exam Night Mode Activation
  const startExamNightMode = async (subjectId: string) => {
    const sub = subjects.find(s => s.id === subjectId)
    if (!sub) return
    
    setIsExamNightMode(true)
    setNightTimer(1800)
    setNightTimerActive(true)

    // Load AI Night mode summaries
    const subSyllabus = syllabus.filter(u => u.subjectId === subjectId)
    const syllabusText = subSyllabus.map(u => `${u.name}: ${u.topics.map(t => t.name).join(", ")}`).join("\n")
    const emergencyPrep = await aiGenerateExamNightMode(sub.name, syllabusText)
    setNightModeData(emergencyPrep)
  }

  // Reset Application Data
  const handleResetData = async () => {
    if (confirm("Are you sure you want to reset all Semester details and start over? This deletes all local data.")) {
      await clearAll("semester")
      await clearAll("subjects")
      await clearAll("syllabus")
      await clearAll("materials")
      await clearAll("pyqs")
      await clearAll("tasks")
      await clearAll("flashcards")
      await clearAll("quizzes")
      await clearAll("gamestats")

      setSemester(null)
      setSubjects([])
      setSyllabus([])
      setMaterials([])
      setPyqAnalysis([])
      setTasks([])
      setFlashcards([])
      setQuizzes([])
      setStats({
        id: "stats",
        xp: 0,
        streak: 1,
        level: 1,
        lastActive: new Date().toISOString().split("T")[0],
        achievements: ["welcome"]
      })
      setOnboardingStep(1)
      setSelectedSubjectId(null)
    }
  }

  // Loading indicator
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-gray-500 font-medium select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
          <span>Syncing academic workspace...</span>
        </div>
      </div>
    )
  }

  // ONBOARDING SCREEN
  if (!semester) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-gray-900 font-sans">
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl w-full max-w-2xl p-8 space-y-6 transition-all">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 select-none">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-950 flex items-center justify-center text-white font-bold text-lg shadow-sm">EC</div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Examcrack OS</h1>
                <p className="text-xs text-gray-400 font-medium">Academic Study Operating System</p>
              </div>
            </div>
            <Link href="/">
              <img
                src="/ul0.png"
                alt="ul0 Logo"
                className="h-7 w-auto object-contain hover:opacity-85 transition-opacity"
              />
            </Link>
          </div>

          {onboardingStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block select-none">Step 1 of 4</span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-950">Initialize Semester</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Start setting up your dashboard by defining the active academic cycle.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase select-none">Semester Name</label>
                <input 
                  type="text" 
                  value={obSemesterName} 
                  onChange={(e) => setObSemesterName(e.target.value)}
                  placeholder="e.g. Semester 5, Semester 6, Fall 2026"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-950 bg-gray-50/50"
                />
              </div>

              <button 
                onClick={handleCreateSemester}
                disabled={!obSemesterName.trim()}
                className="w-full bg-gray-950 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                Create Semester <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {onboardingStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block select-none">Step 2 of 4</span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-950">Import Exam Datesheet</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Upload datesheet text, image details, or type exam slots. The AI will extract dates, times, and structures automatically.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase select-none">Paste Datesheet Text / Raw Contents</label>
                <textarea 
                  value={obDatesheetText} 
                  onChange={(e) => setObDatesheetText(e.target.value)}
                  placeholder="e.g.&#10;June 10: Design and Analysis of Algorithms - 10:00 AM&#10;June 14: Operating Systems - 10:00 AM&#10;June 18: Computer Networks - 02:00 PM"
                  rows={6}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-950 bg-gray-50/50 font-mono resize-none"
                />
              </div>

              <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer select-none relative">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-semibold text-gray-800">Upload Datesheet PDF or Image</span>
                <span className="text-[10px] text-gray-400">Drag files here or browse. Files stay entirely local in IndexedDB</span>
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0]
                      setObDatesheetText(`Mock date list extracted from uploaded file ${file.name}:\nJune 10: DAA\nJune 14: Operating Systems\nJune 18: Computer Networks\nJune 21: Machine Learning`)
                    }
                  }}
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setOnboardingStep(1)}
                  className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleParseDatesheet}
                  disabled={!obDatesheetText.trim() || obParsing}
                  className="flex-1 bg-gray-950 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {obParsing ? "AI Extracting..." : "AI Parse Datesheet"} <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block select-none">Step 3 of 4</span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-950">Confirm Exam Schedule</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Review the dates extracted by the AI. You can customize datesheet scheduling or proceed to priority settings.
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-xs select-none">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {obParsedExams.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...obParsedExams]
                              updated[index].name = e.target.value
                              setObParsedExams(updated)
                            }}
                            className="bg-transparent border-0 focus:ring-0 focus:outline-none font-semibold text-gray-950 w-full"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="date" 
                            value={item.examDate}
                            onChange={(e) => {
                              const updated = [...obParsedExams]
                              updated[index].examDate = e.target.value
                              setObParsedExams(updated)
                            }}
                            className="bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-500 w-full font-mono"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input 
                            type="text" 
                            value={item.examTime}
                            onChange={(e) => {
                              const updated = [...obParsedExams]
                              updated[index].examTime = e.target.value
                              setObParsedExams(updated)
                            }}
                            className="bg-transparent border-0 focus:ring-0 focus:outline-none text-gray-500 w-full"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setOnboardingStep(2)}
                  className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleConfirmExams}
                  className="flex-1 bg-gray-950 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Confirm Calendar
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block select-none">Step 4 of 4</span>
                <h2 className="text-2xl font-bold tracking-tight text-gray-950">Subject Prioritization</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Help the AI gauge subject preparedness by rating the initial difficulty level of each subject.
                </p>
              </div>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                {obParsedExams.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-gray-50/30">
                    <span className="font-semibold text-sm text-gray-900 truncate max-w-xs">{item.name}</span>
                    <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
                      {["Easy", "Medium", "Hard"].map((d) => (
                        <button
                          key={d}
                          onClick={() => {
                            setObDifficulties({
                              ...obDifficulties,
                              [item.name]: d as any
                            })
                          }}
                          className={`text-xs px-3 py-1.5 font-semibold rounded-md transition-colors select-none ${
                            obDifficulties[item.name] === d 
                              ? "bg-white text-gray-900 shadow-xs" 
                              : "text-gray-400 hover:text-gray-700"
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setOnboardingStep(3)}
                  className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleFinishOnboarding}
                  className="flex-1 bg-gray-950 text-white rounded-xl py-3 text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Initialize System <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // MAIN CORE DASHBOARD SHELL
  return (
    <div className="min-h-screen bg-[#fafafa] flex text-gray-900 font-sans antialiased">
      {/* PERSISTENT LEFT SIDEBAR */}
      <aside className="w-60 border-r border-gray-200 bg-white flex flex-col justify-between shrink-0 select-none">
        <div className="p-5 space-y-5">
          {/* Main ul0 Branding Link */}
          <div className="pb-3 border-b border-gray-100">
            <Link href="/" className="flex items-center">
              <img
                src="/ul0.png"
                alt="ul0 Logo"
                className="h-7 w-auto object-contain hover:opacity-85 transition-opacity"
              />
            </Link>
          </div>

          {/* Header info */}
          <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center text-white font-bold text-sm shadow-sm">EC</div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-gray-950 truncate max-w-[130px]">{semester.name}</h2>
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block leading-none">Student OS</span>
            </div>
          </div>

          {/* Gamification Level widget */}
          <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Level {stats.level} Scholar</span>
              <div className="flex items-center gap-1 font-bold text-xs text-amber-600">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {stats.streak} Streak
              </div>
            </div>
            <div className="space-y-1">
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gray-950 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(stats.xp % 1000) / 10}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-semibold text-gray-400 uppercase">
                <span>{stats.xp % 1000} / 1000 XP</span>
                <span>Next Lvl</span>
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "calendar", label: "Calendar", icon: CalendarIcon },
              { id: "subjects", label: "Subjects", icon: BookOpen },
              { id: "tasks", label: "Tasks", icon: CheckSquare },
              { id: "flashcards", label: "Flashcards", icon: Brain },
              { id: "quizzes", label: "Quizzes", icon: BookOpenCheck },
              { id: "progress", label: "Progress", icon: Activity },
              { id: "resources", label: "Resources", icon: FileText },
              { id: "settings", label: "Settings", icon: SettingsIcon },
            ].map((link) => {
              const Icon = link.icon
              const isActive = activeTab === link.id && !selectedSubjectId
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setSelectedSubjectId(null)
                    setActiveTab(link.id as any)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors select-none ${
                    isActive 
                      ? "bg-gray-50 border border-gray-200/50 text-gray-950 font-bold" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-gray-950" : "text-gray-400"}`} />
                  {link.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Subjects in sidebar */}
        <div className="p-5 border-t border-gray-100 flex flex-col justify-end space-y-4 overflow-hidden">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Workspaces</span>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id)
                    setSubjectSubTab("syllabus")
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-md truncate transition-colors select-none ${
                    selectedSubjectId === sub.id 
                      ? "bg-gray-50 border border-gray-150 text-gray-950 font-semibold" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50/50"
                  }`}
                >
                  <span className="truncate max-w-[130px] flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${sub.color.split(" ")[0]}`} />
                    {sub.name}
                  </span>
                  {sub.preparedness !== undefined && (
                    <span className="text-[10px] text-gray-400 font-semibold">{sub.preparedness}%</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-[9px] text-gray-400 font-bold uppercase select-none">Examcrack OS v1.0</span>
            <button 
              onClick={handleResetData}
              className="text-[9px] text-rose-500 hover:underline font-bold uppercase select-none"
            >
              Reset OS
            </button>
          </div>
        </div>
      </aside>

      {/* DYNAMIC CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* SUBJECT WORKSPACE HEADER & DETAILS */}
        {selectedSubjectId ? (
          (() => {
            const subject = subjects.find(s => s.id === selectedSubjectId)
            if (!subject) return null

            const nextExam = subject.examDate ? new Date(subject.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBA"

            return (
              <div className="flex-1 flex flex-col">
                {/* Header panel */}
                <header className="bg-white border-b border-gray-200 px-8 py-6 space-y-4 shrink-0">
                  <div className="flex items-center justify-between">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 select-none">
                      <span className="hover:text-gray-600 cursor-pointer" onClick={() => setSelectedSubjectId(null)}>Subjects</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                      <span className="text-gray-800 font-bold">{subject.name}</span>
                    </div>

                    {/* Quick actions */}
                    <button 
                      onClick={() => startExamNightMode(subject.id)}
                      className="bg-gray-950 text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Moon className="w-3.5 h-3.5" /> Exam Tomorrow
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-lg font-bold ${subject.color}`}>
                      {subject.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight text-gray-950">{subject.name}</h1>
                      <p className="text-xs text-gray-400 font-medium">Difficulty Level: <strong className="text-gray-800">{subject.difficulty || "Medium"}</strong></p>
                    </div>
                  </div>

                  {/* Properties bar (Notion style) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 border border-gray-150 rounded-xl p-4 text-xs font-medium">
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-semibold uppercase text-[9px] select-none">Exam Date</span>
                      <span className="text-gray-900 font-bold flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                        {nextExam} ({subject.examTime || "TBA"})
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-semibold uppercase text-[9px] select-none">Countdown</span>
                      <span className="text-gray-900 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {subject.daysRemaining !== undefined ? `${subject.daysRemaining} days left` : "N/A"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-semibold uppercase text-[9px] select-none">Preparedness</span>
                      <span className="text-gray-900 font-bold">
                        {subject.preparedness || 0}% Prepared
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 block font-semibold uppercase text-[9px] select-none">Confidence Level</span>
                      <div className="flex items-center gap-2">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={subject.confidence || 50} 
                          onChange={async (e) => {
                            const val = parseInt(e.target.value)
                            const updated = { ...subject, confidence: val }
                            await put("subjects", updated)
                            setSubjects(subjects.map(s => s.id === subject.id ? updated : s))
                          }}
                          className="w-16 accent-gray-900 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-gray-900 font-bold">{subject.confidence || 50}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Sub Workspace tabs selector */}
                  <div className="flex border-b border-gray-150 pt-2 gap-6 text-xs font-semibold text-gray-500 select-none">
                    {[
                      { id: "syllabus", label: "Syllabus Plan" },
                      { id: "roadmap", label: "Knowledge Roadmap" },
                      { id: "materials", label: "Study Materials" },
                      { id: "pyqs", label: "PYQ Analyzer" },
                      { id: "flashcards", label: "Flashcards" },
                      { id: "quizzes", label: "Practice Quizzes" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setSubjectSubTab(tab.id as any)
                          if (tab.id === "flashcards") startFlashcardSession(subject.id)
                          if (tab.id === "quizzes") setCurrentQuiz(null)
                        }}
                        className={`pb-3 relative transition-colors ${
                          subjectSubTab === tab.id 
                            ? "text-gray-950 font-bold border-b-2 border-gray-950" 
                            : "hover:text-gray-800"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </header>

                {/* Sub Tab View contents */}
                <div className="flex-1 p-8 overflow-y-auto bg-[#fafafa]">
                  {subjectSubTab === "syllabus" && (
                    <div className="space-y-8 max-w-3xl">
                      {/* Paste Syllabus input box */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm text-gray-950">Add / Parse Subject Syllabus</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Paste text syllabus guidelines. The AI will chunk guidelines into units and topics with prioritizations.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <textarea
                            value={customSyllabusText}
                            onChange={(e) => setCustomSyllabusText(e.target.value)}
                            placeholder="e.g.&#10;Unit 1: Asymptotic Notations (Big-O, Omega, Theta), recurrence relations, divide and conquer merge/quick sorting.&#10;Unit 2: Dynamic programming knapsack problems, longest common subsequences, TSP."
                            rows={4}
                            className="w-full border border-gray-200 rounded-lg p-3 text-xs focus:outline-none focus:border-gray-950 bg-gray-50/30 font-mono resize-none"
                          />
                          <button
                            onClick={handleParseSyllabus}
                            disabled={!customSyllabusText.trim() || parsingSyllabus}
                            className="bg-gray-950 text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                          >
                            {parsingSyllabus ? "AI Parsing..." : "AI Process Syllabus"} <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Display structured syllabus */}
                      <div className="space-y-6">
                        {syllabus.filter(u => u.subjectId === subject.id).length === 0 ? (
                          <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 select-none text-center bg-white">
                            <Layers className="w-6 h-6 text-gray-300" />
                            <span className="text-xs font-semibold text-gray-800">No structured syllabus topics found</span>
                            <span className="text-[10px] text-gray-400">Paste syllabus guidelines above to build units breakdown</span>
                          </div>
                        ) : (
                          syllabus
                            .filter(u => u.subjectId === subject.id)
                            .map((unit, unitIdx) => (
                              <div key={unit.id} className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                                <div className="bg-gray-50 border-b border-gray-150 px-5 py-3 flex items-center justify-between select-none">
                                  <h4 className="text-xs font-bold text-gray-900">{unit.name}</h4>
                                  <span className="text-[10px] font-semibold text-gray-400">
                                    {unit.topics.filter(t => t.completed).length} / {unit.topics.length} Done
                                  </span>
                                </div>
                                <div className="divide-y divide-gray-100">
                                  {unit.topics.map((topic) => (
                                    <div key={topic.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/30 transition-colors">
                                      <div className="flex items-center gap-3">
                                        <button 
                                          onClick={() => toggleTopicCompletion(unit.id, topic.id)}
                                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
                                            topic.completed 
                                              ? "bg-gray-900 border-gray-900 text-white" 
                                              : "border-gray-300 hover:border-gray-500"
                                          }`}
                                        >
                                          {topic.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </button>
                                        <span className={`text-xs font-medium ${topic.completed ? "line-through text-gray-400" : "text-gray-850"}`}>
                                          {topic.name}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2 select-none">
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                          topic.priority === "High" 
                                            ? "bg-rose-50 text-rose-700" 
                                            : topic.priority === "Medium"
                                            ? "bg-amber-50 text-amber-700"
                                            : "bg-gray-50 text-gray-600"
                                        }`}>
                                          {topic.priority} Priority
                                        </span>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                          topic.difficulty === "Hard" 
                                            ? "bg-red-50 text-red-700 border border-red-100" 
                                            : topic.difficulty === "Medium"
                                            ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                            : "bg-green-50 text-green-700 border border-green-100"
                                        }`}>
                                          {topic.difficulty}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  )}

                  {subjectSubTab === "roadmap" && (
                    <div className="space-y-6">
                      <div className="space-y-1 max-w-2xl select-none">
                        <h3 className="font-bold text-sm text-gray-950">AI Knowledge Roadmap</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          A visual, structured roadmap of topics in {subject.name}. Click topics to toggle completion status.
                        </p>
                      </div>

                      {/* SVG Knowledge Map Tree rendering */}
                      {(() => {
                        const units = syllabus.filter(u => u.subjectId === subject.id)
                        if (units.length === 0) {
                          return (
                            <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-center bg-white max-w-lg">
                              <Layers className="w-6 h-6 text-gray-300" />
                              <span className="text-xs font-semibold text-gray-800">Cannot generate roadmap yet</span>
                              <span className="text-[10px] text-gray-400">You must load syllabus units/topics in the first tab first.</span>
                            </div>
                          )
                        }

                        // Coordinates layouts
                        const boxWidth = 140
                        const boxHeight = 40
                        const colGap = 80
                        const rowGap = 30

                        const unitsCount = units.length
                        const totalTopics = units.reduce((acc, u) => acc + u.topics.length, 0)
                        
                        const svgWidth = 600
                        const svgHeight = Math.max(300, totalTopics * (boxHeight + rowGap))

                        let currentY = 10
                        const lines: JSX.Element[] = []
                        const nodes: JSX.Element[] = []

                        // Root subject node coordinate
                        const rootX = 20
                        const rootY = svgHeight / 2 - 20

                        units.forEach((unit, uIdx) => {
                          const unitX = rootX + boxWidth + colGap
                          
                          // Calculate vertical mid point of topics for this unit
                          const unitTopicsCount = unit.topics.length
                          const unitStartTargetY = currentY
                          
                          unit.topics.forEach((topic, tIdx) => {
                            const topicX = unitX + boxWidth + colGap
                            const topicY = currentY
                            
                            // Draw line from Unit -> Topic
                            const uMidY = unitStartTargetY + (unitTopicsCount * (boxHeight + rowGap)) / 2 - boxHeight/2 - rowGap/2
                            
                            lines.push(
                              <path 
                                key={`line_t_${topic.id}`}
                                d={`M ${unitX + boxWidth} ${uMidY + boxHeight/2} C ${unitX + boxWidth + colGap/2} ${uMidY + boxHeight/2}, ${topicX - colGap/2} ${topicY + boxHeight/2}, ${topicX} ${topicY + boxHeight/2}`}
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="1.5"
                              />
                            )

                            // Leaf node topic box
                            nodes.push(
                              <g 
                                key={`node_t_${topic.id}`}
                                className="cursor-pointer group"
                                onClick={() => toggleTopicCompletion(unit.id, topic.id)}
                              >
                                <rect 
                                  x={topicX}
                                  y={topicY}
                                  width={boxWidth}
                                  height={boxHeight}
                                  rx="8"
                                  fill={topic.completed ? "#111827" : "#ffffff"}
                                  stroke={topic.completed ? "#111827" : "#e2e8f0"}
                                  strokeWidth="1.5"
                                  className="transition-colors duration-200"
                                />
                                <text 
                                  x={topicX + 10}
                                  y={topicY + 24}
                                  fill={topic.completed ? "#ffffff" : "#1f2937"}
                                  className="text-[10px] font-bold select-none truncate"
                                  style={{ maxWidth: boxWidth - 20 }}
                                >
                                  {topic.name.length > 20 ? `${topic.name.substring(0, 18)}...` : topic.name}
                                </text>
                              </g>
                            )

                            currentY += boxHeight + rowGap
                          })

                          // Unit node box
                          const unitTopicsYMid = unitStartTargetY + (unitTopicsCount * (boxHeight + rowGap)) / 2 - boxHeight/2 - rowGap/2
                          
                          // Line from Root -> Unit
                          lines.push(
                            <path 
                              key={`line_u_${unit.id}`}
                              d={`M ${rootX + boxWidth} ${rootY + boxHeight/2} C ${rootX + boxWidth + colGap/2} ${rootY + boxHeight/2}, ${unitX - colGap/2} ${unitTopicsYMid + boxHeight/2}, ${unitX} ${unitTopicsYMid + boxHeight/2}`}
                              fill="none"
                              stroke="#cbd5e1"
                              strokeWidth="2"
                            />
                          )

                          nodes.push(
                            <g key={`node_u_${unit.id}`}>
                              <rect 
                                x={unitX}
                                y={unitTopicsYMid}
                                width={boxWidth}
                                height={boxHeight}
                                rx="8"
                                fill="#f8fafc"
                                stroke="#cbd5e1"
                                strokeWidth="1.5"
                              />
                              <text 
                                x={unitX + 10}
                                y={unitTopicsYMid + 24}
                                fill="#0f172a"
                                className="text-[10px] font-bold select-none"
                              >
                                {unit.name.length > 22 ? `${unit.name.substring(0, 20)}...` : unit.name}
                              </text>
                            </g>
                          )
                        })

                        // Render Root node box
                        nodes.push(
                          <g key="root_node">
                            <rect 
                              x={rootX}
                              y={rootY}
                              width={boxWidth}
                              height={boxHeight}
                              rx="8"
                              fill="#111827"
                              stroke="#111827"
                            />
                            <text 
                              x={rootX + 15}
                              y={rootY + 24}
                              fill="#ffffff"
                              className="text-[11px] font-extrabold tracking-wider select-none uppercase"
                            >
                              {subject.name}
                            </text>
                          </g>
                        )

                        return (
                          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs overflow-x-auto">
                            <svg width={svgWidth} height={svgHeight}>
                              {lines}
                              {nodes}
                            </svg>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {subjectSubTab === "materials" && (
                    <div className="space-y-6 max-w-3xl">
                      {/* Upload actions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { type: "notes", label: "Upload Class Notes", accept: ".txt,.pdf,.docx" },
                          { type: "ppt", label: "Upload Slides & PPTs", accept: ".ppt,.pptx,.pdf" },
                          { type: "assignments", label: "Upload Assignments", accept: ".pdf,.doc" }
                        ].map((box, idx) => (
                          <div key={idx} className="border border-dashed border-gray-200 bg-white rounded-xl p-5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-gray-50/50 transition-colors relative">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-xs font-bold text-gray-850">{box.label}</span>
                            <span className="text-[9px] text-gray-400 select-none">Store fully local in browser</span>
                            <input 
                              type="file" 
                              accept={box.accept}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => handleUploadMaterial(e, box.type)}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Display files list */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase select-none">IndexedDB Stored Documents</h4>
                        {materials.filter(m => m.subjectId === subject.id).length === 0 ? (
                          <div className="border border-dashed border-gray-150 rounded-xl p-8 text-center text-xs text-gray-400 select-none bg-white">
                            No files uploaded. Files uploaded are saved client-side inside browser IndexedDB storage (No Cloud Storage).
                          </div>
                        ) : (
                          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 shadow-xs">
                            {materials
                              .filter(m => m.subjectId === subject.id)
                              .map((mat) => (
                                <div key={mat.id} className="flex items-center justify-between px-5 py-3 text-xs font-medium">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <div>
                                      <span className="text-gray-900 font-bold block">{mat.name}</span>
                                      <span className="text-[10px] text-gray-400 uppercase font-semibold">{mat.type} &bull; {mat.fileSize} &bull; Uploaded {mat.uploadedAt}</span>
                                    </div>
                                  </div>
                                  <button 
                                    onClick={async () => {
                                      await deleteById("materials", mat.id)
                                      setMaterials(materials.filter(m => m.id !== mat.id))
                                    }}
                                    className="text-gray-400 hover:text-rose-500 cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {subjectSubTab === "pyqs" && (
                    <div className="space-y-8 max-w-3xl">
                      {/* PYQ upload slots */}
                      <div className="space-y-4">
                        <div className="space-y-1 select-none">
                          <h3 className="font-bold text-sm text-gray-950">Past Year Papers (PYQ) Analyzer</h3>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            Upload question papers from past semesters (2020-2024). The AI extracts frequent questions, topics weighting, and generates candidate exam predictions.
                          </p>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                          {["2020", "2021", "2022", "2023", "2024"].map((year) => {
                            const analysis = pyqAnalysis.find(p => p.subjectId === subject.id && p.year === year)
                            return (
                              <div 
                                key={year} 
                                className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer relative hover:border-gray-300 transition-colors ${
                                  analysis ? "bg-gray-50 border-gray-200" : "bg-white border-dashed border-gray-200"
                                }`}
                              >
                                <FileText className={`w-4 h-4 ${analysis ? "text-gray-800" : "text-gray-300"}`} />
                                <span className="text-xs font-bold">{year} PYQ</span>
                                <span className="text-[8px] font-semibold text-gray-400">
                                  {analysis ? "Analyzed" : "Upload"}
                                </span>
                                {!analysis && (
                                  <input 
                                    type="file" 
                                    accept=".pdf,.txt,.docx"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => handleUploadPYQ(e, year)}
                                  />
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Display AI PYQ output analysis */}
                      {(() => {
                        const subjectAnalyses = pyqAnalysis.filter(p => p.subjectId === subject.id)
                        if (subjectAnalyses.length === 0) return null

                        // Merge expected questions and concepts across uploaded years
                        const repeatedQuestions = Array.from(new Set(subjectAnalyses.flatMap(a => a.repeatedQuestions)))
                        const repeatedConcepts = Array.from(new Set(subjectAnalyses.flatMap(a => a.repeatedConcepts)))
                        const expectedQuestions = Array.from(new Set(subjectAnalyses.flatMap(a => a.expectedQuestions)))

                        return (
                          <div className="space-y-6">
                            {/* Repeated concepts weights */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-3 select-none">
                              <h4 className="text-xs font-bold text-gray-400 uppercase">Frequent Concepts & Weightings</h4>
                              <div className="flex flex-wrap gap-2">
                                {repeatedConcepts.map((concept, idx) => (
                                  <span key={idx} className="bg-gray-50 border border-gray-150 text-gray-800 font-semibold px-2.5 py-1 rounded-lg text-xs">
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Top Predicted questions */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                              <div className="bg-gray-50 border-b border-gray-150 px-5 py-3 select-none">
                                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-gray-600" />
                                  Top Predicted Exam Questions (AI Forecast)
                                </h4>
                              </div>
                              <div className="divide-y divide-gray-100 px-5 py-2">
                                {expectedQuestions.map((q, idx) => (
                                  <div key={idx} className="py-2.5 text-xs font-medium text-gray-850 leading-relaxed flex items-start gap-2">
                                    <span className="text-gray-400 font-bold select-none">{idx + 1}.</span>
                                    <span>{q}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Repeated Questions from past papers */}
                            <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                              <div className="bg-gray-50 border-b border-gray-150 px-5 py-3 select-none">
                                <h4 className="text-xs font-bold text-gray-900">
                                  Repeated Questions (Found in multiple years)
                                </h4>
                              </div>
                              <div className="divide-y divide-gray-100 px-5 py-2">
                                {repeatedQuestions.map((q, idx) => (
                                  <div key={idx} className="py-2.5 text-xs font-medium text-gray-850 leading-relaxed flex items-start gap-2">
                                    <span className="text-gray-400 font-bold select-none">&bull;</span>
                                    <span>{q}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {subjectSubTab === "flashcards" && (
                    <div className="space-y-6 max-w-xl">
                      <div className="space-y-1 select-none">
                        <h3 className="font-bold text-sm text-gray-950">Spaced Repetition Review (Leitner System)</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          AI generates study flashcards automatically. Correct answers push the card to higher review boxes. Box 5 cards are fully mastered.
                        </p>
                      </div>

                      {studyCards.length === 0 ? (
                        <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-xs text-gray-400 bg-white">
                          Flashcard reviews complete or loading session...
                        </div>
                      ) : (
                        (() => {
                          const card = studyCards[cardIndex]
                          if (!card) return null

                          return (
                            <div className="space-y-6">
                              {/* Session Progress bar */}
                              <div className="flex items-center justify-between text-xs text-gray-400 select-none">
                                <span>Card {cardIndex + 1} of {studyCards.length}</span>
                                <span className="font-semibold text-gray-800">Box {card.box} / 5</span>
                              </div>

                              {/* Interactive Flashing Card */}
                              <div 
                                onClick={() => setShowCardAnswer(!showCardAnswer)}
                                className="bg-white border border-gray-200 rounded-2xl min-h-64 flex items-center justify-center p-8 text-center cursor-pointer shadow-xs transition-shadow hover:shadow-sm"
                              >
                                <div className="space-y-4">
                                  <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-400 block select-none">
                                    {showCardAnswer ? "Answer" : "Question"}
                                  </span>
                                  <p className="text-base font-bold text-gray-900 leading-relaxed">
                                    {showCardAnswer ? card.answer : card.question}
                                  </p>
                                  <span className="text-[10px] font-semibold text-gray-400 select-none">
                                    (Click card to flip)
                                  </span>
                                </div>
                              </div>

                              {/* Feedback actions */}
                              {showCardAnswer ? (
                                <div className="flex gap-4">
                                  <button
                                    onClick={() => handleCardFeedback(false)}
                                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 py-3 rounded-xl text-xs font-bold transition-colors select-none"
                                  >
                                    Incorrect (Reset Box 1)
                                  </button>
                                  <button
                                    onClick={() => handleCardFeedback(true)}
                                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-3 rounded-xl text-xs font-bold transition-colors select-none"
                                  >
                                    Correct (+30 XP)
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setShowCardAnswer(true)}
                                  className="w-full bg-gray-950 text-white py-3 rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors select-none"
                                >
                                  Reveal Answer
                                </button>
                              )}
                            </div>
                          )
                        })()
                      )}
                    </div>
                  )}

                  {subjectSubTab === "quizzes" && (
                    <div className="space-y-6 max-w-2xl">
                      <div className="space-y-1 select-none">
                        <h3 className="font-bold text-sm text-gray-950">Interactive Practice Tests</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Start an AI simulated practice test. Score percentages trigger XP boosts.
                        </p>
                      </div>

                      {currentQuiz === null ? (
                        <div className="border border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center bg-white">
                          <BookOpenCheck className="w-6 h-6 text-gray-300" />
                          <span className="text-xs font-semibold text-gray-800">No active practice simulation</span>
                          <button
                            onClick={() => startQuiz(subject.id)}
                            className="bg-gray-950 text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-gray-800 transition-colors"
                          >
                            AI Generate Quiz
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-6">
                          <h4 className="font-bold text-sm text-gray-900 border-b border-gray-100 pb-3 select-none">
                            {currentQuiz.title}
                          </h4>
                          
                          <div className="space-y-6">
                            {currentQuiz.questions.map((q, idx) => (
                              <div key={q.id} className="space-y-3">
                                <p className="text-xs font-bold text-gray-950 leading-relaxed">
                                  {idx + 1}. {q.question}
                                </p>
                                
                                {q.type === "mcq" && q.options && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {q.options.map((opt) => {
                                      const isSelected = quizAnswers[q.id] === opt
                                      const isCorrect = q.correctAnswer === opt
                                      let btnStyle = "border-gray-200 hover:bg-gray-50"
                                      
                                      if (isSelected) {
                                        btnStyle = "border-gray-950 bg-gray-50/50 font-bold"
                                      }
                                      
                                      if (quizReview) {
                                        if (isCorrect) {
                                          btnStyle = "border-green-500 bg-green-50 text-green-700 font-bold cursor-default"
                                        } else if (isSelected) {
                                          btnStyle = "border-red-500 bg-red-50 text-red-700 font-bold cursor-default"
                                        } else {
                                          btnStyle = "border-gray-200 opacity-50 cursor-default"
                                        }
                                      }

                                      return (
                                        <button
                                          key={opt}
                                          disabled={quizReview}
                                          onClick={() => {
                                            setQuizAnswers({
                                              ...quizAnswers,
                                              [q.id]: opt
                                            })
                                          }}
                                          className={`border px-4 py-2.5 rounded-lg text-left text-xs transition-all ${btnStyle}`}
                                        >
                                          {opt}
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}

                                {q.type !== "mcq" && (
                                  <textarea
                                    disabled={quizReview}
                                    value={quizAnswers[q.id] || ""}
                                    onChange={(e) => {
                                      setQuizAnswers({
                                        ...quizAnswers,
                                        [q.id]: e.target.value
                                      })
                                    }}
                                    placeholder="Type your explanation answer here..."
                                    rows={3}
                                    className="w-full border border-gray-200 rounded-lg p-3 text-xs bg-gray-50/20 focus:outline-none focus:border-gray-950"
                                  />
                                )}

                                {quizReview && q.explanation && (
                                  <div className="bg-gray-50 rounded-lg p-3 text-[10px] text-gray-500 leading-relaxed">
                                    <strong className="font-bold text-gray-700 uppercase block mb-1">AI Explanation</strong>
                                    {q.explanation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {quizReview ? (
                            <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                              <div className="text-xs">
                                <span>Exam Score: </span>
                                <strong className="text-base font-extrabold text-gray-900">{quizScore}%</strong>
                              </div>
                              <button
                                onClick={() => startQuiz(subject.id)}
                                className="bg-gray-950 text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-gray-800 transition-colors"
                              >
                                Attempt Another Quiz
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={submitQuiz}
                              className="w-full bg-gray-950 text-white rounded-lg py-3 text-xs font-semibold hover:bg-gray-800 transition-colors select-none"
                            >
                              Submit Quiz Answers
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })()
        ) : (
          (() => {
            // RENDER STANDARD SIDEBAR PAGES
            return (
              <div className="flex-1 p-8 bg-[#fafafa]">
                {/* Header title */}
                <header className="mb-8 select-none flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-950 uppercase">{activeTab}</h1>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Semester Mission Control Centre</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                    <span>Active Semester: <strong className="text-gray-900">{semester.name}</strong></span>
                  </div>
                </header>

                {activeTab === "dashboard" && (
                  <div className="grid gap-6 md:grid-cols-3">
                    {/* Left main area */}
                    <div className="md:col-span-2 space-y-6">
                      {/* Countdown & Urgent Tasks */}
                      <div className="grid grid-cols-2 gap-6 select-none">
                        {/* Countdown widget */}
                        {(() => {
                          const upcoming = [...subjects]
                            .filter(s => s.daysRemaining !== undefined)
                            .sort((a, b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))
                          const nextSub = upcoming[0]

                          return (
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                              <div className="space-y-1">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Next Exam Target</span>
                                <h3 className="font-bold text-base text-gray-950 truncate">{nextSub ? nextSub.name : "None Scheduled"}</h3>
                              </div>
                              <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-gray-950 tracking-tight">
                                  {nextSub && nextSub.daysRemaining !== undefined ? nextSub.daysRemaining : "--"}
                                </span>
                                <span className="text-xs font-semibold text-gray-400">days left</span>
                              </div>
                            </div>
                          )
                        })()}

                        {/* Prep Score widget */}
                        {(() => {
                          const totalPrep = subjects.reduce((acc, s) => acc + (s.preparedness || 0), 0)
                          const avgPrep = subjects.length > 0 ? Math.round(totalPrep / subjects.length) : 0

                          return (
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                              <div className="space-y-1">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">Overall Preparedness</span>
                                <h3 className="font-bold text-base text-gray-950">Average Score</h3>
                              </div>
                              <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-gray-950 tracking-tight">{avgPrep}%</span>
                                <span className="text-xs font-semibold text-gray-400">syllabus done</span>
                              </div>
                            </div>
                          )
                        })()}
                      </div>

                      {/* Today's Focus Checklist */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between select-none">
                          <h3 className="font-bold text-sm text-gray-900">Today's Focus Tasks</h3>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {tasks.filter(t => t.completed).length} / {tasks.length} Completed
                          </span>
                        </div>

                        {tasks.length === 0 ? (
                          <div className="text-xs text-gray-400 select-none py-2">
                            No tasks created. Setup subject workspace syllabus to generate tasks.
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-150">
                            {tasks.map((task) => (
                              <div key={task.id} className="flex items-center justify-between py-2.5 text-xs font-medium">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                      task.completed 
                                        ? "bg-gray-900 border-gray-900 text-white" 
                                        : "border-gray-300 hover:border-gray-500"
                                    }`}
                                  >
                                    {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                  </button>
                                  <span className={`${task.completed ? "line-through text-gray-400" : "text-gray-850"}`}>
                                    {task.title}
                                  </span>
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gray-50 text-gray-500">
                                  +{task.xpReward} XP
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side widgets bar */}
                    <div className="space-y-6">
                      {/* Weak Subjects list */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs space-y-4">
                        <h3 className="font-bold text-sm text-gray-900 select-none">Weak Preparedness Alert</h3>
                        <div className="space-y-3">
                          {subjects
                            .filter(s => (s.preparedness || 0) < 50)
                            .map((sub) => (
                              <div key={sub.id} className="flex items-center justify-between text-xs font-medium border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                <span className="font-bold text-gray-900">{sub.name}</span>
                                <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md text-[10px]">
                                  {sub.preparedness || 0}% Prepared
                                </span>
                              </div>
                            ))}
                          {subjects.filter(s => (s.preparedness || 0) < 50).length === 0 && (
                            <span className="text-xs text-gray-400 select-none block">
                              All subjects above 50% prep! Perfect.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* AI Copilot background prompt advice */}
                      <div className="bg-emerald-50 border border-[#e1f0e1] rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-800 select-none">
                          <Brain className="w-4 h-4" />
                          <h4 className="text-xs font-extrabold uppercase tracking-wide">Workspace Advisory</h4>
                        </div>
                        <p className="text-xs text-emerald-950 leading-relaxed">
                          Based on schedule logic, prioritize <strong className="font-bold">{[...subjects].sort((a,b) => (a.daysRemaining || 0) - (b.daysRemaining || 0))[0]?.name || "subjects"}</strong> next. You have low confidence margins. Completing 3 additional topics will increase your readiness by 15%.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "calendar" && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs max-w-4xl space-y-6">
                    <div className="select-none">
                      <h3 className="font-bold text-base text-gray-900">Exam Timeline Calendar</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        A detailed timeline showing exams and dates gaps. Space out revision cycles based on timeline gaps.
                      </p>
                    </div>

                    <div className="relative border-l border-gray-200 pl-6 space-y-8 select-none">
                      {[...subjects]
                        .sort((a, b) => {
                          const dateA = new Date(a.examDate || "").getTime()
                          const dateB = new Date(b.examDate || "").getTime()
                          return dateA - dateB
                        })
                        .map((sub, idx, arr) => {
                          let gapDays = null
                          if (idx > 0 && sub.examDate && arr[idx - 1].examDate) {
                            const date1 = new Date(arr[idx - 1].examDate || "")
                            const date2 = new Date(sub.examDate || "")
                            const diffTime = date2.getTime() - date1.getTime()
                            gapDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1)
                          }

                          return (
                            <div key={sub.id} className="relative">
                              {/* Dot marker */}
                              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-gray-900 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-mono text-gray-400 font-bold">
                                    {sub.examDate ? new Date(sub.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}
                                  </span>
                                  {gapDays !== null && (
                                    <span className="bg-gray-100 text-gray-650 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                                      {gapDays} gap days
                                    </span>
                                  )}
                                </div>
                                <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/20 max-w-xl flex items-center justify-between">
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900">{sub.name}</h4>
                                    <span className="text-[10px] text-gray-400 font-semibold uppercase">{sub.examTime || "TBA"} &bull; Difficulty {sub.difficulty}</span>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      setSelectedSubjectId(sub.id)
                                      setSubjectSubTab("syllabus")
                                    }}
                                    className="border border-gray-200 bg-white hover:bg-gray-50 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-colors"
                                  >
                                    View Syllabus
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                )}

                {activeTab === "subjects" && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="grid gap-6 md:grid-cols-2">
                      {subjects.map((sub) => (
                        <div key={sub.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs ${sub.color}`}>
                                  {sub.name.substring(0,2).toUpperCase()}
                                </div>
                                <h3 className="font-bold text-sm text-gray-950 truncate max-w-[180px]">{sub.name}</h3>
                              </div>
                              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500">
                                {sub.difficulty}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed">
                              Preparedness is currently at <strong className="font-semibold text-gray-850">{sub.preparedness || 0}%</strong>. The final exam is scheduled on {sub.examDate ? new Date(sub.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBA"} at {sub.examTime || "TBA"}.
                            </p>
                          </div>

                          <div className="border-t border-gray-100 mt-6 pt-4 flex items-center justify-between">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => startExamNightMode(sub.id)}
                                className="bg-gray-950 text-white rounded-lg px-3 py-1.5 text-[10px] font-bold hover:bg-gray-800 transition-colors flex items-center gap-1"
                              >
                                <Moon className="w-3 h-3" /> Night Mode
                              </button>
                              <button 
                                onClick={() => {
                                  setSelectedSubjectId(sub.id)
                                  setSubjectSubTab("flashcards")
                                }}
                                className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-colors"
                              >
                                Flashcards
                              </button>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedSubjectId(sub.id)
                                setSubjectSubTab("syllabus")
                              }}
                              className="text-xs font-bold text-gray-950 hover:underline flex items-center gap-1.5"
                            >
                              Workspace <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "tasks" && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs max-w-3xl space-y-6">
                    <div className="flex items-center justify-between select-none">
                      <div>
                        <h3 className="font-bold text-base text-gray-900">Task Manager</h3>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          Automatically generated study syllabus checklists and user goals.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                        {tasks.filter(t => t.completed).length} / {tasks.length} Done
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between py-3 text-xs font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleTask(task.id)}
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                task.completed 
                                  ? "bg-gray-900 border-gray-900 text-white" 
                                  : "border-gray-300 hover:border-gray-500"
                              }`}
                            >
                              {task.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </button>
                            <div>
                              <span className={`block font-bold text-gray-900 ${task.completed ? "line-through text-gray-400" : ""}`}>
                                {task.title}
                              </span>
                              <span className="text-[9px] text-gray-400 uppercase font-semibold">
                                {subjects.find(s => s.id === task.subjectId)?.name || "Subject"} &bull; Due Exam Day
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-gray-50 text-gray-500">
                            +{task.xpReward} XP
                          </span>
                        </div>
                      ))}
                      {tasks.length === 0 && (
                        <div className="text-xs text-gray-400 py-6 text-center select-none">
                          No tasks. Tasks populate automatically as you add topics to your subject syllabi!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "flashcards" && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="select-none">
                      <h3 className="font-bold text-base text-gray-900">Spaced Repetition Review Center</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Select a workspace to start flashcard review drills. Review items regularly to progress cards to Box 5.
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {subjects.map((sub) => {
                        const subCards = flashcards.filter(c => c.subjectId === sub.id)
                        const masteredCount = subCards.filter(c => c.box === 5).length
                        
                        return (
                          <div key={sub.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-gray-950 truncate max-w-[180px]">{sub.name}</h4>
                              <span className="text-[10px] text-gray-400 font-semibold uppercase block mt-1">
                                {subCards.length} Flashcards &bull; {masteredCount} Mastered
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedSubjectId(sub.id)
                                setSubjectSubTab("flashcards")
                                startFlashcardSession(sub.id)
                              }}
                              className="bg-gray-950 text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-gray-800 transition-colors"
                            >
                              Study Cards
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeTab === "quizzes" && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="select-none">
                      <h3 className="font-bold text-base text-gray-900">Quiz & Mock Simulation Center</h3>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Assess preparedness by launching dynamic practice quizzes on syllabus topics.
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {subjects.map((sub) => {
                        const attempted = quizzes.filter(q => q.subjectId === sub.id).length
                        return (
                          <div key={sub.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-sm text-gray-950 truncate max-w-[180px]">{sub.name}</h4>
                              <span className="text-[10px] text-gray-400 font-semibold uppercase block mt-1">
                                {attempted} simulated quizzes attempted
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedSubjectId(sub.id)
                                setSubjectSubTab("quizzes")
                                startQuiz(sub.id)
                              }}
                              className="bg-gray-950 text-white rounded-lg px-4 py-2 text-xs font-semibold hover:bg-gray-800 transition-colors"
                            >
                              Launch Test
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {activeTab === "progress" && (
                  <div className="space-y-6 max-w-3xl">
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs select-none space-y-6">
                      <div>
                        <h3 className="font-bold text-base text-gray-900">Academic Progress Metrics</h3>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                          Visualizations of syllabus completion metrics and preparedness states.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/20 space-y-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Level Score</span>
                          <span className="text-2xl font-extrabold text-gray-950">Level {stats.level}</span>
                          <span className="text-[9px] text-gray-400 block font-semibold">Scholar Rank</span>
                        </div>
                        <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/20 space-y-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total XP</span>
                          <span className="text-2xl font-extrabold text-gray-950">{stats.xp} XP</span>
                          <span className="text-[9px] text-gray-400 block font-semibold">Accumulated Goals XP</span>
                        </div>
                        <div className="border border-gray-150 rounded-xl p-4 bg-gray-50/20 space-y-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Active Streak</span>
                          <span className="text-2xl font-extrabold text-amber-600 flex items-center justify-center gap-1">
                            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                            {stats.streak} Days
                          </span>
                          <span className="text-[9px] text-gray-400 block font-semibold">Consecutive Study Days</span>
                        </div>
                      </div>

                      {/* Bar metrics for each subject */}
                      <div className="space-y-4 pt-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syllabus Completion Ratios</h4>
                        <div className="space-y-3">
                          {subjects.map((sub) => (
                            <div key={sub.id} className="space-y-1 text-xs">
                              <div className="flex justify-between font-semibold">
                                <span className="text-gray-900">{sub.name}</span>
                                <span className="text-gray-500">{sub.preparedness || 0}% Complete</span>
                              </div>
                              <div className="w-full bg-gray-150 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-gray-900 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${sub.preparedness || 0}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs max-w-3xl space-y-6">
                    <div className="select-none">
                      <h3 className="font-bold text-base text-gray-900">Study Materials Inventory</h3>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        A full directory index of notes, guides, and assignments stored locally in IndexedDB.
                      </p>
                    </div>

                    <div className="divide-y divide-gray-150">
                      {materials.map((mat) => (
                        <div key={mat.id} className="flex items-center justify-between py-3 text-xs font-medium">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <span className="text-gray-900 font-bold block">{mat.name}</span>
                              <span className="text-[9px] text-gray-400 uppercase font-semibold">
                                {subjects.find(s => s.id === mat.subjectId)?.name || "Subject"} &bull; {mat.fileSize} &bull; Uploaded {mat.uploadedAt}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={async () => {
                              await deleteById("materials", mat.id)
                              setMaterials(materials.filter(m => m.id !== mat.id))
                            }}
                            className="text-gray-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {materials.length === 0 && (
                        <div className="text-xs text-gray-400 text-center py-8 select-none">
                          No files uploaded. Go to a subject workspace's "Study Materials" tab to upload note documents.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs max-w-2xl space-y-6">
                    <div className="select-none border-b border-gray-100 pb-4">
                      <h3 className="font-bold text-base text-gray-900">Settings & System Preferences</h3>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                        Configure local preferences or wipe workspace databases.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-gray-900 block">Clear Study Data & Semester</span>
                          <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">Wipe the entire IndexedDB database completely and restart setup</span>
                        </div>
                        <button
                          onClick={handleResetData}
                          className="bg-rose-50 border border-rose-200 text-rose-700 rounded-lg px-4 py-2 text-xs font-bold hover:bg-rose-100 transition-colors"
                        >
                          Wipe DB Database
                        </button>
                      </div>

                      <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-400 font-semibold select-none">
                        <span>Database Engines</span>
                        <span className="text-gray-700">IndexedDB (Browser Native)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 font-semibold select-none">
                        <span>AI API Fallbacks</span>
                        <span className="text-gray-700">Groq API &bull; Pollinations AI</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })()
        )}
      </main>

      {/* EMERGENCY EXAM NIGHT MODE FULLSCREEN OVERLAY */}
      {isExamNightMode && (
        <div className="fixed inset-0 z-50 bg-[#07090e] text-slate-100 flex flex-col font-sans select-none overflow-y-auto">
          {/* Night mode header bar */}
          <header className="border-b border-slate-800 bg-[#0b0f19]/80 backdrop-blur-md px-8 py-5 flex items-center justify-between sticky top-0 shrink-0">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <h1 className="text-sm font-bold tracking-wider uppercase text-slate-200">Exam Night Blitz Dashboard</h1>
                <span className="text-[10px] text-slate-500 font-semibold block leading-none uppercase">Distraction-Free Emergency Notes</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* Emergency timer */}
              <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold font-mono">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  {Math.floor(nightTimer / 60)}:
                  {String(nightTimer % 60).padStart(2, '0')}
                </span>
                <button
                  onClick={() => setNightTimerActive(!nightTimerActive)}
                  className={`px-2 py-0.5 rounded-md text-[9px] uppercase font-bold tracking-wider ${
                    nightTimerActive ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {nightTimerActive ? "Pause" : "Start"}
                </button>
              </div>

              <button
                onClick={() => {
                  setIsExamNightMode(false)
                  setNightTimerActive(false)
                }}
                className="border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-250 p-2 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Emergency notes content */}
          <div className="flex-grow max-w-4xl mx-auto w-full px-8 py-10 space-y-8">
            {nightModeData === null ? (
              <div className="flex flex-col items-center justify-center gap-4 py-32 text-slate-400">
                <div className="w-6 h-6 border-2 border-slate-700 border-t-amber-400 rounded-full animate-spin"></div>
                <span className="text-xs font-bold tracking-wider uppercase">AI compiling emergency blitz guides...</span>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Emergency Summary Callout */}
                <div className="border border-amber-500/20 bg-amber-500/5 rounded-xl p-5 flex items-start gap-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="text-xs text-amber-200/90 leading-relaxed space-y-1">
                    <strong className="font-extrabold uppercase text-[10px] tracking-wider block text-amber-300">30-Minute Emergency Blitz Plan</strong>
                    <p>{nightModeData.revisionSummary}</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Key definitions */}
                  <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Must-Know Definitions</h3>
                    <div className="space-y-3 font-medium text-xs text-slate-300">
                      {nightModeData.definitions.map((def, idx) => (
                        <p key={idx} className="leading-relaxed">
                          &bull; {def}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Crucial Formulas */}
                  <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">Crucial Formulas & Proofs</h3>
                    <div className="space-y-3 font-mono text-xs text-slate-300">
                      {nightModeData.formulas.map((f, idx) => (
                        <p key={idx} className="leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-slate-800/40">
                          {f}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Critical topics to skim */}
                <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4 select-none">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">High-Probability Concepts to Skim</h3>
                  <div className="flex flex-wrap gap-2">
                    {nightModeData.criticalTopics.map((topic, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 text-slate-200 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
