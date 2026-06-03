#!/usr/bin/env node
// Валидация данных архива Toristarm.
//   Структура (типы, обязательные поля, рейтинг, статусы, type) — ЖЁСТКО (падение).
//   Жанры вне эталонного списка — МЯГКО (предупреждение, не валит сборку).
//
// Запуск локально:  node tools/validate-data.mjs
// В CI: .github/workflows/validate-data.yml (на push в data/games.json|movies.json).
//
// Новый жанр? Просто добавь строку в GAME_GENRES / MOVIE_GENRES ниже.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');

// --- Эталонные наборы жанров (по табам: игры и фильмы — разные словари) ---
const GAME_GENRES = new Set([
  'Головоломки', 'Инди', 'Казуальные', 'Кооп', 'Песочницы', 'Приключения/Квесты',
  'Симуляторы', 'Стратегии', 'Файтинги', 'Хорроры', 'Шутеры', 'Экшн', 'NSFW', 'Roguelike',
]);
const MOVIE_GENRES = new Set([
  'Аниме', 'Боевики', 'Детективы', 'Драмы', 'Комедии', 'Криминал', 'Мультфильмы',
  'Приключения', 'Сёнен', 'Триллеры', 'Ужасы', 'Фантастика', 'Фэнтези',
]);
const GAME_STATUS = new Set(['completed_stream', 'in_progress_stream', 'planning_stream', 'live_on_stream']);
const MOVIE_TYPE  = new Set(['movie', 'series']);

let errors = 0, warnings = 0;
// Формат GitHub-аннотаций: показывается прямо на файле в Actions/PR.
const err  = (file, msg) => { console.log(`::error file=data/${file}::${msg}`); errors++; };
const warn = (file, msg) => { console.log(`::warning file=data/${file}::${msg}`); warnings++; };
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isInt = (v) => Number.isInteger(v);

function load(file) {
  try { return JSON.parse(readFileSync(join(DATA_DIR, file), 'utf8')); }
  catch (e) { err(file, `Невалидный JSON: ${e.message}`); return null; }
}

function checkGenres(file, at, genres, whitelist) {
  if (!Array.isArray(genres) || genres.length === 0) { err(file, `${at}: genres должен быть непустым массивом`); return; }
  for (const g of genres) {
    if (!isStr(g)) { err(file, `${at}: жанр должен быть непустой строкой (сейчас ${JSON.stringify(g)})`); continue; }
    if (!whitelist.has(g)) warn(file, `${at}: незнакомый жанр «${g}» — опечатка? Если жанр новый, добавь его в tools/validate-data.mjs.`);
  }
}

function validateGames(arr) {
  const file = 'games.json';
  if (!Array.isArray(arr)) { err(file, 'Корень файла должен быть массивом'); return; }
  arr.forEach((it, i) => {
    const at = `[${i}] «${(it && it.title) || '?'}»`;
    if (typeof it !== 'object' || it === null) { err(file, `${at}: запись должна быть объектом`); return; }
    if (!isStr(it.title)) err(file, `${at}: поле title обязательно (непустая строка)`);
    if (!isStr(it.platform)) err(file, `${at}: поле platform обязательно`);
    if (!GAME_STATUS.has(it.status)) err(file, `${at}: status «${it.status}» вне набора: ${[...GAME_STATUS].join(' | ')}`);
    if (!isInt(it.rating) || it.rating < 0 || it.rating > 10) err(file, `${at}: rating — целое 0..10 (сейчас ${JSON.stringify(it.rating)})`);
    if (!isStr(it.coverLocal)) err(file, `${at}: поле coverLocal обязательно`);
    else if (!it.coverLocal.endsWith('.webp')) warn(file, `${at}: coverLocal «${it.coverLocal}» не оканчивается на .webp`);
    checkGenres(file, at, it.genres, GAME_GENRES);
    if (it.link !== undefined && !isStr(it.link)) err(file, `${at}: link должен быть строкой`);
    if (it.playlistUrl !== undefined && !isStr(it.playlistUrl)) err(file, `${at}: playlistUrl должен быть строкой`);
    if (it.coverUrl !== undefined && !isStr(it.coverUrl)) err(file, `${at}: coverUrl, если присутствует, должен быть строкой`);
  });
}

function validateMovies(arr) {
  const file = 'movies.json';
  if (!Array.isArray(arr)) { err(file, 'Корень файла должен быть массивом'); return; }
  arr.forEach((it, i) => {
    const at = `[${i}] «${(it && it.title) || '?'}»`;
    if (typeof it !== 'object' || it === null) { err(file, `${at}: запись должна быть объектом`); return; }
    // Запись с __comment — черновик, фронт её прячет (movies.filter(x => !x.__comment)).
    // Для неё не требуем posterLocal.
    const isDraft = it.__comment !== undefined;
    if (!isStr(it.title)) err(file, `${at}: поле title обязательно`);
    if (!MOVIE_TYPE.has(it.type)) err(file, `${at}: type «${it.type}» должен быть movie | series`);
    if (!isInt(it.rating) || it.rating < 0 || it.rating > 10) err(file, `${at}: rating — целое 0..10 (сейчас ${JSON.stringify(it.rating)})`);
    if (!isDraft && !isStr(it.posterLocal)) err(file, `${at}: поле posterLocal обязательно`);
    if (isStr(it.posterLocal) && !it.posterLocal.endsWith('.webp')) warn(file, `${at}: posterLocal «${it.posterLocal}» не оканчивается на .webp`);
    checkGenres(file, at, it.genres, MOVIE_GENRES);
    if (it.year !== undefined && !isInt(it.year)) err(file, `${at}: year должен быть целым числом`);
    if (it.seasons !== undefined && it.seasons !== null && !isInt(it.seasons)) err(file, `${at}: seasons должен быть целым числом или null`);
    if (it.posterUrl !== undefined && !isStr(it.posterUrl)) err(file, `${at}: posterUrl, если присутствует, должен быть строкой`);
  });
}

console.log('Проверка data/games.json и data/movies.json...\n');
const games = load('games.json');
const movies = load('movies.json');
if (games) validateGames(games);
if (movies) validateMovies(movies);

console.log(`\nИтог: ошибок — ${errors}, предупреждений — ${warnings}.`);
if (errors > 0) {
  console.log('❌ Валидация не пройдена: исправь структурные ошибки выше.');
  process.exit(1);
}
console.log(warnings > 0
  ? '✅ Структура валидна. Есть предупреждения по жанрам — проверь, не опечатки ли.'
  : '✅ Всё чисто.');
