import { mkdir, writeFile } from 'node:fs/promises';

const KEY = 'xIVUXiPZ3hdpEFiIC0qbTL';
const TOKEN = process.env.FIGMA_TOKEN;

if (!TOKEN) {
  console.error('Задай токен: FIGMA_TOKEN=... npm run figma');
  process.exit(1);
}

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

async function download(items, format, scale, dir) {
  const ids = Object.values(items).map((v) => (Array.isArray(v) ? v[0] : v));
  const url = `https://api.figma.com/v1/images/${KEY}?ids=${ids.join(',')}&format=${format}&scale=${scale}`;
  const res = await fetch(url, { headers: { 'X-Figma-Token': TOKEN } });
  const { images, err } = await res.json();

  if (err) throw new Error(err);

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
