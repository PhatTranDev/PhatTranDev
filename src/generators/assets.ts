import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import type { Profile } from '../types.js';
import { escapeXml, panelHeader, svgShell } from '../utils/svg.js';

function mimeFor(path: string): string {
  return extname(path).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
}

function wrappedText(text: string, max: number): string[] {
  const words = text.split(/\s+/); const lines: string[] = []; let line = '';
  for (const word of words) {
    if (`${line} ${word}`.trim().length > max) { if (line) lines.push(line); line = word; }
    else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line);
  return lines;
}

export function hero(profile: Profile, root: string, animated = true): string {
  const avatar = readFileSync(`${root}/${profile.avatar.path}`).toString('base64');
  const dataUri = `data:${mimeFor(profile.avatar.path)};base64,${avatar}`;
  const particles = Array.from({ length: profile.animation.particleCount }, (_, i) => {
    const x = 405 + ((i * 71) % 540); const y = 36 + ((i * 47) % 280); const r = 1.2 + (i % 3) * .7;
    return `<circle class="particle p${i % 4}" cx="${x}" cy="${y}" r="${r}" fill="${i % 2 ? '#D8A6BF' : '#C9B58A'}" opacity=".55"/>`;
  }).join('');
  const style = animated && profile.animation.enabled ? `<style>
    .particle{animation:drift 8s ease-in-out infinite;transform-box:fill-box;transform-origin:center}.p1{animation-delay:-2s}.p2{animation-delay:-4s}.p3{animation-delay:-6s}.halo{animation:breathe 7s ease-in-out infinite}
    @keyframes drift{0%,100%{transform:translateY(0);opacity:.25}50%{transform:translateY(-12px);opacity:.8}}@keyframes breathe{0%,100%{opacity:.18}50%{opacity:.36}}
    @media (prefers-reduced-motion:reduce){.particle,.halo{animation:none}}
  </style>` : '';
  return svgShell(360, `${profile.displayName} — ${profile.role}`, `
    ${style}<rect x="22" y="22" width="956" height="316" rx="20" fill="url(#surface)"/>
    <circle class="halo" cx="194" cy="180" r="148" fill="#D8A6BF" opacity=".2" filter="url(#softGlow)"/>
    <clipPath id="portraitClip"><rect x="40" y="40" width="300" height="280" rx="18"/></clipPath>
    <image href="${dataUri}" x="40" y="40" width="300" height="450" preserveAspectRatio="xMidYMid slice" clip-path="url(#portraitClip)"/>
    <rect x="40" y="40" width="300" height="280" rx="18" fill="none" stroke="url(#accent)" stroke-width="2"/>
    <path d="M40 82V40h42M298 40h42v42M40 278v42h42M298 320h42v-42" fill="none" stroke="#C9B58A" stroke-width="2"/>
    ${particles}
    <text x="390" y="88" fill="#C9B58A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" letter-spacing="4">AI SYSTEMS / ENGINEERING</text>
    <text x="387" y="154" fill="#F3EFF7" font-family="Georgia,Times New Roman,serif" font-size="52">${escapeXml(profile.displayName)}</text>
    <text x="390" y="194" fill="#D8A6BF" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="20" font-weight="600">${escapeXml(profile.role)}</text>
    <text x="390" y="238" fill="#B8BACB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="17">${escapeXml(profile.tagline)}</text>
    <line x1="390" y1="263" x2="930" y2="263" stroke="#44445E"/>
    <text x="390" y="298" fill="#A99BCB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13.5" letter-spacing="1">${escapeXml(profile.keywords.join('  ·  '))}</text>
  `);
}

