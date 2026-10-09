export const theme = {
  bg: '#151B2D', surface: '#222B40', lavender: '#A99BCB',
  sakura: '#D8A6BF', gold: '#C9B58A', text: '#F3EFF7',
  secondary: '#B8BACB', border: '#44445E'
} as const;

export function escapeXml(value: string): string {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;'
  })[char] ?? char);
}

export function svgShell(height: number, title: string, body: string, extraDefs = ''): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${height}" viewBox="0 0 1000 ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title><desc id="desc">${escapeXml(title)} for Gia Phat's GitHub profile</desc>
  <defs>
    <linearGradient id="surface" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#222B40"/><stop offset="1" stop-color="#191F33"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#A99BCB"/><stop offset=".55" stop-color="#D8A6BF"/><stop offset="1" stop-color="#C9B58A"/></linearGradient>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
    ${extraDefs}
  </defs>
  <rect width="1000" height="${height}" rx="22" fill="#151B2D"/>
  <rect x="1" y="1" width="998" height="${height - 2}" rx="21" fill="none" stroke="#44445E"/>
  ${body}
</svg>\n`;
}

export function panelHeader(index: string, label: string, title: string): string {
  return `<g>
    <text x="42" y="38" fill="#C9B58A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" letter-spacing="3">${escapeXml(index)} / ${escapeXml(label.toUpperCase())}</text>
    <text x="42" y="72" fill="#F3EFF7" font-family="Georgia,Times New Roman,serif" font-size="27">${escapeXml(title)}</text>
    <rect x="42" y="91" width="916" height="1.5" rx="1" fill="url(#accent)" opacity=".65"/>
    <path d="M42 25h18M42 25v18M958 25h-18M958 25v18" fill="none" stroke="#C9B58A" opacity=".55"/>
  </g>`;
}
