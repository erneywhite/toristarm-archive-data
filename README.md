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
- [Валидация](#валидация)
- [Добавление записи](#добавление-записи)

---

## Структура репозитория

```
toristarm-archive-data/
├── data/
│   ├── games.json          # Список игр со стримов
│   ├── movies.json         # Список фильмов и сериалов
│   └── stream_status.json  # Текущий статус стримов (Twitch / Boosty)
├── tools/
│   └── validate-data.mjs   # Валидатор данных (Node, без зависимостей)
└── .github/workflows/
    └── validate-data.yml   # CI: проверка данных на push
```

---

## Схема данных

### games.json

```jsonc
{
  "title":       "Название игры",
  "platform":    "PC",
  "genres":      ["Жанр1", "Жанр2"],    // из словаря жанров игр (см. «Валидация»)
  "status":      "completed_stream",    // статус стрима (см. «Статусы»)
  "rating":      10,                    // целое 0–10, 0 = ещё не стримили
  "coverLocal":  "Filename.webp",       // локальная обложка (в assets/covers/ сайта)
  "link":        "https://...",         // Steam / itch.io (опционально)
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
  "genres":      ["Жанр1"],   // из словаря жанров фильмов (см. «Валидация»)
  "rating":      9,           // целое 0–10
  "posterLocal": "Filename.webp"
}
```

> [!NOTE]
> Внешние `coverUrl` / `posterUrl` — опциональный устаревший фоллбэк. В данных
> больше не используются (все обложки локальные); валидатор их допускает, но в
> новые записи их добавлять не нужно.

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

## Валидация

Каждый push, меняющий `data/games.json` или `data/movies.json`, запускает GitHub
Action ([`validate-data.yml`](.github/workflows/validate-data.yml)) — он прогоняет
[`tools/validate-data.mjs`](tools/validate-data.mjs).

- **Жёстко** (сборка падает, красный ✗ + письмо): невалидный JSON, отсутствие
  обязательных полей, неверные типы, `rating` вне 0–10, неизвестный `status`
  (игры) или `type` (фильмы).
- **Мягко** (предупреждение, сборку не валит): жанр вне словаря — вероятная опечатка.

Локально, без установки зависимостей:
```bash
node tools/validate-data.mjs
```

### Словарь жанров

Игры и фильмы используют **разные** наборы (фильтр на сайте строится отдельно по табам).

- **Игры:** Головоломки, Инди, Казуальные, Кооп, Песочницы, Приключения/Квесты, Симуляторы, Стратегии, Файтинги, Хорроры, Шутеры, Экшн, NSFW, Roguelike.
- **Фильмы:** Аниме, Боевики, Детективы, Драмы, Комедии, Криминал, Мультфильмы, Приключения, Сёнен, Триллеры, Ужасы, Фантастика, Фэнтези.

Новый жанр → добавить строку в нужный набор в `tools/validate-data.mjs`.

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
  "coverLocal":  "Название-файла.webp",
  "link":        "https://store.steampowered.com/app/XXXXX/"
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
  "posterLocal": "Название-файла.webp"
}
```

> [!NOTE]
> Поле `playlistUrl` в играх опционально — добавляется после того, как плейлист на YouTube создан.
> Записи с `__comment` в `movies.json` скрыты на сайте намеренно.

---

<p align="center">Made by ErneyWhite</p>
