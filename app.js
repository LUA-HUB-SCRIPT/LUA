/*
  LUA — static frontend
  ---------------------
  Jangan edit daftar script/game secara manual jika memakai build.js.
  Jalankan: npm run build
  Build akan membaca folder Scripts/ dan Games/ lalu membuat data.json.
*/

const state = {
  scripts: [],
  games: []
};

const $ = (selector) => document.querySelector(selector);

async function loadData() {
  try {
    const response = await fetch("data.json", { cache: "no-store" });
    if (!response.ok) throw new Error("data.json belum dibuat.");
    const data = await response.json();
    state.scripts = Array.isArray(data.scripts) ? data.scripts : [];
    state.games = Array.isArray(data.games) ? data.games : [];
  } catch (error) {
    console.warn(error.message);
    // Fallback demo agar halaman tetap terlihat saat index.html dibuka langsung.
    state.scripts = [];
    state.games = [];
  }

  renderScripts();
  renderGames();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function renderScripts() {
  const grid = $("#scriptGrid");
  $("#scriptCount").textContent = `${state.scripts.length} script${state.scripts.length === 1 ? "" : "s"}`;

  if (!state.scripts.length) {
    grid.innerHTML = `<div class="empty">Belum ada script. Tambahkan file <code>.lua</code> ke folder <code>Scripts/</code>, lalu jalankan <code>npm run build</code>.</div>`;
    return;
  }

  grid.innerHTML = state.scripts.map((script, index) => `
    <article class="card">
      <div class="card-top">
        <h3>${escapeHtml(script.name)}</h3>
        <span class="badge">LUA</span>
      </div>
      <p>Script Lua dari folder Scripts.</p>
      <div class="card-actions">
        <a class="small-btn" href="${encodeURI(script.path)}" target="_blank" rel="noopener">View</a>
        <button class="small-btn copy-btn" data-index="${index}">Copy</button>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const script = state.scripts[Number(button.dataset.index)];
      try {
        const response = await fetch(encodeURI(script.path));
        if (!response.ok) throw new Error("Script tidak bisa dibaca.");
        const text = await response.text();
        await navigator.clipboard.writeText(text);
        button.textContent = "Copied ✓";
        button.classList.add("copied");
        setTimeout(() => {
          button.textContent = "Copy";
          button.classList.remove("copied");
        }, 1500);
      } catch (error) {
        alert("Gagal copy script. Pastikan website dijalankan lewat server/hosting.");
      }
    });
  });
}

function renderGames() {
  const grid = $("#gameGrid");

  if (!state.games.length) {
    grid.innerHTML = `<div class="empty">Belum ada game. Tambahkan file <code>.txt</code> ke folder <code>Games/</code>, isi dengan satu link game, lalu jalankan <code>npm run build</code>.</div>`;
    return;
  }

  grid.innerHTML = state.games.map((game) => `
    <article class="card">
      <div class="card-top">
        <h3>${escapeHtml(game.name)}</h3>
        <span class="badge">GAME</span>
      </div>
      <p>Link game dari folder Games.</p>
      <div class="card-actions">
        <a class="small-btn" href="${escapeHtml(game.url)}" target="_blank" rel="noopener noreferrer">Open ↗</a>
        <button class="small-btn" data-copy-url="${escapeHtml(game.url)}">Copy Link</button>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll("[data-copy-url]").forEach((button) => {
    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.copyUrl);
      button.textContent = "Copied ✓";
      setTimeout(() => button.textContent = "Copy Link", 1500);
    });
  });
}

function showPage() {
  const requested = location.hash.replace("#", "") || "home";
  const page = document.getElementById(requested) ? requested : "home";

  document.querySelectorAll(".page").forEach((section) => {
    section.classList.toggle("active", section.id === page);
  });

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === page);
  });
}

window.addEventListener("hashchange", showPage);
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  showPage();
  loadData();
});
