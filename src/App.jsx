import { useState, useEffect, useRef } from "react";
import "./App.css";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import menuBg from "./assets/menu-bg.jpeg";
import trainTransition from "./assets/train-transition.mov";

/**
 * Small internal helper so this file is self-contained.
 * Plays the select sound and swallows promise rejections (autoplay policies).
 */
function playSelectSound(src = "/select-button.mp3", volume = 0.6) {
  try {
    const s = new Audio(src);
    s.volume = Math.max(0, Math.min(1, volume));
    s.play().catch(() => {});
  } catch (e) {
    // silent fail
  }
}

const ITEMS = [
  { id: "about",   label: "ABOUT ME",    page: "about",     fontSize: 64, offsetX: 0,  offsetY: 0,  skew: -6,  skewY: 10 },
  { id: "resume",  label: "EXPERIENCE",  page: "experience",fontSize: 60, offsetX: 24, offsetY: 50, skew: -11, skewY: -10 },
  { id: "github",  label: "PROJECTS",    page: "projects",  fontSize: 54, offsetX: 10, offsetY: 28, skew: 0,   skewY: -4 },
  { id: "socials", label: "SKILLS",      page: "skills",    fontSize: 59, offsetX: 19, offsetY: 30, skew: -3,  skewY: 5 },
  { id: "sideproj",label: "CONTACT",     page: "contact",   fontSize: 52, offsetX: 12, offsetY: 28, skew: -4,  skewY: 7 },
];

const CLIP_SHAPES = [
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
  () => "polygon(0% 44%, 24% 6%, 82% 0%, 100% 36%, 82% 100%, 18% 94%)",
];

