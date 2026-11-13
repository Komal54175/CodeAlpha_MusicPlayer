// Yahan apne gaanon ke naam likho (file ka naam bilkul sahi hona chahiye)
const songs = [
  { file: "song1.mp3", title: "Song One", artist: "Artist One" },
  { file: "song2.mp3", title: "Song Two", artist: "Artist Two" },
  { file: "song3.mp3", title: "Song Three", artist: "Artist Three" }
];

const audio = document.getElementById("audio");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const currentEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const volume = document.getElementById("volume");
const playlistEl = document.getElementById("playlist");

let index = 0;

function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + (s < 10 ? "0" + s : s);
}

function buildPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, i) => {
    const li = document.createElement("li");
    li.innerHTML = song.title + " <small>- " + song.artist + "</small>";
    li.addEventListener("click", () => {
      loadSong(i);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function loadSong(i) {
  index = i;
  audio.src = songs[i].file + ".mp3";
  titleEl.textContent = songs[i].title;
  artistEl.textContent = songs[i].artist;
  progress.value = 0;
  currentEl.textContent = "0:00";
  durationEl.textContent = "0:00";
  document.querySelectorAll(".playlist li").forEach((li, n) => {
    li.classList.toggle("active", n === i);
  });
}

function playSong() {
  audio.play().catch(() => {});
}

function pauseSong() {
  audio.pause();
}

function nextSong() {
  loadSong((index + 1) % songs.length);
  playSong();
}

function prevSong() {
  loadSong((index - 1 + songs.length) % songs.length);
  playSong();
}

playBtn.addEventListener("click", () => {
  if (audio.paused) playSong();
  else pauseSong();
});

audio.addEventListener("play", () => {
  playBtn.textContent = "⏸";
  cover.classList.add("playing");
});

audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
  cover.classList.remove("playing");
});

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Autoplay: gaana khatam hote hi agla chal jaye
audio.addEventListener("ended", nextSong);

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentEl.textContent = formatTime(audio.currentTime);
  }
});

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

audio.volume = volume.value;
buildPlaylist();
loadSong(0);