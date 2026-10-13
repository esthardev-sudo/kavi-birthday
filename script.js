"use strict";

(() => {
  const photoPicker = document.querySelector("#photo-picker");
  const gallery = document.querySelector("[data-photo-gallery]");
  const videoPicker = document.querySelector("#video-picker");
  const videoPreview = document.querySelector("[data-video-preview]");
  const objectUrls = [];
  let audioContext;
  let musicTimer;
  let nextNoteTime = 0;
  let noteIndex = 0;
  let musicPlaying = false;
  const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 392];

  if (photoPicker && gallery) {
    photoPicker.addEventListener("change", () => {
      const files = Array.from(photoPicker.files || []).filter((file) => file.type.startsWith("image/"));
      if (!files.length) return;
      gallery.replaceChildren();
      files.forEach((file) => {
        const image = document.createElement("img");
        image.className = "gallery-image";
        image.alt = file.name ? `Selected memory: ${file.name}` : "Selected photo memory";
        const url = URL.createObjectURL(file);
        objectUrls.push(url);
        image.src = url;
        gallery.append(image);
      });
    });
  }

  if (videoPicker && videoPreview) {
    videoPicker.addEventListener("change", () => {
      const file = Array.from(videoPicker.files || []).find((item) => item.type.startsWith("video/"));
      if (!file) return;
      const player = document.createElement("video");
      player.className = "video-preview";
      player.controls = true;
      player.preload = "metadata";
      player.setAttribute("aria-label", "Selected birthday memory video");
      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      player.src = url;
      videoPreview.replaceChildren(player);
    });
  }

  function playNote() {
    if (!audioContext || !musicPlaying) return;
    while (nextNoteTime < audioContext.currentTime + 0.15) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = melody[noteIndex % melody.length];
      gain.gain.setValueAtTime(0.0001, nextNoteTime);
      gain.gain.exponentialRampToValueAtTime(0.045, nextNoteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + 0.7);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(nextNoteTime);
      oscillator.stop(nextNoteTime + 0.72);
      nextNoteTime += 0.48;
      noteIndex += 1;
    }
  }

  const musicButton = document.querySelector("[data-music-toggle]");
  const musicStatus = document.querySelector("[data-music-status]");
  if (musicButton) {
    musicButton.addEventListener("click", async () => {
      if (!musicPlaying) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          if (musicStatus) musicStatus.textContent = "This browser does not support the optional music feature.";
          return;
        }
        if (!audioContext) audioContext = new AudioContextClass();
        if (audioContext.state === "suspended") await audioContext.resume();
        musicPlaying = true;
        nextNoteTime = audioContext.currentTime;
        musicTimer = window.setInterval(playNote, 100);
        playNote();
        musicButton.textContent = "Ⅱ Pause gentle music";
        musicButton.setAttribute("aria-pressed", "true");
        if (musicStatus) musicStatus.textContent = "A gentle little tune, made just for this page.";
      } else {
        musicPlaying = false;
        window.clearInterval(musicTimer);
        if (audioContext) await audioContext.suspend();
        musicButton.textContent = "♫ Play gentle music";
        musicButton.setAttribute("aria-pressed", "false");
        if (musicStatus) musicStatus.textContent = "Music paused.";
      }
    });
  }

  const canvas = document.querySelector(".confetti-canvas");
  const celebrateButton = document.querySelector("[data-celebrate-button]");
  let animationFrame;
  let pieces = [];
  let confettiContext;

  function burstConfetti() {
    if (!canvas) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    confettiContext = canvas.getContext("2d");
    if (!confettiContext) return;
    const pieceCount = window.innerWidth < 600 ? 38 : 64;
    pieces = Array.from({ length: pieceCount }, () => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height * 0.4,
      size: (3 + Math.random() * 5) * pixelRatio,
      speed: (2 + Math.random() * 4) * pixelRatio,
      drift: (Math.random() - 0.5) * 2 * pixelRatio,
      angle: Math.random() * Math.PI,
      color: ["#e6ca91", "#d58b9a", "#fff1d2", "#78a99a"][Math.floor(Math.random() * 4)]
    }));
    window.cancelAnimationFrame(animationFrame);
    const endAt = performance.now() + 3000;
    const draw = (now) => {
      confettiContext.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((piece) => {
        piece.y += piece.speed;
        piece.x += piece.drift;
        piece.angle += 0.04;
        confettiContext.save();
        confettiContext.translate(piece.x, piece.y);
        confettiContext.rotate(piece.angle);
        confettiContext.fillStyle = piece.color;
        confettiContext.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.65);
        confettiContext.restore();
      });
      if (now < endAt) animationFrame = window.requestAnimationFrame(draw);
      else confettiContext.clearRect(0, 0, canvas.width, canvas.height);
    };
    animationFrame = window.requestAnimationFrame(draw);
  }

  if (canvas && document.body.hasAttribute("data-celebrate")) {
    window.setTimeout(burstConfetti, 250);
    window.addEventListener("resize", () => window.cancelAnimationFrame(animationFrame));
  }
  if (celebrateButton) celebrateButton.addEventListener("click", burstConfetti);

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(animationFrame);
    window.clearInterval(musicTimer);
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
    if (audioContext) audioContext.close();
  });
})();
