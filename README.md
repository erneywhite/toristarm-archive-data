<h1 align="center">Toristarm Archive Data</h1>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT"></a>
  <img src="https://img.shields.io/badge/Игр-28-brightgreen" alt="28 games">
  <img src="https://img.shields.io/badge/Фильмов%2FСериалов-17-orange" alt="17 movies">
  <img src="https://img.shields.io/badge/Формат-JSON-yellow" alt="JSON">
</p>

<p align="center">Данные для сайта-архива стримов <strong>Toristarm</strong>. Содержит информацию об играх и фильмах/сериалах: статус просмотра, оценки, жанры, ссылки на плейлисты YouTube.</p>

---

## Содержание

- [Структура репозитория](#структура-репозитория)
- [Схема данных](#схема-данных)
- [Статусы](#статусы)
- [Игры](#игры)
- [Фильмы и сериалы](#фильмы-и-сериалы)

---

## Структура репозитория

```
toristarm-archive-data/
└── data/
    ├── games.json    # Список игр со стримов
    └── movies.json   # Список фильмов и сериалов
```

---

## Схема данных

### games.json

```jsonc
{
  "title":       "Название игры",
  "platform":    "PC",
  "genres":      ["Жанр1", "Жанр2"],
  "status":      "completed_stream",   // статус стрима
  "rating":      10,                    // 0–10, 0 = ещё не стримили
  "link":        "https://...",         // ссылка на Steam / itch.io
  "coverLocal":  "Filename.webp",       // локальный файл обложки
  "coverUrl":    "https://...",         // внешняя ссылка на обложку
  "playlistUrl": "https://youtube..."   // плейлист YouTube (опционально)
}
```

### movies.json

```jsonc
{
  "title":       "Название",
  "year":        1999,
  "type":        "movie",     // movie | series
  "seasons":     null,        // null для фильмов, число для сериалов
  "genres":      ["Жанр1"],
  "rating":      9,
  "posterLocal": "Filename.webp",
  "posterUrl":   "https://..."
}
```

---

## Статусы

| Статус | Описание |
|--------|----------|
| `completed_stream` | Стрим завершён |
| `in_progress_stream` | Стрим идёт сейчас / в процессе |
| `planning_stream` | Запланировано, стрима ещё не было (rating = 0) |

---

## Игры

### ▶ В процессе

| Название | Жанры | Оценка |
|----------|-------|--------|
| [Stardew Valley](https://store.steampowered.com/app/413150/) | Песочницы, Симуляторы, Казуальные | ⭐ 9 |
| [RV There Yet?](https://store.steampowered.com/app/3949040/) | Roguelike, Приключения, Казуальные, Кооп | ⭐ 8 |
| [Mewgenics](https://store.steampowered.com/app/686060/) | Приключения, Roguelike, Стратегии | ⭐ 9 |

### ✅ Пройдено

| Название | Жанры | Оценка | Плейлист |
|----------|-------|--------|----------|
| [Quarantine Zone: The Last Check](https://store.steampowered.com/app/3419520/) | Симуляторы, Приключения | ⭐ 8 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OZBcBJQbbuWgkrZcnZsQHAn) |
| [Terraria](https://store.steampowered.com/app/105600/) | Экшн, Приключения | ⭐ 7 | — |
| [Noita](https://store.steampowered.com/app/881100/) | Экшн, Приключения, Симуляторы | ⭐ 7 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OY76OntimvSzqlKrvVYRTzP) |
| [The Long Dark](https://store.steampowered.com/app/305620/) | Экшн, Приключения, Симуляторы | ⭐ 8 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYmBJtm4fVZo49Zk-ya5RZU) |
| [Helltaker](https://store.steampowered.com/app/1289310/) | Головоломки, Приключения | ⭐ 10 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYgWHDRHkAQLmg6kfMthVOu) |
| [Bendy and the Ink Machine](https://store.steampowered.com/app/622650/) | Головоломки, Приключения | ⭐ 9 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OZDGuOHpS7ww4Ae89yNVGdc) |
| [We Were Here Together](https://store.steampowered.com/app/865360/) | Головоломки, Приключения, Кооп | ⭐ 10 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYFCjvyUnQ-Gy0LuxmWaTWf) |
| [Voices of the Void](https://mrdrnose.itch.io/votv) | Симуляторы, Хорроры | ⭐ 10 | — |
| [Raft](https://store.steampowered.com/app/648800/) | Симуляторы, Приключения, Экшн | ⭐ 9 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9Oaersr6FG5RV7l861kjBSss) |
| [Kiosk](https://store.steampowered.com/app/3126330/) | Симуляторы, Приключения, Хорроры | ⭐ 4 | — |
| [The Boba Teashop](https://store.steampowered.com/app/3461920/) | Симуляторы, Приключения, Хорроры | ⭐ 5 | — |
| [Subnautica](https://store.steampowered.com/app/264710/) | Симуляторы, Приключения, Экшн | ⭐ 8 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9ObCoFqAF6AlbMtKKN33uT2h) |
| [Perfume Atelier](https://store.steampowered.com/app/3962270/) | Roguelike, Казуальные | ⭐ 7 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYgWHDRHkAQLmg6kfMthVOu) |
| [Cats & Cups](https://store.steampowered.com/app/3521410/) | Roguelike, Казуальные | ⭐ 9 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYgWHDRHkAQLmg6kfMthVOu) |
| [Souper Game](https://store.steampowered.com/app/3181790/) | Казуальные, NSFW | ⭐ 6 | — |
| [KLETKA](https://store.steampowered.com/app/1699480/) | Roguelike, Приключения, Кооп | ⭐ 7 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYFCjvyUnQ-Gy0LuxmWaTWf) |
| [We Escaped a Twisted Game](https://store.steampowered.com/app/2524930/) | Головоломки, Кооп | ⭐ 9 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYFCjvyUnQ-Gy0LuxmWaTWf) |
| [Buckshot Roulette](https://store.steampowered.com/app/2835570/) | Roguelike, Кооп | ⭐ 9 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYFCjvyUnQ-Gy0LuxmWaTWf) |
| [SIDE EFFECTS](https://store.steampowered.com/app/3799100/) | Roguelike, Кооп | ⭐ 8 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYFCjvyUnQ-Gy0LuxmWaTWf) |
| [We Were Here Expeditions: The FriendShip](https://store.steampowered.com/app/2296990/) | Головоломки, Приключения, Кооп | ⭐ 10 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYFCjvyUnQ-Gy0LuxmWaTWf) |
| [Abiotic Factor](https://store.steampowered.com/app/427410/) | Приключения, Симуляторы, Экшн, Кооп | ⭐ 10 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OZQa3Um9m2sBEfuIfHEfVIr) |
| [We Were Here Forever](https://store.steampowered.com/app/1341290/) | Головоломки, Приключения, Кооп | ⭐ 6 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OYFCjvyUnQ-Gy0LuxmWaTWf) |
| [Warhammer 40,000: Space Marine 2](https://store.steampowered.com/app/2183900/) | Приключения, Шутеры, Экшн, Кооп | ⭐ 10 | [▶](https://www.youtube.com/playlist?list=PLqoY6Mxmg9OaYxlDnoHJDv5qviD3tfqg2) |
| [7 Days to Die](https://store.steampowered.com/app/251570/) | Симуляторы, Шутеры, Песочницы, Экшн | ⭐ 7 | — |

### 🕐 Запланировано

| Название | Жанры |
|----------|-------|
| [The Mortuary Assistant](https://store.steampowered.com/app/1295920/) | Симуляторы, Приключения |
| [RimWorld](https://store.steampowered.com/app/294100/) | Симуляторы, Стратегии |

---

## Фильмы и сериалы

### 🎬 Фильмы

| Название | Год | Жанры | Оценка |
|----------|-----|-------|--------|
| Маска | 1994 | Комедии, Боевики, Криминал | ⭐ 10 |
| Братья из Гримсби | 2016 | Комедии, Боевики, Приключения | ⭐ 10 |
| Голый пистолет | 1988 | Комедии, Криминал | ⭐ 10 |
| Зеленая миля | 1999 | Драмы, Детективы, Криминал | ⭐ 9 |
| Интерстеллар | 2014 | Драмы, Фантастика, Приключения | ⭐ 10 |
| Майор Пэйн | 1995 | Комедии | ⭐ 9 |
| Бойцовский клуб | 1999 | Драмы, Криминал | ⭐ 9 |
| Реквием по мечте | 2000 | Драмы | ⭐ 8 |
| Властелин колец: Братство кольца | 2001 | Боевики, Приключения, Фэнтези | ⭐ 9 |
| Властелин колец: Две крепости | 2002 | Боевики, Приключения, Фэнтези | ⭐ 9 |
| Властелин колец: Возвращение Короля | 2003 | Боевики, Приключения, Фэнтези | ⭐ 9 |
| Крысиные бега | 2001 | Комедии, Приключения | ⭐ 10 |
| Рататуй | 2007 | Комедии, Приключения, Фэнтези, Мультфильмы | ⭐ 10 |
| Монстр в Париже | 2011 | Комедии, Приключения, Фэнтези, Мультфильмы | ⭐ 10 |

### 📺 Сериалы и аниме

| Название | Год | Сезонов | Жанры | Оценка |
|----------|-----|---------|-------|--------|
| Становясь волшебницей | 2024 | 1 | Аниме, Приключения, Фэнтези | ⭐ 8 |
| Маг-целитель: Новый старт | 2021 | 1 | Аниме, Приключения, Фэнтези | ⭐ 8 |

---

## Добавление записи

**Игра** — добавить объект в `data/games.json`:
```jsonc
{
  "title":       "Название",
  "platform":    "PC",
  "genres":      ["Жанр"],
  "status":      "planning_stream",  // completed_stream | in_progress_stream | planning_stream
  "rating":      0,                  // 0 если ещё не стримили
  "link":        "https://store.steampowered.com/app/XXXXX/",
  "coverLocal":  "Название-файла.webp",
  "coverUrl":    "https://..."
}
```

**Фильм/сериал** — добавить объект в `data/movies.json`:
```jsonc
{
  "title":       "Название",
  "year":        2025,
  "type":        "movie",   // movie | series
  "seasons":     null,      // null для фильма, число для сериала
  "genres":      ["Жанр"],
  "rating":      0,
  "posterLocal": "Название-файла.webp",
  "posterUrl":   "https://..."
}
```

> [!NOTE]
> Поле `playlistUrl` в играх опционально — добавляется после того, как плейлист на YouTube создан.
> Записи с `__comment` в `movies.json` скрыты на сайте намеренно.

---

<p align="center">Made by ErneyWhite</p>
