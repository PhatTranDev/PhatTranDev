import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import type { Profile } from '../types.js';
import { escapeXml, svgShell } from '../utils/svg.js';

function mimeFor(path: string): string {
  return extname(path).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
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
export const generatedAssetNames = ['hero.svg', 'hero-static.svg'] as const;
export function generators(profile: Profile, root: string): Record<string, string> {
  return {
    'hero.svg': hero(profile, root, true),
    'hero-static.svg': hero(profile, root, false)
  };
}
