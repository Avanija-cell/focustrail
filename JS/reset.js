const resetButton = document.getElementById("reset-data-btn");

resetButton.addEventListener("click", () => {

    const confirmReset = confirm(
        "Are you sure you want to reset all study data?\n\nThis action cannot be undone."
    );

    if (!confirmReset) {
        return;
    }

    localStorage.removeItem("studyTrackerData");

    location.reload();

});