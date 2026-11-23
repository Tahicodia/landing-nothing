import { mkdir, readdir } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';

const SRC = 'images-src';
const OUT = 'src/assets/images';

const WIDTHS = {
  hero: [640, 1280, 2520],
  banner: [640, 1280, 2520],
  product: [560, 1200],
  category: [260, 784, 1344],
};

const FORMATS = {
  avif: (img) => img.avif({ quality: 55 }),
  webp: (img) => img.webp({ quality: 75 }),
  jpg: (img) => img.jpeg({ quality: 80, mozjpeg: true }),
};

await mkdir(OUT, { recursive: true });

const files = (await readdir(SRC)).filter((f) => extname(f) === '.png');

for (const file of files) {
  const name = basename(file, '.png');
  const widths = WIDTHS[name.split('-')[0]];

  if (!widths) {
    console.warn(`Пропускаю ${file}`);
    continue;
  }

  for (const width of widths) {
    for (const [ext, encode] of Object.entries(FORMATS)) {
      const image = sharp(join(SRC, file)).resize({ width, withoutEnlargement: true });
      await encode(image).toFile(join(OUT, `${name}-${width}.${ext}`));
    }
  }

  console.log('ok ', name);
}
