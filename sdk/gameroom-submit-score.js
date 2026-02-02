/**
 * Gameroom score SDK — include in your game to submit scores to the Gameroom leaderboard.
 * Usage: Gameroom.submitScore({ gameId: "your-game-id", score: 100, playerName: "Optional" })
 *
 * API base URL: set window.GAMEROOM_API_URL before loading, or use ?gameroom_api=... in the page URL,
 * or add data-api="https://your-hub.vercel.app" on the script tag.
 */
(function (global) {
  function getApiBase() {
    if (global.GAMEROOM_API_URL) return global.GAMEROOM_API_URL.replace(/\/$/, "");
    try {
      var script = document.currentScript;
      if (script && script.getAttribute("data-api")) return script.getAttribute("data-api").replace(/\/$/, "");
    } catch (e) {}
    try {
      var p = new URLSearchParams(window.location.search);
      var u = p.get("gameroom_api");
      if (u) return u.replace(/\/$/, "");
    } catch (e) {}
    return "";
  }

  function submitScore(opts) {
    var gameId = opts && opts.gameId;
    var score = opts && opts.score;
    var playerName = opts && opts.playerName;
    if (!gameId || typeof gameId !== "string" || typeof score !== "number" || score < 0) return;
    var base = getApiBase();
    if (!base) return;
    fetch(base + "/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gameId: gameId.trim(),
        score: score,
        playerName: typeof playerName === "string" ? playerName.trim().slice(0, 64) : "Anonymous",
      }),
    }).catch(function () {});
  }

  global.Gameroom = global.Gameroom || {};
  global.Gameroom.submitScore = submitScore;
})(typeof window !== "undefined" ? window : this);
