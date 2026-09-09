# LUA — Developer Hub

Website modern untuk menampilkan koleksi Lua script dan link game tanpa database.

## Struktur

```text
lua-project/
├── index.html
├── style.css
├── app.js
├── build.js
├── package.json
├── data.json
├── Scripts/
│   ├── script1.lua
│   └── script2.lua
└── Games/
    ├── game1.txt
    └── game2.txt
```

## Cara tambah script

1. Masukkan file `.lua` baru ke folder `Scripts/`.
2. Jalankan:

```bash
npm run build
```

3. Upload seluruh project ke hosting/static hosting.

Website otomatis membaca file Lua baru dari `data.json` hasil build.

## Cara tambah game

1. Buat file `.txt` baru di folder `Games/`.
2. Isi file tersebut dengan **satu link game**, misalnya:

```text
https://example.com/game
```

3. Jalankan lagi:

```bash
npm run build
```

Nama kartu game mengikuti nama file `.txt`.

## Menjalankan lokal

Karena tombol Copy memakai `fetch()`, jangan membuka `index.html` dengan `file://`.

Pakai server lokal, contohnya:

```bash
npx serve .
```

atau extension Live Server di VS Code.

## Key System

Tombol Key mengarah ke:

https://work.ink/2WNS/key-system

Tidak ada database, login, atau backend di project ini.
