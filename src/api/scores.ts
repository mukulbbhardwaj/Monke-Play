export type LeaderboardEntry = {
  player_name: string | null;
  score: number;
  created_at: string;
};

const getBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL;
  if (typeof url === "string" && url) return url.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
};

export async function fetchLeaderboard(
  gameId: string,
  limit = 10
): Promise<LeaderboardEntry[]> {
  const base = getBaseUrl();
  const res = await fetch(
    `${base}/api/scores?gameId=${encodeURIComponent(gameId)}&limit=${Math.min(100, Math.max(1, limit))}`
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Failed to load leaderboard (${res.status})`);
  }
  return res.json();
}

export async function submitScore(
  gameId: string,
  score: number,
  playerName?: string
): Promise<void> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId, score, playerName: playerName ?? "Anonymous" }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? `Failed to submit score (${res.status})`);
  }
}
