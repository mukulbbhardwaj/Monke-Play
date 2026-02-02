import { createClient } from "@supabase/supabase-js";

const ALLOWED_GAME_IDS = ["snake", "savemonke", "ramsetu"];

type VercelReq = { method?: string; query: Record<string, string | string[] | undefined>; body?: unknown };
type VercelRes = {
  setHeader: (name: string, value: string) => VercelRes;
  status: (code: number) => VercelRes;
  json: (body: unknown) => VercelRes;
  end: () => void;
};

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) must be set");
  }
  return createClient(url, key);
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.method === "GET") {
    const gameId = typeof req.query.gameId === "string" ? req.query.gameId : "";
    const limit = Math.min(
      100,
      Math.max(1, parseInt(String(req.query.limit || "10"), 10) || 10)
    );
    if (!gameId || !ALLOWED_GAME_IDS.includes(gameId)) {
      return res.status(400).json({
        error: "Invalid or missing gameId",
        allowed: ALLOWED_GAME_IDS,
      });
    }
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from("scores")
        .select("player_name, score, created_at")
        .eq("game_id", gameId)
        .order("score", { ascending: false })
        .limit(limit);
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json(data ?? []);
    } catch (e) {
      return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  }

  if (req.method === "POST") {
    const body = req.body as { gameId?: string; score?: number; playerName?: string };
    const gameId = typeof body?.gameId === "string" ? body.gameId.trim() : "";
    let score = typeof body?.score === "number" ? body.score : NaN;
    if (Number.isInteger(body?.score)) score = body.score as number;
    const playerName =
      typeof body?.playerName === "string" ? body.playerName.trim().slice(0, 64) : null;

    if (!gameId || !ALLOWED_GAME_IDS.includes(gameId)) {
      return res.status(400).json({
        error: "Invalid or missing gameId",
        allowed: ALLOWED_GAME_IDS,
      });
    }
    if (!Number.isInteger(score) || score < 0) {
      return res.status(400).json({ error: "score must be a non-negative integer" });
    }
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("scores").insert({
        game_id: gameId,
        player_name: playerName || "Anonymous",
        score,
      });
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(201).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: "Failed to submit score" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
