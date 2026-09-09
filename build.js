const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const SCRIPTS_DIR = path.join(ROOT, "Scripts");
const GAMES_DIR = path.join(ROOT, "Games");
const OUTPUT = path.join(ROOT, "data.json");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function cleanName(file) {
  return path.basename(file, path.extname(file))
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function listFiles(dir, extensions) {
  ensureDir(dir);
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => extensions.includes(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

const scriptFiles = listFiles(SCRIPTS_DIR, [".lua"]);
const gameFiles = listFiles(GAMES_DIR, [".txt"]);

const scripts = scriptFiles.map((file) => ({
  name: cleanName(file),
  path: `Scripts/${encodeURIComponent(file)}`
}));

const games = [];

for (const file of gameFiles) {
  const fullPath = path.join(GAMES_DIR, file);
  const raw = fs.readFileSync(fullPath, "utf8").trim();
  const url = raw.split(/\r?\n/).map((line) => line.trim()).find(Boolean);

  if (!url) {
    console.warn(`Skipping ${file}: file kosong.`);
    continue;
  }

  if (!/^https?:\/\//i.test(url)) {
    console.warn(`Skipping ${file}: link harus diawali http:// atau https://`);
    continue;
  }

  games.push({
    name: cleanName(file),
    url
  });
}

const data = {
  generatedAt: new Date().toISOString(),
  scripts,
  games
};

fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2) + "\n");
console.log(`Build selesai: ${scripts.length} script, ${games.length} game.`);
