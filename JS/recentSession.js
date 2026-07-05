// Shows recent study sessions

function formatSessionDate(dateString) {

  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayString = formatLocalDate(today);
  const yesterdayString = formatLocalDate(yesterday);

  if (dateString === todayString) return "Today";

  if (dateString === yesterdayString) return "Yesterday";

  // build local date from parts to avoid UTC parsing shifting the day
  const [year, month, day] = dateString.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
  });
}

function renderRecentSessions() {

  const container = document.getElementById("recent-sessions");

  const data = getData();

  const sessions = [...data.sessions].reverse();

  container.innerHTML = "";

  if (sessions.length === 0) {

      container.innerHTML =
          "<p class='empty-state'>No study sessions yet.</p>";

      return;
  }

  sessions.slice(0, 5).forEach(session => {

      const item = document.createElement("div");
      item.className = "session-item";

      item.innerHTML = `
          <div class="session-left">
              <span class="session-subject">${session.subject}</span>
              <span class="session-date">${formatSessionDate(session.date)}</span>
          </div>

          <div class="session-duration">
            ${Math.round(session.duration)} min
          </div>
      `;

      container.appendChild(item);

  });

}

renderRecentSessions();