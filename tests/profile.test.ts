import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { generators } from '../src/generators/assets.js';
import { readme } from '../src/generators/readme.js';
import type { Profile } from '../src/types.js';

const profile = JSON.parse(readFileSync(new URL('../data/profile.json', import.meta.url), 'utf8')) as Profile;

describe('profile generator', () => {
  it('generates every SVG without unsupported GitHub content', () => {
    const output = generators(profile, process.cwd());
    expect(Object.keys(output)).toEqual(['hero.svg', 'hero-static.svg']);
    for (const svg of Object.values(output)) {
      expect(svg).toMatch(/^<svg/); expect(svg).toMatch(/<\/svg>\n$/);
      expect(svg).not.toMatch(/<script\b|foreignObject/i);
    }
  });

  it('propagates configuration into the generated README and hero', () => {
    const changed = { ...profile, displayName: 'Config Test Name' } as Profile;
    expect(readme(changed)).toContain('Config Test Name');
    expect(generators(changed, process.cwd())['hero.svg']).toContain('Config Test Name');
  });

  it('keeps unknown project repositories non-clickable', () => {
    expect(readme(profile)).not.toContain('](http');
  });

  it('keeps professional content available as readable Markdown', () => {
    const output = readme(profile);
    expect(output).toContain(profile.summary);
    expect(output).toContain('## Core Stack');
    expect(output).toContain('**Speech-Driven 3D Avatar**');
    expect(output).not.toContain('Party Setup');
  });
});
