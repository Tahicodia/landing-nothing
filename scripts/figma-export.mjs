import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const KEY = 'xIVUXiPZ3hdpEFiIC0qbTL';
const TOKEN = process.env.FIGMA_TOKEN;
const HEADERS = { 'X-Figma-Token': TOKEN };

if (!TOKEN) {
  console.error('Задай токен: FIGMA_TOKEN=... npm run figma');
  process.exit(1);
}

// Фото, які в макеті обрізані, експортуємо як вузли: [id, scale]
const PHOTOS = {
  hero: ['6817:205', 2],
  banner: ['6807:295', 2],
  'product-1': ['6807:252', 4],
  'product-2': ['6807:257', 4],
  'product-3': ['6807:262', 4],
  'category-1': ['6808:334', 3],
  'category-2': ['6808:336', 3],
  'category-3': ['6808:338', 3],
  'category-4': ['6808:340', 3],
  'category-5': ['6808:342', 3],
  'category-6': ['6808:344', 3],
};

const SVGS = {
  logo: '6803:710',
  phone: '6802:360',
  burger: '6802:361',
  close: '6802:363',
};

const FORCE = process.argv.includes('--force');
const missing = (file) => FORCE || !existsSync(file);

// Figma має ліміт запитів: при 429 чекаємо і пробуємо ще раз
const api = async (url, attempt = 1) => {
  const res = await fetch(url, { headers: HEADERS });

  if (res.status === 429 && attempt <= 5) {
    const wait = Number(res.headers.get('retry-after')) || 60;
    console.log(`Ліміт Figma, чекаю ${wait} с...`);
    await new Promise((resolve) => setTimeout(resolve, wait * 1000));

    return api(url, attempt + 1);
  }

  const json = await res.json();

  if (json.err || json.error) throw new Error(json.err || json.message);

  return json;
};

async function download(allItems, format, scale, dir) {
  const items = Object.fromEntries(
    Object.entries(allItems).filter(([name]) => missing(`${dir}/${name}.${format}`))
  );

  if (!Object.keys(items).length) return;

  const ids = Object.values(items).map((v) => (Array.isArray(v) ? v[0] : v));
  const { images } = await api(
    `https://api.figma.com/v1/images/${KEY}?ids=${ids.join(',')}&format=${format}&scale=${scale}`
  );

  await mkdir(dir, { recursive: true });

  for (const [name, value] of Object.entries(items)) {
    const id = Array.isArray(value) ? value[0] : value;
    const file = await fetch(images[id]);
    await writeFile(`${dir}/${name}.${format}`, Buffer.from(await file.arrayBuffer()));
    console.log('ok ', `${name}.${format}`);
  }
}

const groups = Object.groupBy(Object.entries(PHOTOS), ([, [, scale]]) => scale);

for (const [scale, entries] of Object.entries(groups)) {
  await download(Object.fromEntries(entries), 'png', scale, 'images-src');
}

await download(SVGS, 'svg', 1, 'src/assets/icons');
