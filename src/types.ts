export interface Profile {
  displayName: string;
  role: string;
  tagline: string;
  keywords: string[];
  summary: string;
  skills: Array<{ group: string; items: string[] }>;
  party: Array<{ slot: string; technology: string; description: string }>;
  projects: Array<{ name: string; description: string; technologies: string[]; repository: string }>;
  github: { username: string };
  contact: Array<{ label: string; url: string }>;
  avatar: { path: string; alt: string; creator: string; source: string; license: string; officialArtwork: boolean };
  animation: { enabled: boolean; particleCount: number };
}
