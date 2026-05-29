// src/components/About.jsx
import { useEffect, useRef, useState } from "react";
import aboutBg from "../assets/about-bg.jpeg";
import profileIcon from "../assets/Base.png";

export default function About() {
  // Controls when the background fade begins (applies .bg-ready)
  const [bgReady, setBgReady] = useState(false);
  // Controls when the card becomes visible (applies .visible)
  const [showCard, setShowCard] = useState(false);

  // guards and refs
  const revealedRef = useRef(false);
  const timeoutRef = useRef(null);
  const fallbackRef = useRef(null);
  const transitionFiredRef = useRef(false);

  useEffect(() => {
    // ESC / Back handler
    const onKey = (e) => {
      if (e.key === "Escape" || e.key === "Backspace") window.history.back();
    };
    window.addEventListener("keydown", onKey);

    // Preload background image
    let img = new Image();
    let didCancel = false;

    const onBgLoaded = () => {
      if (didCancel) return;
      setBgReady(true);
    };

    img.src = aboutBg;
    if (img.complete) {
      onBgLoaded();
    } else {
      img.onload = onBgLoaded;
      img.onerror = onBgLoaded; // reveal anyway on error so UI isn't stuck
    }

    // Fallback: if no transition event arrives, reveal after a safe maximum
    // This prevents the page from getting stuck if App doesn't dispatch the event.
    fallbackRef.current = setTimeout(() => {
      if (!revealedRef.current) {
        revealedRef.current = true;
        setBgReady(true);
        // small delay so bg fade starts before card animates
        timeoutRef.current = setTimeout(() => setShowCard(true), 600);
      }
    }, 3000); // 3s fallback

    return () => {
      didCancel = true;
      window.removeEventListener("keydown", onKey);
      if (img) {
        img.onload = null;
        img.onerror = null;
        img = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (fallbackRef.current) {
        clearTimeout(fallbackRef.current);
        fallbackRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Handler for the global transition finished event dispatched by App.jsx
    const onTransitionFinished = () => {
      transitionFiredRef.current = true;

      // If background hasn't loaded yet, wait for bgReady effect to schedule reveal.
      // If bgReady is already true, schedule reveal now.
      if (bgReady && !revealedRef.current) {
        // REVEAL_DELAY_MS controls how long after the transition finishes the card appears.
        // You reported issues below 500ms; 600ms is a safe default. Tune as needed.
        const REVEAL_DELAY_MS = 600;
        timeoutRef.current = setTimeout(() => {
          if (!revealedRef.current) {
            revealedRef.current = true;
            setShowCard(true);
            // clear fallback if present
            if (fallbackRef.current) {
              clearTimeout(fallbackRef.current);
              fallbackRef.current = null;
            }
          }
        }, REVEAL_DELAY_MS);
      }
    };

    window.addEventListener("transition:finished", onTransitionFinished);
    return () => {
      window.removeEventListener("transition:finished", onTransitionFinished);
    };
  }, [bgReady]);

  useEffect(() => {
    // If bgReady becomes true and the transition has already fired, schedule reveal.
    // This covers the case where transition finished before the background finished loading.
    if (!bgReady) return;
    if (!transitionFiredRef.current) {
      // don't reveal yet — wait for transition:finished or fallback
      return;
    }
    if (revealedRef.current) return;

    const REVEAL_DELAY_MS = 600;
    timeoutRef.current = setTimeout(() => {
      if (!revealedRef.current) {
        revealedRef.current = true;
        setShowCard(true);
        if (fallbackRef.current) {
          clearTimeout(fallbackRef.current);
          fallbackRef.current = null;
        }
      }
    }, REVEAL_DELAY_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [bgReady]);

  return (
    <main
      className={`p5-about${bgReady ? " bg-ready" : ""}`}
      style={{
        backgroundImage: `url(${aboutBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100%",
      }}
      aria-label="About"
    >
      <style>{`
        /* ensure the root and body allow full-height sections */
        html, body, #root { height: 100%; }

        /* Root layout */
        .p5-about {
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 6vh 8vw;
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          color: #fff;
          position: relative;
          overflow: hidden;

          /* hidden by default until background is ready */
          opacity: 0;
          transition: opacity 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* when background is ready, fade the main container in */
        .p5-about.bg-ready {
          opacity: 1;
        }

        @media (max-width: 800px) {
          .p5-about { background-attachment: scroll !important; padding: 5vh 6vw; }
        }

        /* main card */
        .p5-card {
          position: relative;
          z-index: 2;
          width: min(1100px, 46vw);
          max-width: 980px;
          min-width: 320px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 24px;
          align-items: stretch;
          padding: 22px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 64px) 100%, 0 100%);
          background: linear-gradient(180deg, rgba(18,18,18,0.96), rgba(18,18,18,0.92));
          box-shadow: 18px 0 0 rgba(217,35,35,0.88);
          border: 1px solid rgba(255,255,255,0.06);

          /* start hidden and slightly offset; we'll reveal only when showCard is true */
          transform: translateY(10px);
          opacity: 0;
          visibility: hidden; /* prevent any accidental flash */

          transition:
            opacity 320ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1);

          margin-top: 2vh;
          margin-right: 2vw;
        }

        /* reveal the card when showCard is true (class applied below) */
        .p5-card.visible {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        /* left content */
        .p5-left {
          padding: 6px 8px 6px 6px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 12px;
        }

        .p5-top-label {
          font-family: "Bebas Neue", system-ui, sans-serif;
          font-size: 16px;
          color: rgba(255,255,255,0.18);
          letter-spacing: 4px;
        }

        .p5-title {
          font-family: 'Persona5Main', system-ui, sans-serif;
          font-size: 48px;
          line-height: 0.95;
          margin: 0;
          letter-spacing: 2px;
          color: #ffffff;
          text-transform: uppercase;
          -webkit-text-stroke: 1px rgba(13,13,13,0.6);
        }

        .p5-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.92);
          max-width: 56ch;
        }

        .p5-meta {
          display: flex;
          gap: 12px;
          margin-top: 8px;
          align-items: center;
        }

        .p5-badge {
          background: #d92323;
          color: #fff;
          padding: 6px 10px;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          box-shadow: 6px 6px 0 rgba(13,13,13,0.6);
        }

        /* portrait area */
        .p5-portrait-shell {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
        }

        .p5-silhouette {
          width: 100%;
          height: 100%;
          min-height: 300px;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.02) 0 6%, transparent 8%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02) 0 6%, transparent 8%),
            linear-gradient(180deg, rgba(0,0,0,0.0), rgba(0,0,0,0.0));
          position: relative;
          display: grid;
          place-items: center;
        }

        .p5-silhouette::after {
          content: "";
          width: 86%;
          height: 92%;
          background: linear-gradient(180deg, #0d0d0d 0%, #0d0d0d 100%);
          clip-path: polygon(12% 0, 100% 0, 84% 100%, 0 100%);
          transform: skewX(-8deg) translateX(6%);
          box-shadow: 0 12px 0 rgba(13,13,13,0.6);
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
        }

        .p5-profile-overlay {
          position: absolute;
          width: 86%;
          height: 92%;
          left: 7%;
          top: 4%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          pointer-events: none;
          transform: skewX(-8deg) translateX(6%);
        }

        .p5-profile {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 50% 50%;
          background: transparent;
          filter: drop-shadow(0 10px 0 rgba(13,13,13,0.45));
          display: block;
        }

        .p5-silhouette .halftone {
          position: absolute;
          right: -6%;
          top: 6%;
          width: 56%;
          height: 88%;
          background:
            radial-gradient(circle at 10% 10%, rgba(217,35,35,0.95) 0 6%, rgba(217,35,35,0.85) 8% 12%, transparent 14%),
            repeating-radial-gradient(circle at 10% 10%, rgba(0,0,0,0.06) 0 2px, transparent 2px 6px);
          mix-blend-mode: multiply;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 12% 100%);
          transform: skewX(-8deg);
          opacity: 0.95;
        }

        .p5-hint {
          position: absolute;
          bottom: 22px;
          right: 28px;
          z-index: 3;
          font-family: 'Bebas Neue', sans-serif;
          color: rgba(255,255,255,0.22);
          letter-spacing: 2px;
          font-size: 13px;
        }

        @media (max-width: 1200px) {
          .p5-card { width: min(1100px, 60vw); grid-template-columns: 1fr 320px; }
        }

        @media (max-width: 980px) {
          .p5-about { justify-content: center; align-items: flex-start; padding: 5vh 6vw; }
          .p5-card { grid-template-columns: 1fr; width: 92%; margin-right: 0; margin-top: 1vh; }
          .p5-portrait-shell { order: -1; height: 220px; }
          .p5-title { font-size: 40px; }
          .p5-silhouette::after { clip-path: none; transform: none; width: 100%; height: auto; left: 0; top: 0; }
          .p5-profile-overlay { position: relative; transform: none; width: 60%; height: auto; left: auto; top: auto; }
          .p5-profile { width: 100%; height: auto; object-fit: contain; object-position: 50% 50%; }
        }
      `}</style>

      <div className={`p5-card${showCard ? " visible" : ""}`} role="region" aria-labelledby="about-title">
        <div className="p5-left">
          <div className="p5-top-label">01</div>
          <h1 id="about-title" className="p5-title">About Me</h1>

          <div className="p5-sub">
            <p style={{ margin: 0 }}>
              <strong>Computer/Software Engineer</strong> — I am a Computer Engineering Graduate from the University of San Carlos, passionate about building efficient and scalable software. I am focusing on building diverse personal projects to continuously expand my technical proficiency and master new programming languages. I love exploring different tech stacks, breaking down complex engineering problems, and turning logic into functional code.
            </p>
          </div>

          <div className="p5-meta">
            <div className="p5-badge">PROFILE</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>Paolo Jansen A. Enrera</div>
          </div>
        </div>

        <div className="p5-portrait-shell" aria-hidden="true">
          <div className="p5-silhouette">
            <div className="halftone" />
          </div>

          <div className="p5-profile-overlay" aria-hidden="true">
            <img src={profileIcon} alt="Profile" className="p5-profile" />
          </div>
        </div>
      </div>

      <div className="p5-hint">Press ESC to return to the menu</div>
    </main>
  );
}
