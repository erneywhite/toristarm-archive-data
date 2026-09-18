#!/usr/bin/env node
// Валидация данных архива Toristarm.
//   Структура (типы, обязательные поля, рейтинг, статусы, type) — ЖЁСТКО (падение).
//   Жанры вне словаря — МЯГКО (предупреждение, не валит сборку).
//
// Запуск локально:  node tools/validate-data.mjs
// В CI: .github/workflows/validate-data.yml (на push в data/games.json|movies.json|genres.json).
//
// Новый жанр? Добавь строку в data/genres.json.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');

const GAME_STATUS = new Set(['completed_stream', 'in_progress_stream', 'planning_stream', 'live_on_stream']);
const MOVIE_TYPE  = new Set(['movie', 'series']);
// id — постоянный slug карточки: латиница в нижнем регистре, цифры, дефисы между словами
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let errors = 0, warnings = 0;
// Формат GitHub-аннотаций: показывается прямо на файле в Actions/PR.
const err  = (file, msg) => { console.log(`::error file=data/${file}::${msg}`); errors++; };
const warn = (file, msg) => { console.log(`::warning file=data/${file}::${msg}`); warnings++; };
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isInt = (v) => Number.isInteger(v);
// Дата YYYY-MM-DD, причём настоящая: 2026-02-30 не пройдёт
const isDate = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)
  && !Number.isNaN(Date.parse(`${v}T00:00:00Z`))
  && new Date(`${v}T00:00:00Z`).toISOString().slice(0, 10) === v;

function load(file) {
  let text;
  try { text = readFileSync(join(DATA_DIR, file), 'utf8'); }
  catch (e) { err(file, e.code === 'ENOENT' ? 'Файл не найден' : `Не читается: ${e.message}`); return null; }
  try { return JSON.parse(text); }
  catch (e) { err(file, `Невалидный JSON: ${e.message}`); return null; }
}

// Словарь жанров: {"games": [...], "movies": [...]}.
// Если словарь сломан, жанры карточек не сверяем — хватит одной ошибки про сам словарь.
function loadGenres() {
  const file = 'genres.json';
  const dict = load(file);
  const sets = { games: null, movies: null };
  if (dict === null) return sets;
  if (typeof dict !== 'object' || Array.isArray(dict)) { err(file, 'Корень файла должен быть объектом {"games": [...], "movies": [...]}'); return sets; }
  for (const tab of ['games', 'movies']) {
    const list = dict[tab];
    if (!Array.isArray(list) || list.length === 0) { err(file, `${tab}: должен быть непустым массивом жанров`); continue; }
    sets[tab] = new Set();
    for (const g of list) {
      if (!isStr(g)) { err(file, `${tab}: жанр должен быть непустой строкой (сейчас ${JSON.stringify(g)})`); continue; }
      if (sets[tab].has(g)) warn(file, `${tab}: жанр «${g}» записан дважды`);
      sets[tab].add(g);
    }
  }
  return sets;
}

function checkGenres(file, at, genres, whitelist) {
  if (!Array.isArray(genres) || genres.length === 0) { err(file, `${at}: genres должен быть непустым массивом`); return; }
  for (const g of genres) {
    if (!isStr(g)) { err(file, `${at}: жанр должен быть непустой строкой (сейчас ${JSON.stringify(g)})`); continue; }
    if (whitelist && !whitelist.has(g)) warn(file, `${at}: незнакомый жанр «${g}» — опечатка? Если жанр новый, добавь его в data/genres.json.`);
  }
}

// Поля, которые появятся при переезде на админку. Пока необязательны,
// но если уже есть — должны быть правильными.
function checkId(file, at, id, seen) {
  if (id === undefined) return;
  if (typeof id !== 'string' || !SLUG.test(id)) { err(file, `${at}: id «${id}» — только латиница в нижнем регистре, цифры и дефисы`); return; }
  if (seen.has(id)) err(file, `${at}: id «${id}» уже занят записью ${seen.get(id)}`);
  else seen.set(id, at);
}

function checkDate(file, at, name, value, nullable) {
  if (value === undefined) return;
  if (value === null && nullable) return;
  if (!isDate(value)) err(file, `${at}: ${name} — дата в формате YYYY-MM-DD${nullable ? ' или null' : ''} (сейчас ${JSON.stringify(value)})`);
}

