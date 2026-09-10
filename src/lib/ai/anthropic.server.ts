const ANTHROPIC_MODEL = "claude-sonnet-5";

export type CandidateRanking = { name: string; confidence: number; rationale: string };

export async function rankCandidatesWithClaude(input: {
  subject?: string | null;
  candidates: Array<Record<string, unknown>>;
}): Promise<CandidateRanking[]> {
  const apiKey = process.env["ANTHROPIC_API_KEY"];
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const prompt = `You are the AI+ stage of a commodities trading governance platform, ranking counterparty candidates for a trade request. Never fabricate facts not present in the candidate data — every rationale must be traceable to the given fields.

Subject: ${input.subject ?? "unknown"}
Candidates (JSON): ${JSON.stringify(input.candidates)}

Return ONLY a JSON array (no markdown fences, no prose), one object per candidate, each shaped exactly as:
{"name": string, "confidence": number between 0 and 1, "rationale": one sentence grounded only in the candidate's own fields}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Anthropic API error ${res.status}: ${await res.text()}`);
  }

  const json: any = await res.json();
  const text: string = json?.content?.[0]?.text ?? "[]";
  const match = text.match(/\[[\s\S]*\]/);
  const parsed = JSON.parse(match ? match[0] : text);
  if (!Array.isArray(parsed)) throw new Error("Anthropic response was not a JSON array");
  return parsed;
}
