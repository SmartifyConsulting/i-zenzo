import sdn from "@/data/sdn.json";

type Row = [string, string, string];

const ENTRIES = sdn as unknown as Row[];

const STOPWORDS = new Set([
  "the", "and", "of", "co", "ltd", "limited", "inc", "llc", "plc", "sa", "pty",
  "corp", "corporation", "company", "group", "holdings", "trading", "pte", "gmbh",
]);

function normalise(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

export type SanctionsMatch = {
  ent_num: string;
  name: string;
  program: string;
  score: number;
};

/**
 * Whole-word overlap match against the OFAC SDN list. Substring matching is
 * deliberately avoided so "LIA" never matches inside "Aurelia".
 */
export function screenName(rawName: string): { hit: boolean; matches: SanctionsMatch[] } {
  const queryWords = normalise(rawName);
  if (queryWords.length === 0) return { hit: false, matches: [] };
  const querySet = new Set(queryWords);

  const matches: SanctionsMatch[] = [];
  for (const [entNum, name, program] of ENTRIES) {
    const targetWords = normalise(name);
    if (targetWords.length === 0) continue;
    let overlap = 0;
    for (const w of new Set(targetWords)) if (querySet.has(w)) overlap += 1;
    if (overlap === 0) continue;
    const coverage = overlap / new Set(targetWords).size;
    const score = overlap / querySet.size;
    if (coverage >= 0.6 && score >= 0.6) {
      matches.push({ ent_num: entNum, name, program, score: Number(Math.min(coverage, score).toFixed(2)) });
    }
  }

  matches.sort((a, b) => b.score - a.score);
  return { hit: matches.length > 0, matches: matches.slice(0, 5) };
}
