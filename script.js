const weddingDate = new Date("2026-12-12T12:00:00+08:00");

function pad(value) {
  return String(value).padStart(2, "0");
}

function tick() {
  const now = Date.now();
  const diff = Math.max(0, weddingDate.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  document.getElementById("days").textContent = pad(days);
  document.getElementById("hours").textContent = pad(hours);
  document.getElementById("minutes").textContent = pad(minutes);
  document.getElementById("seconds").textContent = pad(seconds);
}

tick();
setInterval(tick, 1000);

document.querySelector(".nav-toggle").addEventListener("click", () => {
  document.querySelector(".nav").classList.toggle("open");
});

document.getElementById("blessing-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const note = document.getElementById("form-note");
  note.hidden = false;
  event.target.reset();
});
