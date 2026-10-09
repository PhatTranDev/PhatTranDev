import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { generatedAssetNames } from '../src/generators/assets.js';

const requiredSections = ['## Profile', '## Talents', '## Party Setup', '## Featured Projects', '## GitHub Activity'];

export async function validate(root = process.cwd()): Promise<void> {
  const readme = await readFile(resolve(root, 'README.md'), 'utf8');
  for (const section of requiredSections) if (!readme.includes(section)) throw new Error(`Missing required section: ${section}`);
  const refs = [...readme.matchAll(/(?:src=|\]\()([^)"\s]+(?:\.svg|\.png|\.jpg))/g)].map((match) => match[1]!);
  for (const ref of refs) await access(resolve(root, ref));
  for (const name of generatedAssetNames) {
    const svg = await readFile(resolve(root, 'assets', name), 'utf8');
    if (!svg.startsWith('<svg') || !svg.trimEnd().endsWith('</svg>')) throw new Error(`${name} is not a complete SVG document`);
    if (/<script\b|foreignObject/i.test(svg)) throw new Error(`${name} contains unsupported content`);
    if (!/viewBox="0 0 1000 \d+"/.test(svg)) throw new Error(`${name} has no responsive viewBox`);
    if (!/<title\b/.test(svg) || !/<desc\b/.test(svg)) throw new Error(`${name} lacks accessible metadata`);
  }
  console.log(`Validated ${generatedAssetNames.length} SVG assets, ${refs.length} local README references, and ${requiredSections.length} required sections.`);
}

if (import.meta.url === `file://${process.argv[1]}`) validate().catch((error) => { console.error(error); process.exitCode = 1; });
