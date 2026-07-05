// Handles local storage operations

const STORAGE_KEY = "studyTrackerData";

// Get all data
// If nothing exists return a default empty structure
function getData() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    // No data when opened first
    return {
      sessions: [],
      goals: {
        weeklyTargetHours: 20
      }
    };
  }

  return JSON.parse(raw); 
}

// Saving data back to localStorage
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); // JS objects must be converted to text to be stored
}

// Date format - YYYY-MM-DD
// Converts a date object into a "YYYY-MM-DD" string using LOCAL time (not UTC)
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