function App() {
  const [activeMenu, setActiveMenu] = useState("menu"); // "menu" | "transition" | page keys
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [targetSection, setTargetSection] = useState(null);
  const [showTarget, setShowTarget] = useState(false);
  const audioRef = useRef(null);

  // P5 menu internal state (mirrors the other project)
  const [active, setActive] = useState(() => {
    const saved = sessionStorage.getItem("p5-menu-active");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [mounted, setMounted] = useState(false);
  const isFirstRenderAudio = useRef(true);
  const [animKey, setAnimKey] = useState(0);

  // Activate a row (hover or keyboard)
  const activate = (idx) => {
    setActive(idx);
    setAnimKey((k) => k + 1);
    // play sound but avoid playing on first render
    if (!isFirstRenderAudio.current) playSelectSound();
    isFirstRenderAudio.current = false;
  };

  // Click / confirm navigation from menu
  const handleMenuClick = (page) => {
    // play a louder select sound
    try {
      const s = new Audio("/select-button.mp3");
      s.volume = 1.0;
      s.play().catch(() => {});
    } catch (e) {}

    setTargetSection(page);
    // start the transition overlay
    setActiveMenu("transition");
    // ensure we start with the menu background visible; the transition video will flip showTarget later
    setShowTarget(false);
  };

  // small hover sound for mouseenter on rows
  const handleHover = () => {
    playSelectSound("/select-button.mp3", 0.6);
  };

  // mount animation delay
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 1000);
    return () => clearTimeout(t);
  }, []);

  // keyboard navigation for the menu and escape to menu
  useEffect(() => {
    const onKey = (e) => {
      if (activeMenu === "menu") {
        if (e.key === "ArrowUp") activate(Math.max(0, active - 1));
        if (e.key === "ArrowDown") activate(Math.min(ITEMS.length - 1, active + 1));
        if (e.key === "Enter") handleMenuClick(ITEMS[active].page);
      } else {
        if (e.key === "Escape") setActiveMenu("menu");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeMenu]);

  // sync bg audio controls
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  return (
    <div className="app">
      {/* Background music */}
      <audio ref={audioRef} src="/bg-music.mp3" autoPlay loop />

      {/* Audio controls */}
      <div className="audio-controls">
        <button onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
        />
      </div>

      {/* Persona 5 style menu */}
      {activeMenu === "menu" && (
        <div className="p5-overlay" style={{ backgroundImage: `url(${menuBg})` }}>
          <div className="p5-stripe" />
          <div className="p5-stripe2" />

          <nav className="p5-menu">
            {ITEMS.map((item, i) => {
              const isActive = active === i;
              const dist = Math.abs(i - active);
              const opacity = isActive ? 1 : Math.max(0.5, 1 - dist * 0.2);
              const estW = item.label.length * item.fontSize * 0.6 + 80;
              const estH = item.fontSize * 0.94;
              const clipFn = CLIP_SHAPES[i] ?? CLIP_SHAPES[0];

              return (
                <a
                  key={item.id}
                  href="#"
                  className={`p5-row ${isActive ? "active" : ""} ${mounted ? "mounted" : ""}`}
                  style={{
                    marginRight: item.offsetX,
                    marginTop: item.offsetY,
                    transitionDelay: mounted ? `${i * 80}ms` : "0ms",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick(item.page);
                  }}
                  onMouseEnter={() => activate(i)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="p5-glow" />
                  <div
                    className="p5-skew-wrap"
                    style={{ transform: `skewX(${item.skew}deg) skewY(${item.skewY}deg)` }}
                  >
                    <div
                      key={isActive ? `pop-${i}-${animKey}` : `idle-${i}`}
                      className={`p5-shadow-tri${isActive ? " pop" : ""}`}
                      style={{ width: estW, height: estH, clipPath: clipFn(estW, estH) }}
                    />
                    <div
                      className="p5-highlight"
                      style={{
                        width: estW,
                        height: estH,
                        clipPath: clipFn(estW, estH),
                        transform: `translateY(-50%) scaleX(${isActive ? 1 : 0})`,
                      }}
                    />
                    <div className="p5-label-wrap" style={{ opacity }}>
                      <span className="p5-label-base p5-label-dark" style={{ fontSize: item.fontSize }}>
                        {item.label}
                      </span>
                      <span
                        className="p5-label-base p5-label-bright"
                        style={{ fontSize: item.fontSize, clipPath: clipFn(estW, estH) }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </nav>

          <div className={`p5-hint ${mounted ? "mounted" : ""}`}>
            <div className="p5-hint-row"><span className="p5-hint-key">↑↓</span><span>NAVIGATE</span></div>
            <div className="p5-hint-row"><span className="p5-hint-key">↵</span><span>CONFIRM</span></div>
          </div>
        </div>
      )}

      {/* Transition overlay (train video) */}
      {activeMenu === "transition" && (
        <div className="transition-container">
          <div className="transition-background">
            {!showTarget ? (
              <div className="menu-bg" style={{ backgroundImage: `url(${menuBg})` }} />
            ) : (
              <div className="section-bg">
                {targetSection === "about" && <About />}
                {targetSection === "experience" && <Experience />}
                {targetSection === "projects" && <Projects />}
                {targetSection === "skills" && <Skills />}
                {targetSection === "contact" && <Contact />}
              </div>
            )}
          </div>

          <video
            src={trainTransition}
            autoPlay
            muted
            playsInline
            className="transition-video"
            onLoadedMetadata={(e) => {
              // reveal the target half-way through the video
              const half = e.target.duration / 2;
              setTimeout(() => setShowTarget(true), half * 1000);
            }}
            onEnded={() => {
              // dispatch a global event so the destination page can coordinate its reveal
              // then switch to the target section
              try {
                window.dispatchEvent(new CustomEvent("transition:finished"));
              } catch (err) {
                // ignore if dispatch fails for any reason
              }
              setActiveMenu(targetSection);
            }}
          />
        </div>
      )}

      {/* Fallback direct sections (if user navigates without transition) */}
      {activeMenu === "about" && <About />}
      {activeMenu === "experience" && <Experience />}
      {activeMenu === "projects" && <Projects />}
      {activeMenu === "skills" && <Skills />}
      {activeMenu === "contact" && <Contact />}
    </div>
  );
}

export default App;