function validateGames(arr, genres) {
  const file = 'games.json';
  if (!Array.isArray(arr)) { err(file, 'Корень файла должен быть массивом'); return; }
  const ids = new Map();
  arr.forEach((it, i) => {
    const at = `[${i}] «${(it && it.title) || '?'}»`;
    if (typeof it !== 'object' || it === null) { err(file, `${at}: запись должна быть объектом`); return; }
    checkId(file, at, it.id, ids);
    if (!isStr(it.title)) err(file, `${at}: поле title обязательно (непустая строка)`);
    if (!isStr(it.platform)) err(file, `${at}: поле platform обязательно`);
    if (!GAME_STATUS.has(it.status)) err(file, `${at}: status «${it.status}» вне набора: ${[...GAME_STATUS].join(' | ')}`);
    if (!isInt(it.rating) || it.rating < 0 || it.rating > 10) err(file, `${at}: rating — целое 0..10 (сейчас ${JSON.stringify(it.rating)})`);
    if (!isStr(it.coverLocal)) err(file, `${at}: поле coverLocal обязательно`);
    else if (!it.coverLocal.endsWith('.webp')) warn(file, `${at}: coverLocal «${it.coverLocal}» не оканчивается на .webp`);
    checkGenres(file, at, it.genres, genres);
    if (it.link !== undefined && !isStr(it.link)) err(file, `${at}: link должен быть строкой`);
    if (it.playlistUrl !== undefined && !isStr(it.playlistUrl)) err(file, `${at}: playlistUrl должен быть строкой`);
    if (it.coverUrl !== undefined && !isStr(it.coverUrl)) err(file, `${at}: coverUrl, если присутствует, должен быть строкой`);
    checkDate(file, at, 'addedAt', it.addedAt, false);
    checkDate(file, at, 'startedAt', it.startedAt, true);
    checkDate(file, at, 'completedAt', it.completedAt, true);
  });
}

function validateMovies(arr, genres) {
  const file = 'movies.json';
  if (!Array.isArray(arr)) { err(file, 'Корень файла должен быть массивом'); return; }
  const ids = new Map();
  arr.forEach((it, i) => {
    const at = `[${i}] «${(it && it.title) || '?'}»`;
    if (typeof it !== 'object' || it === null) { err(file, `${at}: запись должна быть объектом`); return; }
    // Запись с __comment — черновик, фронт её прячет (movies.filter(x => !x.__comment)).
    // Для неё не требуем posterLocal.
    const isDraft = it.__comment !== undefined;
    checkId(file, at, it.id, ids);
    if (!isStr(it.title)) err(file, `${at}: поле title обязательно`);
    if (!MOVIE_TYPE.has(it.type)) err(file, `${at}: type «${it.type}» должен быть movie | series`);
    if (!isInt(it.rating) || it.rating < 0 || it.rating > 10) err(file, `${at}: rating — целое 0..10 (сейчас ${JSON.stringify(it.rating)})`);
    if (!isDraft && !isStr(it.posterLocal)) err(file, `${at}: поле posterLocal обязательно`);
    if (isStr(it.posterLocal) && !it.posterLocal.endsWith('.webp')) warn(file, `${at}: posterLocal «${it.posterLocal}» не оканчивается на .webp`);
    checkGenres(file, at, it.genres, genres);
    if (it.year !== undefined && !isInt(it.year)) err(file, `${at}: year должен быть целым числом`);
    if (it.seasons !== undefined && it.seasons !== null && !isInt(it.seasons)) err(file, `${at}: seasons должен быть целым числом или null`);
    if (it.posterUrl !== undefined && !isStr(it.posterUrl)) err(file, `${at}: posterUrl, если присутствует, должен быть строкой`);
    checkDate(file, at, 'addedAt', it.addedAt, false);
  });
}

console.log('Проверка data/genres.json, data/games.json и data/movies.json...\n');
const genres = loadGenres();
const games = load('games.json');
const movies = load('movies.json');
if (games) validateGames(games, genres.games);
if (movies) validateMovies(movies, genres.movies);

console.log(`\nИтог: ошибок — ${errors}, предупреждений — ${warnings}.`);
if (errors > 0) {
  console.log('❌ Валидация не пройдена: исправь структурные ошибки выше.');
  process.exit(1);
}
console.log(warnings > 0
  ? '✅ Структура валидна. Есть предупреждения по жанрам — проверь, не опечатки ли.'
  : '✅ Всё чисто.');
