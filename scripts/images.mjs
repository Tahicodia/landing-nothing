import { mkdir, readdir } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const SRC = 'images-src';
const OUT = 'src/assets/images';

const GROUPS = {
  work: { widths: [400, 800], ratio: 316 / 400 },
  journal: { widths: [150, 300], ratio: 1 },
};

const FORMATS = {
  avif: (img) => img.avif({ quality: 55 }),
  webp: (img) => img.webp({ quality: 75 }),
  jpg: (img) => img.flatten({ background: '#ffffff' }).jpeg({ quality: 80, mozjpeg: true }),
};

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => extname(f).toLowerCase() === '.svg');

if (files.length === 0) {
  console.error(`У папці ${SRC} немає SVG-файлів`);
  process.exit(1);
}

for (const file of files) {
  const name = basename(file, extname(file));
  const group = GROUPS[name.split('-')[0]];

  if (!group) {
    console.warn(`Пропускаю ${file}: невідомий префікс`);
    continue;
  }

  for (const width of group.widths) {
    const height = Math.round(width * group.ratio);

    for (const [ext, encode] of Object.entries(FORMATS)) {
      const image = sharp(join(SRC, file), { density: 300 }).resize(width, height, {
        fit: 'cover',
      });
      await encode(image).toFile(join(OUT, `${name}-${width}.${ext}`));
    }
  }

  console.log(`ok  ${name}`);
}
