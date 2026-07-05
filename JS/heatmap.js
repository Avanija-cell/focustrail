// Building a contribution monthly calendar from stored sessions


// Total study time for day
function buildMinutesPerDay(sessions) {
  const totals = {};

  sessions.forEach(session => {
    if (!totals[session.date]) {
      totals[session.date] = 0;
    }
    totals[session.date] += session.duration;
  });

  return totals;
}

// Decides color "level"
function getIntensityLevel(minutes) {
  if (minutes <= 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 90) return 2;
  return 3;
}

function renderHeatmap() {

  const data = getData();

  const minutesPerDay = buildMinutesPerDay(data.sessions);

  const container = document.getElementById("heatmap-grid");
  const monthTitle = document.getElementById("calendar-month");

  container.innerHTML = "";

  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  monthTitle.textContent =
      firstDay.toLocaleString("default", {
          month: "long",
          year: "numeric"
      });

  // Empty cells before day 1

  for (let i = 0; i < firstDay.getDay(); i++) {

      const empty = document.createElement("div");
      empty.className = "calendar-day empty";

      container.appendChild(empty);

  }

  // Actual days

  for (let day = 1; day <= lastDay.getDate(); day++) {

      const current = new Date(year, month, day);

      const dateString = formatLocalDate(current);

      const minutes = minutesPerDay[dateString] || 0;

      const level = getIntensityLevel(minutes);

      const cell = document.createElement("div");

      cell.className = `calendar-day level-${level}`;

      cell.textContent = day;

      if (dateString === formatLocalDate(today)) {

          cell.classList.add("today");

      }

      cell.title = `${day} ${firstDay.toLocaleString("default",{month:"long"})}
${minutes} min studied`;

      container.appendChild(cell);

  }

}

renderHeatmap();