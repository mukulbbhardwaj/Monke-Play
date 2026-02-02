import { useState } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";

type Props = {
  gameId: string;
  name: string;
  img: string;
  projectLink: string;
};

export default function GameItem({ gameId, name, img, projectLink }: Props) {
  const { entries, loading, error, refetch } = useLeaderboard(gameId, 10);
  const [modalOpen, setModalOpen] = useState(false);

  const topThree = entries.slice(0, 3);
  const apiBase =
    typeof window !== "undefined"
      ? import.meta.env.VITE_API_URL || window.location.origin
      : "";
  const playUrl =
    apiBase && projectLink
      ? `${projectLink}${projectLink.includes("?") ? "&" : "?"}gameroom_api=${encodeURIComponent(apiBase)}`
      : projectLink;

  return (
    <>
      <div className="game-card arcade-card">
        <a href={playUrl} target="_blank" rel="noopener noreferrer" className="game-card-link">
          <img className="gameIcon" src={img} alt={name} />
        </a>
        <div className="game-card-name">{name}</div>
        <div className="game-card-scores">
          <div className="high-scores-label">HIGH SCORES</div>
          {loading && <div className="scores-loading">...</div>}
          {error && <div className="scores-error">{error}</div>}
          {!loading && !error && topThree.length === 0 && (
            <div className="scores-empty">No scores yet</div>
          )}
          {!loading && !error && topThree.length > 0 && (
            <ul className="scores-preview">
              {topThree.map((e, i) => (
                <li key={i} className="score-row">
                  <span className="score-rank">{i + 1}UP</span>
                  <span className="score-name">{e.player_name ?? "Anonymous"}</span>
                  <span className="score-value">{e.score}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="view-all-scores"
            onClick={() => setModalOpen(true)}
            aria-label="View full leaderboard"
          >
            VIEW ALL
          </button>
        </div>
      </div>

      {modalOpen && (
        <div
          className="leaderboard-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Leaderboard"
          onClick={() => setModalOpen(false)}
        >
          <div className="leaderboard-modal retro-crt" onClick={(e) => e.stopPropagation()}>
            <div className="scanlines" />
            <div className="leaderboard-modal-header">
              <h3>{name} — LEADERBOARD</h3>
              <button
                type="button"
                className="leaderboard-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                X
              </button>
            </div>
            <div className="leaderboard-modal-body">
              {loading && <div className="scores-loading">Loading...</div>}
              {error && <div className="scores-error">{error}</div>}
              {!loading && !error && entries.length === 0 && (
                <div className="scores-empty">No scores yet. Play and submit!</div>
              )}
              {!loading && !error && entries.length > 0 && (
                <ol className="leaderboard-list">
                  {entries.map((e, i) => (
                    <li key={i} className="leaderboard-row">
                      <span className="score-rank">{i + 1}UP</span>
                      <span className="score-name">{e.player_name ?? "Anonymous"}</span>
                      <span className="score-value">{e.score}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <button
              type="button"
              className="leaderboard-refresh"
              onClick={() => refetch()}
            >
              REFRESH
            </button>
          </div>
        </div>
      )}
    </>
  );
}
