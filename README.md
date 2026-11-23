# Keepsake — design agency landing

Лендінг дизайн-агенції Keepsake. Це перенесення сторінки з лабораторної роботи 7 на сучасний стек: Pug + SCSS + Vite. Дизайн і поведінка не змінилися.

**Демо:** https://tahicodia.github.io/ЗАМІНИ-НА-НАЗВУ-РЕПОЗИТОРІЮ/
**Репозиторій:** https://github.com/tahicodia/ЗАМІНИ-НА-НАЗВУ-РЕПОЗИТОРІЮ

## Технології

- **Vite** — збірка та dev-сервер
- **Pug** (`vituum` + `@vituum/vite-plugin-pug`) — шаблони, міксини, дані окремо від розмітки
- **SCSS** — `@use`/`@forward`, змінні та карти, міксини, BEM, mobile-first
- **PostCSS + Autoprefixer + Browserslist** — префікси за списком браузерів
- **sharp** — оптимізація зображень (AVIF, WebP, JPEG)
- **Prettier, Stylelint, husky, lint-staged** — якість коду
- **GitHub Actions + GitHub Pages** — автоматичний деплой

## Структура проєкту

```
src/
  layouts/      каркас сторінки
  pages/        сторінки (index.pug)
  includes/     meta, шрифти
  data/         дані: навігація, роботи, послуги, статистика, журнал…
  mixins/       btn, icon, picture, work-card, socials…
  components/   header, footer, секції
  styles/
    utils/      змінні, брейкпоінти, функції, міксини
    base/       :root, reset, типографіка
    layout/     container, section
    components/ стилі компонентів (BEM)
scripts/images.mjs   генерація зображень
images-src/          вихідні SVG
```

## Команди

| Команда            | Що робить                                                   |
| ------------------ | ----------------------------------------------------------- |
| `npm install`      | встановлює залежності                                       |
| `npm run dev`      | dev-сервер на `localhost:5173`                              |
| `npm run build`    | збирає сайт у `dist`                                        |
| `npm run preview`  | показує зібраний сайт на `localhost:4173`                   |
| `npm run images`   | генерує AVIF/WebP/JPEG з `images-src` у `src/assets/images` |
| `npm run lint:css` | перевіряє SCSS Stylelint                                    |
| `npm run format`   | форматує код Prettier                                       |

## Оптимізація зображень

Скрипт `scripts/images.mjs` перетворює SVG з `images-src` на растрові файли двох розмірів і трьох форматів: AVIF, WebP, JPEG. Роботи — 400 і 800 px, журнал — 150 і 300 px. На сторінці вони підключаються міксином `picture` через `<picture>` з `srcset` та `sizes`, JPEG — запасний варіант. Зображення нижче першого екрана мають `loading="lazy"`.

## Якість коду

- **Prettier** форматує JS, JSON, MD і SCSS.
- **Stylelint** (`stylelint-config-standard-scss`) перевіряє SCSS: BEM-назви класів, без `id` і `!important`, вкладеність до 3 рівнів.
- **husky + lint-staged** запускають перевірки перед кожним комітом лише для змінених файлів.

## Підтримка браузерів

Список браузерів задано у `.browserslistrc`:

```
> 0.5%
last 2 versions
not dead
```

## Деплой

Сайт публікується на GitHub Pages через GitHub Actions (`.github/workflows/deploy.yml`) після кожного пушу в `main`. У `vite.config.js` задано `base: './'`, тому сайт працює в підпапці репозиторію.
