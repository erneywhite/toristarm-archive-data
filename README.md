<h1 align="center">Toristarm Archive Data</h1>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT"></a>
  <img src="https://img.shields.io/badge/Формат-JSON-yellow" alt="JSON">
</p>

<p align="center">Данные для сайта-архива стримов <strong>Toristarm</strong>. Содержит информацию об играх, фильмах/сериалах, а также текущий статус стримов на Twitch и Boosty: статус просмотра, оценки, жанры, ссылки на плейлисты YouTube.</p>

---

## Содержание

- [Структура репозитория](#структура-репозитория)
- [Схема данных](#схема-данных)
- [Статусы](#статусы)
- [Статус стримов](#статус-стримов)
- [Добавление записи](#добавление-записи)

---

## Структура репозитория

```
toristarm-archive-data/
└── data/
    ├── games.json          # Список игр со стримов
    ├── movies.json         # Список фильмов и сериалов
    └── stream_status.json  # Текущий статус стримов (Twitch / Boosty)
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

### stream_status.json

```jsonc
{
  "twitch_live": false,   // true = стрим идёт на Twitch
  "boosty_live": false    // true = стрим идёт на Boosty
}
```

---

## Статусы

| Статус | Описание |
|--------|----------|
| `live_on_stream` | Стрим идёт сейчас |
| `completed_stream` | Стримы по игре завершены |
| `in_progress_stream` | Игра в процессе |
| `planning_stream` | Запланировано, стрима ещё не было (rating = 0) |

---

## Статус стримов

Файл `data/stream_status.json` хранит текущее состояние эфиров на платформах **Twitch** и **Boosty**. Используется сайтом Toristarm для отображения индикатора «В эфире».

| Поле | Тип | Описание |
|------|-----|----------|
| `twitch_live` | `boolean` | `true` — стрим идёт на Twitch, `false` — не в эфире |
| `boosty_live` | `boolean` | `true` — стрим идёт на Boosty, `false` — не в эфире |

Статус обновляется автоматически через [Telegram-бот](https://github.com/erneywhite/toristarm-stream-bot) — при нажатии inline-кнопки бот пушит изменённый JSON через GitHub API.

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
