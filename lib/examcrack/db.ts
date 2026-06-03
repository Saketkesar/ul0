"use client"

// Local-first IndexedDB Database client for Examcrack OS
const DB_NAME = "examcrack_os_db";
const DB_VERSION = 1;

export interface Semester {
  id: string;
  name: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard" | "";
  color: string; // Tailwind/CSS color theme
  examDate?: string;
  examTime?: string;
  daysRemaining?: number;
  preparedness?: number; // 0 to 100
  confidence?: number;   // 0 to 100
}

export interface SyllabusUnit {
  id: string;
  subjectId: string;
  name: string; // e.g. "Unit 1: Asymptotic Analysis"
  topics: {
    id: string;
    name: string;
    completed: boolean;
    difficulty: "Easy" | "Medium" | "Hard";
    priority: "High" | "Medium" | "Low";
  }[];
}

export interface StudyMaterial {
  id: string;
  subjectId: string;
  name: string;
  type: string; // e.g. "pdf", "ppt", "notes"
  fileSize: string;
  fileData: string; // Base64 representation of file
  uploadedAt: string;
}

export interface PYQAnalysis {
  id: string;
  subjectId: string;
  year: string; // e.g. "2024"
  fileName: string;
  fileData: string; // Base64 file
  repeatedQuestions: string[];
  repeatedConcepts: string[];
  expectedQuestions: string[];
}

export interface StudyTask {
  id: string;
  subjectId: string;
  title: string;
  completed: boolean;
  dueDate: string;
  type: "Read" | "Solve" | "Quiz" | "Revise";
  xpReward: number;
}

export interface Flashcard {
  id: string;
  subjectId: string;
  unitId?: string;
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
  bookmarked: boolean;
  box: number; // Spaced repetition Leitner box (1 to 5)
  nextReviewDate: string; // ISO String
}

export interface Quiz {
  id: string;
  subjectId: string;
  title: string;
  questions: {
    id: string;
    type: "mcq" | "short" | "long";
    question: string;
    options?: string[]; // for MCQ
    correctAnswer?: string;
    explanation?: string;
  }[];
}

export interface GameStats {
  id: string; // "stats"
  xp: number;
  streak: number;
  level: number;
  lastActive: string; // YYYY-MM-DD
  achievements: string[]; // Unlocked badge IDs
}

const STORES = [
  "semester",
  "subjects",
  "syllabus",
  "materials",
  "pyqs",
  "tasks",
  "flashcards",
  "quizzes",
  "gamestats"
];

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("IndexedDB is only available in browser context"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      STORES.forEach((store) => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id" });
        }
      });
    };
  });
}

export async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

export async function getById<T>(storeName: string, id: string): Promise<T | null> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => resolve((request.result || null) as T | null);
    request.onerror = () => reject(request.error);
  });
}

export async function put<T extends { id: string }>(storeName: string, data: T): Promise<T> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => resolve(data);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteById(storeName: string, id: string): Promise<string> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => resolve(id);
    request.onerror = () => reject(request.error);
  });
}

export async function clearAll(storeName: string): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
