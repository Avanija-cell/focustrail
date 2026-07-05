// storage.js
// This file is the ONLY place in the whole app that talks to localStorage directly.
// Every other file asks storage.js to save/load data instead of touching localStorage itself.
// Why: if we ever swap localStorage for a real database later, we only change this one file.

const STORAGE_KEY = "studyTrackerData";

// Get all data. If nothing exists yet, return a default empty structure.
function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    // First time the app is ever opened — no data yet.
    return {
      sessions: [],
      goals: {
        weeklyTargetHours: 20
      }
    };
  }

  return JSON.parse(raw); // convert the saved text back into a real JS object
}

// Save the entire data object back to localStorage.
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); // JS objects must be converted to text to be stored
}

// Converts a Date object into a "YYYY-MM-DD" string using LOCAL time, not UTC
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addSession(subject, durationMinutes) {
  const data = getData();

  const newSession = {
    id: crypto.randomUUID(),
    subject: subject,
    duration: durationMinutes,
    date: formatLocalDate(new Date())
  };

  data.sessions.push(newSession);
  saveData(data);
}