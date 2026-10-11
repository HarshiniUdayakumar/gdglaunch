import { useEffect, useRef, useState } from "react";
import "./App.css";

const WEBSITE_URL = "https://www.gdgrec.dev/";
const TOTAL_SECONDS = 5;

// Spoken by the cat (browser speech synthesis)
const countdownLines = {
  5: "Five. Welcome, developers. Get ready!",
  4: "Four. Build something extraordinary.",
  3: "Three. Connect with your community.",
  2: "Two. Innovation starts now.",
  1: "One. GDGREC is going live!",
};

// Shown on screen under the number
const taglines = {
  5: "Welcome, developers.",
  4: "Build something extraordinary.",
  3: "Connect with your community.",
  2: "Innovation starts now.",
  1: "GDGREC is going live!",
};

export default function App() {
  const [phase, setPhase] = useState("welcome");
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [voiceEnabled] = useState(false);

  const deadlineRef = useRef(0);
  const spokenRef = useRef(null);

  // Accurate five-second countdown based on elapsed time.
  // When it hits 0, go straight to the real website.
  useEffect(() => {
    if (phase !== "countdown") return;

    deadlineRef.current = Date.now() + TOTAL_SECONDS * 1000;
    spokenRef.current = null;

    const timer = window.setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000)
      );

      setSeconds(remaining);

      if (remaining === 0) {
        window.clearInterval(timer);

        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }

        window.location.replace(WEBSITE_URL);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [phase]);

  // Let the cat announce each number through browser speech synthesis.
  useEffect(() => {
    if (phase !== "countdown" || !voiceEnabled) return;
    if (!("speechSynthesis" in window)) return;

    const message = countdownLines[seconds];

    if (!message || spokenRef.current === seconds) return;

    spokenRef.current = seconds;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.92;
    utterance.pitch = 0.85;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  }, [phase, seconds, voiceEnabled]);

  // Clean up speech when the component unmounts.
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function launch() {
    if (phase !== "welcome") return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setSeconds(TOTAL_SECONDS);
    setPhase("countdown");
  }

  const isCountdown = phase === "countdown";

  return (
    <main className={`launch-page phase-${phase}`}>
      <div className="background-grid" />
      <div className="background-glow glow-blue" />
      <div className="background-glow glow-green" />
      <div className="background-glow glow-red" />

      {phase === "welcome" && (
        <>
          <header className="topbar">
            <img
              className="brand-logo"
              src="/gdgrec-logo.png"
              alt="GDGREC logo"
            />

            <div className="event-label">
              <span className="live-dot" />
              GOOGLE DEVELOPER GROUPS
              <br />
              RAJALAKSHMI ENGINEERING COLLEGE
            </div>
          </header>

          <section className="hero">
            <div className="hero-copy">
              <p className="eyebrow">THE NEXT CHAPTER STARTS HERE</p>

              <h1 className="hero-title">
                BUILD
                <br />
                CONNECT
                <br />
                <span className="google-gradient">INNOVATE.</span>
              </h1>

              <p className="hero-description">
                A new digital home for the
                <br />
                GDGREC community.
              </p>

              <button className="launch-button" onClick={launch}>
                <span>LAUNCH WEBSITE</span>
                <span className="launch-arrow">↗</span>
              </button>

              <div className="hero-meta">
                <span>BUILD THE FUTURE</span>
                <span className="meta-separator">/</span>
                <span>TOGETHER</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-grid" />

              <div className="floating-panel panel-left">
                <span>01 / COMMUNITY</span>
                <strong>
                  Develop.
                  <br />
                  Learn.
                  <br />
                  Grow.
                </strong>
              </div>

              <div className="neon-frame frame-blue" />
              <div className="neon-frame frame-color" />

              <div className="mascot-platform">
                <div className="platform-top" />
                <div className="platform-side" />
              </div>

              <img
                className="hero-cat"
                src="/gdgrec-cat.png"
                alt="GDGREC's orange cat mascot wearing a varsity jacket"
              />

              <div className="mascot-tag">
                <span className="live-dot" />
                YOUR LAUNCH HOST
              </div>

              <div className="floating-panel panel-right">
                <span>02 / WHAT'S NEXT</span>
                <strong>
                  Ideas into
                  <br />
                  impact.
                </strong>
              </div>

              <div className="visual-caption">
                GDGREC <span>·</span> BUILT FOR DEVELOPERS
              </div>
            </div>
          </section>

          <footer className="bottom-bar">
            <span>COMMUNITY</span>
            <span>EVENTS</span>
            <span>LEARNING</span>
            <span>OPPORTUNITIES</span>
            <span className="footer-year">GDGREC © 2026</span>
          </footer>
        </>
      )}

      {isCountdown && (
        <section className="countdown-stage">
          <header className="countdown-topbar">
            <img
              src="/gdgrec-logo.png"
              alt="GDGREC"
              className="countdown-logo"
            />

            <span className="sequence-label">WE ARE GOING LIVE</span>

            <span className="launch-status">
              <span className="live-dot" />
              GDGREC 2026
            </span>
          </header>

          <div className="countdown-content">
            {/* Left: number + tagline (never overlaps the cat) */}
            <div className="countdown-copy">
              <div className="count-number" key={`n${seconds}`}>
                {seconds}
              </div>

              <p className="count-tagline" key={`t${seconds}`}>
                {taglines[seconds]}
              </p>

              <div className="progress-track">
                <div
                  className="progress-bar"
                  style={{
                    width: `${
                      ((TOTAL_SECONDS - seconds) / TOTAL_SECONDS) * 100
                    }%`,
                  }}
                />
              </div>

              <p className="progress-label">ENTERING GDGREC.DEV</p>
            </div>

            {/* Right: cat only */}
            <div className="countdown-visual">
              <div className="orbit orbit-outer" />
              <div className="orbit orbit-middle" />
              <div className="orbit orbit-inner" />

              <div className="mascot-light" />

              <img
                src="/gdgrec-cat.png"
                className="countdown-cat"
                alt="GDGREC cat mascot wearing its varsity jacket"
              />
            </div>
          </div>

          <footer className="countdown-bottom">
            <span>GOOGLE DEVELOPER GROUPS</span>
            <span>RAJALAKSHMI ENGINEERING COLLEGE</span>
            <span>BUILD. CONNECT. INNOVATE.</span>
          </footer>
        </section>
      )}
    </main>
  );
}