import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Profile } from '../src/types.js';
import { generators } from '../src/generators/assets.js';
import { readme } from '../src/generators/readme.js';

export async function build(root = process.cwd()): Promise<void> {
  const profile = JSON.parse(await readFile(resolve(root, 'data/profile.json'), 'utf8')) as Profile;
  await mkdir(resolve(root, 'assets'), { recursive: true });
  await Promise.all(Object.entries(generators(profile, root)).map(([name, content]) => writeFile(resolve(root, 'assets', name), content)));
  await writeFile(resolve(root, 'README.md'), readme(profile));
}

if (import.meta.url === `file://${process.argv[1]}`) build().catch((error) => { console.error(error); process.exitCode = 1; });
