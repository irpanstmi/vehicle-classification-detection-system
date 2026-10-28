/**
 * Sistem Deteksi Golongan Kendaraan Gerbang Tol
 * script.js — Irfan Sentosa
 */

(function () {
  "use strict";

  /* ── DOM references ─────────────────────────── */
  const form        = document.getElementById("upload-form");
  const fileInput   = document.getElementById("file-input");
  const browseBtn   = document.getElementById("browse-btn");
  const removeBtn   = document.getElementById("remove-btn");
  const resetBtn    = document.getElementById("reset-btn");
  const detectBtn   = document.getElementById("detect-btn");
  const dropZone    = document.getElementById("drop-zone");
  const dropIdle    = document.getElementById("drop-idle");
  const dropPreview = document.getElementById("drop-preview");
  const previewImg  = document.getElementById("preview-img");
  const fileNameEl  = document.getElementById("file-name-display");
  const loadingCard = document.getElementById("loading-card");
  const uploadCard  = document.getElementById("upload-card");

  if (!form) return; // guard: page not ready

  /* ── Stat counter animation ─────────────────── */
  function animateCounters() {
    const els = document.querySelectorAll(".stat-value[data-count]");
    els.forEach((el) => {
      const target  = parseFloat(el.dataset.count) || 0;
      const suffix  = el.dataset.suffix || "";
      const isFloat = !Number.isInteger(target);
      const duration = 900;
      const step     = 16;
      const steps    = duration / step;
      let current = 0;

      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = isFloat
          ? current.toFixed(1) + suffix
          : Math.floor(current) + suffix;
      }, step);
    });
  }

  /* ── File preview helper ────────────────────── */
  function showPreview(file) {
    if (!file || !file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewImg.onload = () => URL.revokeObjectURL(url);

    fileNameEl.textContent = file.name;
    dropIdle.classList.add("hidden");
    dropPreview.classList.remove("hidden");
    detectBtn.disabled = false;
  }

  function clearPreview() {
    fileInput.value = "";
    previewImg.src  = "#";
    fileNameEl.textContent = "";
    dropPreview.classList.add("hidden");
    dropIdle.classList.remove("hidden");
    detectBtn.disabled = true;
  }

  /* ── Browse button ──────────────────────────── */
  browseBtn.addEventListener("click", () => fileInput.click());

  /* ── File input change ──────────────────────── */
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) showPreview(file);
  });

  /* ── Remove preview ─────────────────────────── */
  removeBtn.addEventListener("click", clearPreview);

  /* ── Reset button ───────────────────────────── */
  resetBtn.addEventListener("click", () => {
    clearPreview();
    // If there's a result section visible, smooth-scroll back to upload
    const resultSection = document.getElementById("result-section");
    if (resultSection) {
      uploadCard.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  /* ── Drag & Drop ────────────────────────────── */
  ["dragenter", "dragover"].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("drag-over");
    });
  });
  ["dragleave", "drop"].forEach((evt) => {
    dropZone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("drag-over");
    });
  });
  dropZone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files[0];
    if (file) {
      // Transfer to input for form submission
      const dt  = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      showPreview(file);
    }
  });

  /* ── Click on zone (not browse button) ─────── */
  dropZone.addEventListener("click", (e) => {
    // Only trigger if clicking the idle area, not the browse button or remove btn
    if (
      e.target === dropZone ||
      e.target === dropIdle ||
      e.target.classList.contains("drop-main") ||
      e.target.classList.contains("drop-or") ||
      e.target.classList.contains("drop-icon-wrap") ||
      e.target.classList.contains("drop-icon")
    ) {
      fileInput.click();
    }
  });

  /* ── Form submit → show loading ─────────────── */
  form.addEventListener("submit", (e) => {
    const file = fileInput.files[0];
    if (!file) { e.preventDefault(); return; }

    // Show loading overlay
    if (loadingCard) {
      loadingCard.classList.remove("hidden");
      // Smooth scroll to loading
      loadingCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Disable detect button to prevent double submit
    detectBtn.disabled = true;
    detectBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mendeteksi...';
  });

  /* ── Stat counters on page load ─────────────── */
  if (document.querySelector(".stat-value[data-count]")) {
    // Delay slightly so user sees the animation
    setTimeout(animateCounters, 350);
  }

  /* ── Confidence bar entrance animation ──────── */
  function animateBars() {
    const bars = document.querySelectorAll(".conf-bar-fill");
    bars.forEach((bar) => {
      const target = bar.style.width;
      bar.style.width = "0%";
      requestAnimationFrame(() => {
        setTimeout(() => { bar.style.width = target; }, 80);
      });
    });
  }
  if (document.querySelector(".conf-bar-fill")) {
    animateBars();
  }

  /* ── Fade-in on scroll (IntersectionObserver) ─ */
  const observerOpts = { threshold: 0.1, rootMargin: "0px 0px -30px 0px" };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        observer.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll(".stat-card").forEach((el) => {
    el.style.animationPlayState = "paused";
    observer.observe(el);
  });

})();
