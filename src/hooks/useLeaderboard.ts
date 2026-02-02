import { useState, useEffect, useCallback } from "react";
import { fetchLeaderboard, type LeaderboardEntry } from "../api/scores";

export function useLeaderboard(gameId: string, limit = 10) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!gameId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeaderboard(gameId, limit);
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load leaderboard");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [gameId, limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { entries, loading, error, refetch };
}
