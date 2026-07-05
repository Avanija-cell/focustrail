// Handles the Pomodoro countdown logic and connects finished sessions to storage.js

let totalSeconds = 25 * 60;   // 25 minutes, converted to seconds
let secondsLeft = totalSeconds;
let timerInterval = null;      // will hold our setInterval reference so we can stop it later
let isRunning = false;

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-timer-btn");
const pauseBtn = document.getElementById("pause-timer-btn");
const resetBtn = document.getElementById("reset-timer-btn");
const subjectSelect = document.getElementById("subject-select");

// Format for display
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(secondsLeft);
}

function startTimer() {
  if (isRunning) 
    return; // prevent multiple timers
  
  isRunning = true;

  updateButtonStates();

  timerInterval = setInterval(() => {
    secondsLeft--;
    updateDisplay();

    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      isRunning = false;
      updateButtonStates();
      onSessionComplete();
  }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  updateButtonStates();
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  updateButtonStates();
  secondsLeft = totalSeconds;
  updateDisplay();
}

function onSessionComplete() {
  const subject = subjectSelect.value;
  const minutesStudied = totalSeconds / 60;

  // Save session
  addSession(subject, minutesStudied);

  // Refresh UI
  renderDashboard();
  renderRecentSessions();
  renderHeatmap();

  const toast = document.getElementById("toast");

  toast.textContent = `${minutesStudied} min of ${subject} added successfully.`;

  toast.classList.add("show");

  setTimeout(() => {
      toast.classList.remove("show");
  }, 2500);

    resetTimer();
}

// Connect buttons
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

function updateButtonStates() {

  startBtn.disabled = isRunning;
  pauseBtn.disabled = !isRunning;

}

updateDisplay();
updateButtonStates();
 // Initialize timer - show 25:00 immediately when page loads