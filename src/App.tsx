import "./App.css";
import GameItem from "./components/GameItem";
import ramsetu from "./assets/gameIcons/RamSetu.png";
import snake from "./assets/gameIcons/Snake.jpeg";
import saveMonke from "./assets/gameIcons/saveMonke.png";
import { GAMES } from "./data/games";

const GAME_THUMBNAILS: Record<string, string> = {
  snake,
  ramsetu,
  savemonke: saveMonke,
};

function App() {
  return (
    <div className="retro-container power-on">
      <div className="scanlines" />
      <div className="noise" />
      <div className="cabinet-frame">
        <div className="crt-screen">
          <header className="retro-header">
            <div className="marquee-band">
              <h1 className="retro-title glow-flicker">MONKE PLAY</h1>
            </div>
            <div className="retro-subtitle">ARCADE</div>
          </header>

      <main className="retro-main">
        <div className="retro-section">
          <h2 className="retro-section-title">TRENDING GAMES</h2>
          <div className="game-grid">
            {GAMES.map((game) => (
              <GameItem
                key={game.id}
                gameId={game.id}
                name={game.name}
                img={GAME_THUMBNAILS[game.id] ?? ""}
                projectLink={game.link}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="retro-footer">
        <div className="insert-coin-strip">
          <span>INSERT COIN</span>
          <span className="sep">|</span>
          <span>1P START</span>
        </div>
        <div className="retro-social">
          <span className="retro-text">FOLLOW ME ON:</span>
          <div className="retro-links">
            <a
              href="https://github.com/mukulbbhardwaj"
              target="_blank"
              rel="noopener noreferrer"
              className="retro-link"
            >
              GITHUB
            </a>
            <span className="retro-separator">|</span>
            <a
              href="https://twitter.com/mukulbbhardwaj"
              target="_blank"
              rel="noopener noreferrer"
              className="retro-link"
            >
              X
            </a>
          </div>
        </div>
      </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
