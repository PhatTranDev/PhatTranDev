import { readFileSync } from 'node:fs';
import { basename, extname } from 'node:path';
import type { Profile } from '../types.js';
import { escapeXml, label, sectionHeading, svgShell } from '../utils/svg.js';

function mimeFor(path: string): string {
  return extname(path).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
}

function wrappedText(text: string, max = 72): string[] {
  const words = text.split(/\s+/); const lines: string[] = []; let line = '';
  for (const word of words) {
    if (`${line} ${word}`.trim().length > max) { if (line) lines.push(line); line = word; }
    else line = `${line} ${word}`.trim();
  }
  if (line) lines.push(line); return lines;
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
  return svgShell(390, `${profile.displayName} — ${profile.role}`, `
    ${style}<rect x="22" y="22" width="956" height="346" rx="20" fill="url(#surface)"/>
    <circle class="halo" cx="202" cy="195" r="160" fill="#D8A6BF" opacity=".22" filter="url(#softGlow)"/>
    <clipPath id="portraitClip"><rect x="40" y="40" width="322" height="310" rx="18"/></clipPath>
    <image href="${dataUri}" x="40" y="40" width="322" height="483" preserveAspectRatio="xMidYMid slice" clip-path="url(#portraitClip)"/>
    <rect x="40" y="40" width="322" height="310" rx="18" fill="none" stroke="url(#accent)" stroke-width="2"/>
    <path d="M40 86V40h46M316 40h46v46M40 304v46h46M316 350h46v-46" fill="none" stroke="#C9B58A" stroke-width="2"/>
    ${particles}
    <text x="410" y="105" fill="#C9B58A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" letter-spacing="4">PROFILE / AI SYSTEMS</text>
    <text x="407" y="174" fill="#F3EFF7" font-family="Georgia,Times New Roman,serif" font-size="54">${escapeXml(profile.displayName)}</text>
    <text x="410" y="214" fill="#D8A6BF" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="21" font-weight="600">${escapeXml(profile.role)}</text>
    <text x="410" y="258" fill="#B8BACB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="18">${escapeXml(profile.tagline)}</text>
    <line x1="410" y1="283" x2="927" y2="283" stroke="#44445E"/>
    <text x="410" y="317" fill="#A99BCB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" letter-spacing="1">${escapeXml(profile.keywords.join('  ·  '))}</text>
  `);
}

export function profileCard(profile: Profile): string {
  const lines = wrappedText(profile.summary, 78);
  return svgShell(250, 'Profile', `${sectionHeading('01 / Profile', 'Building useful intelligence')}
    <circle cx="75" cy="151" r="22" fill="#2B334A" stroke="#A99BCB"/><path d="M67 151l6 6 11-14" fill="none" stroke="#D8A6BF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${lines.map((line, i) => `<text x="112" y="${137 + i * 27}" fill="${i === 0 ? '#F3EFF7' : '#B8BACB'}" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="17">${escapeXml(line)}</text>`).join('')}`);
}

export function talents(profile: Profile): string {
  const columns = profile.skills.map((group, i) => {
    const x = 48 + i * 306;
    return `<g><rect x="${x}" y="125" width="282" height="190" rx="16" fill="url(#surface)" stroke="#44445E"/>
      <circle cx="${x + 24}" cy="155" r="5" fill="${['#A99BCB','#D8A6BF','#C9B58A'][i]}"/>
      <text x="${x + 40}" y="161" fill="#F3EFF7" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="16" font-weight="600">${escapeXml(group.group)}</text>
      ${group.items.map((item, j) => `<text x="${x + 24}" y="${202 + j * 27}" fill="#B8BACB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="15"><tspan fill="#A99BCB">◇</tspan><tspan dx="10">${escapeXml(item)}</tspan></text>`).join('')}</g>`;
  }).join('');
  return svgShell(345, 'Talents', `${sectionHeading('02 / Talents', 'Technical focus')}${columns}`);
}

export function party(profile: Profile): string {
  const cards = profile.party.map((item, i) => {
    const x = 48 + (i % 3) * 306; const y = 125 + Math.floor(i / 3) * 126; const w = i === 4 ? 588 : 282;
    const description = wrappedText(item.description, w > 300 ? 74 : 31).slice(0, 2);
    return `<g><rect x="${x}" y="${y}" width="${w}" height="104" rx="14" fill="#1D2539" stroke="#44445E"/>
      <text x="${x + 20}" y="${y + 25}" fill="#C9B58A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" letter-spacing="1.5">${escapeXml(item.slot.toUpperCase())}</text>
      <text x="${x + 20}" y="${y + 49}" fill="#F3EFF7" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="18" font-weight="600">${escapeXml(item.technology)}</text>
      ${description.map((line, j) => `<text x="${x + 20}" y="${y + 72 + j * 18}" fill="#B8BACB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12.5">${escapeXml(line)}</text>`).join('')}</g>`;
  }).join('');
  return svgShell(375, 'Party Setup', `${sectionHeading('03 / Party Setup', 'A practical engineering stack')}${cards}`);
}

export function projects(profile: Profile): string {
  const cards = profile.projects.map((project, i) => {
    const x = 48 + i * 306; const lines = wrappedText(project.description, 33).slice(0, 3); const title = wrappedText(project.name, 24).slice(0, 2);
    const tags = project.technologies.join('  ·  ');
    return `<g><rect x="${x}" y="125" width="282" height="235" rx="16" fill="url(#surface)" stroke="#44445E"/>
      <text x="${x + 20}" y="158" fill="#A99BCB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" letter-spacing="2">PROJECT 0${i + 1}</text>
      ${title.map((line, j) => `<text x="${x + 20}" y="${189 + j * 23}" fill="#F3EFF7" font-family="Georgia,Times New Roman,serif" font-size="18">${escapeXml(line)}</text>`).join('')}
      ${lines.map((line, j) => `<text x="${x + 20}" y="${245 + j * 20}" fill="#B8BACB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12.5">${escapeXml(line)}</text>`).join('')}
      <text x="${x + 20}" y="337" fill="#A99BCB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11.5">${escapeXml(tags)}</text></g>`;
  }).join('');
  return svgShell(390, 'Featured Projects', `${sectionHeading('04 / Selected Work', 'Featured projects')}${cards}`);
}

export function activity(profile: Profile): string {
  const configured = profile.github.username.trim() !== '';
  const message = configured ? `github.com/${profile.github.username}` : 'GitHub username intentionally left unconfigured';
  return svgShell(235, 'GitHub Activity', `${sectionHeading('05 / Activity', 'Open work, visible progress')}
    <rect x="48" y="126" width="904" height="68" rx="16" fill="url(#surface)" stroke="#44445E"/>
    <circle cx="83" cy="160" r="13" fill="none" stroke="#D8A6BF" stroke-width="2"/><circle cx="83" cy="160" r="4" fill="#C9B58A"/>
    <text x="112" y="154" fill="#F3EFF7" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="16">Public repositories, experiments, and contribution history</text>
    <text x="112" y="177" fill="#B8BACB" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13">${escapeXml(message)} · No third-party statistics service required.</text>`);
}

export const generatedAssetNames = ['hero.svg','hero-static.svg','profile.svg','talents.svg','party-setup.svg','projects.svg','achievements.svg'] as const;
export function generators(profile: Profile, root: string): Record<string, string> {
  return {
    'hero.svg': hero(profile, root, true), 'hero-static.svg': hero(profile, root, false),
    'profile.svg': profileCard(profile), 'talents.svg': talents(profile),
    'party-setup.svg': party(profile), 'projects.svg': projects(profile),
    'achievements.svg': activity(profile)
  };
}
