// dashboard.js
// Reads data from storage.js and updates the dashboard's numbers on screen.
// This file does NOT store or calculate raw data logic beyond simple display math —
// it just reads and renders.


function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
      return "Good Morning";
  }

  if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
  }

  if (hour >= 17 && hour < 22) {
      return "Good Evening";
  }

  return "Good Night";
}

function renderDashboard() {
  const data = getData(); // from storage.js
  const today = formatLocalDate(new Date()); 
  document.querySelector(".greeting").textContent = getGreeting();

  // ---- Today's Study Time ----
  const todaysSessions = data.sessions.filter(session => session.date === today);
  const todaysTotalMinutes = todaysSessions.reduce((sum, session) => sum + session.duration, 0);

  const hours = Math.floor(todaysTotalMinutes / 60);
  const minutes = Math.round(todaysTotalMinutes % 60);

  document.getElementById("today-value").textContent = `${hours} hr ${minutes} min`;

// ---- Today's Goal ----

const dailyGoalMinutes = 120;

document.getElementById("daily-goal-fill").style.width =
  `${Math.min((todaysTotalMinutes / dailyGoalMinutes) * 100, 100)}%`;

  const studiedMinutes = Math.round(todaysTotalMinutes);
  const remainingMinutes = Math.max(
    dailyGoalMinutes - studiedMinutes,
    0
  );
  
  document.querySelector(".goal-progress-text").textContent =
    `${studiedMinutes} / ${dailyGoalMinutes} min`;
    
let goalMessage = "";

if (todaysTotalMinutes === 0) {
  goalMessage = "Start your first session today.";
} else if (remainingMinutes === 0) {
  goalMessage = "🎉 Daily goal completed!";
} else {
  goalMessage = `${Math.round(remainingMinutes)} min left today.`;
}

document.querySelector(".goal-status").textContent = goalMessage;

  // ---- Weekly Goal Progress ----
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const thisWeeksSessions = data.sessions.filter(session => session.date >= formatLocalDate(weekAgo));
  const weeklyMinutes = thisWeeksSessions.reduce((sum, session) => sum + session.duration, 0);
  const weeklyHours = (weeklyMinutes / 60).toFixed(1);
  const targetHours = data.goals.weeklyTargetHours;

  document.getElementById("goal-value").textContent = `${weeklyHours} / ${targetHours} hrs`;

  const progressPercent = Math.min((weeklyHours / targetHours) * 100, 100);
  document.getElementById("goal-progress-fill").style.width = `${progressPercent}%`;

 // ---- Streak: real consecutive-day calculation ----
 const currentStreak = calculateCurrentStreak(data.sessions);
 document.getElementById("streak-value").textContent = `${currentStreak} Days`;
}

// Calculates the current consecutive-day streak, counting backward from today.
function calculateCurrentStreak(sessions) {
  const studiedDates = new Set(sessions.map(session => session.date));

  let streak = 0;
  let cursor = new Date(); // start checking from today

  // If today has no session yet, don't kill the streak immediately —
  // just start counting from yesterday instead (streak stays "alive" until end of day).
  if (!studiedDates.has(formatLocalDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  // Walk backward one day at a time, counting while each day has a session
  while (studiedDates.has(formatLocalDate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

renderDashboard(); // run once immediately when the page loads