export function about(profile: Profile): string {
  const lines = wrappedText(profile.summary, 88).slice(0, 3);
  return svgShell(220, 'About Gia Phat', `${panelHeader('01', 'About', 'Building useful intelligence')}
    <rect x="42" y="116" width="5" height="70" rx="2.5" fill="url(#accent)"/>
    ${lines.map((line, i) => `<text x="68" y="${133 + i * 25}" fill="${i === 0 ? '#F3EFF7' : '#B8BACB'}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="15.5">${escapeXml(line)}</text>`).join('')}
    <circle cx="925" cy="151" r="29" fill="#222B40" stroke="#44445E"/><path d="M912 152l9 9 18-22" fill="none" stroke="#D8A6BF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  `);
}

export function talents(profile: Profile): string {
  const cards = profile.skills.map((group, i) => {
    const x = 42 + i * 306;
    const color = ['#A99BCB', '#D8A6BF', '#C9B58A'][i];
    return `<g><rect x="${x}" y="116" width="286" height="142" rx="14" fill="url(#surface)" stroke="#44445E"/>
      <rect x="${x}" y="116" width="4" height="142" rx="2" fill="${color}" opacity=".85"/>
      <text x="${x + 22}" y="146" fill="#F3EFF7" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="15" font-weight="600">${escapeXml(group.group)}</text>
      ${group.items.map((item, j) => `<text x="${x + 22 + (j % 2) * 125}" y="${180 + Math.floor(j / 2) * 28}" fill="#B8BACB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13"><tspan fill="${color}">◇</tspan><tspan dx="7">${escapeXml(item)}</tspan></text>`).join('')}
    </g>`;
  }).join('');
  return svgShell(282, 'Talents and technical stack', `${panelHeader('02', 'Talents', 'Core technical stack')}${cards}`);
}

export function party(profile: Profile): string {
  const nodes = profile.party.map((item, i) => {
    const x = 42 + i * 184;
    return `<g>
      <rect x="${x}" y="116" width="164" height="106" rx="14" fill="url(#surface)" stroke="#44445E"/>
      <circle cx="${x + 24}" cy="143" r="8" fill="none" stroke="${i % 2 ? '#D8A6BF' : '#A99BCB'}"/><circle cx="${x + 24}" cy="143" r="2.5" fill="#C9B58A"/>
      <text x="${x + 43}" y="147" fill="#C9B58A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" letter-spacing="1.2">${escapeXml(item.slot.toUpperCase())}</text>
      <text x="${x + 18}" y="183" fill="#F3EFF7" font-family="Georgia,Times New Roman,serif" font-size="19">${escapeXml(item.technology)}</text>
      <text x="${x + 18}" y="205" fill="#B8BACB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10.5">${escapeXml(['AI foundation','Typed systems','Model APIs','Containers','Orchestration'][i] ?? '')}</text>
    </g>`;
  }).join('');
  return svgShell(246, 'Party setup', `${panelHeader('03', 'Party Setup', 'A practical engineering composition')}${nodes}`);
}

export function projects(profile: Profile): string {
  const cards = profile.projects.map((project, i) => {
    const x = 42 + i * 306;
    const title = wrappedText(project.name, 25).slice(0, 2);
    const description = wrappedText(project.description, 36).slice(0, 3);
    return `<g><rect x="${x}" y="116" width="286" height="190" rx="14" fill="url(#surface)" stroke="#44445E"/>
      <text x="${x + 20}" y="143" fill="#C9B58A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" letter-spacing="2">PROJECT 0${i + 1}</text>
      ${title.map((line, j) => `<text x="${x + 20}" y="${174 + j * 22}" fill="#F3EFF7" font-family="Georgia,Times New Roman,serif" font-size="17">${escapeXml(line)}</text>`).join('')}
      ${description.map((line, j) => `<text x="${x + 20}" y="${226 + j * 19}" fill="#B8BACB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11.5">${escapeXml(line)}</text>`).join('')}
      <text x="${x + 20}" y="289" fill="#A99BCB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10.5">${escapeXml(project.technologies.join(' · '))}</text>
    </g>`;
  }).join('');
  return svgShell(330, 'Featured projects', `${panelHeader('04', 'Selected Work', 'Featured projects')}${cards}`);
}

export function activity(profile: Profile): string {
  const account = profile.github.username ? `github.com/${profile.github.username}` : 'GitHub profile · username configurable';
  return svgShell(190, 'GitHub activity', `${panelHeader('05', 'Activity', 'Open work, visible progress')}
    <rect x="42" y="116" width="916" height="46" rx="13" fill="url(#surface)" stroke="#44445E"/>
    <circle cx="69" cy="139" r="9" fill="none" stroke="#D8A6BF"/><circle cx="69" cy="139" r="3" fill="#C9B58A"/>
    <text x="91" y="144" fill="#F3EFF7" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14">Public repositories · experiments · contribution history</text>
    <text x="930" y="144" text-anchor="end" fill="#A99BCB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12">${escapeXml(account)}</text>
  `);
}

export const generatedAssetNames = ['hero.svg', 'hero-static.svg', 'about.svg', 'talents.svg', 'party-setup.svg', 'projects.svg', 'activity.svg'] as const;
export function generators(profile: Profile, root: string): Record<string, string> {
  return {
    'hero.svg': hero(profile, root, true),
    'hero-static.svg': hero(profile, root, false),
    'about.svg': about(profile),
    'talents.svg': talents(profile),
    'party-setup.svg': party(profile),
    'projects.svg': projects(profile),
    'activity.svg': activity(profile)
  };
}
