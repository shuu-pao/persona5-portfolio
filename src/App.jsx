import { useState, useEffect, useRef } from "react";
import "./App.css";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import menuBg from "./assets/menu-bg.jpeg";
import trainTransition from "./assets/train-transition.mov";

function App() {
  const [activeMenu, setActiveMenu] = useState("menu");
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [targetSection, setTargetSection] = useState(null);
  const [showTarget, setShowTarget] = useState(false);

  const audioRef = useRef(null); // background music

  const handleMenuClick = (menu) => {
    // Play click sound
    const sound = new Audio("/select-button.mp3");
    sound.volume = 1.0;
    sound.play();

    setTargetSection(menu);
    setActiveMenu("transition");
    setShowTarget(false);
  };

  // Hover sound
  const handleHover = () => {
    const sound = new Audio("/select-button.mp3");
    sound.volume = 0.6;
    sound.play();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMenu("menu");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

      {activeMenu === "menu" && (
        <nav
          className="menu"
          style={{ backgroundImage: `url(${menuBg})` }}
        >
          <button onClick={() => handleMenuClick("about")} onMouseEnter={handleHover}>About Me</button>
          <button onClick={() => handleMenuClick("experience")} onMouseEnter={handleHover}>Experience</button>
          <button onClick={() => handleMenuClick("projects")} onMouseEnter={handleHover}>Projects</button>
          <button onClick={() => handleMenuClick("skills")} onMouseEnter={handleHover}>Skills</button>
          <button onClick={() => handleMenuClick("contact")} onMouseEnter={handleHover}>Contact</button>
        </nav>
      )}

      {activeMenu === "transition" && (
        <div className="transition-container">
          {/* Background underneath video */}
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

          {/* Transition video overlay */}
          <video
            src={trainTransition}
            autoPlay
            muted
            playsInline
            className="transition-video"
            onLoadedMetadata={(e) => {
              const half = e.target.duration / 2;
              setTimeout(() => setShowTarget(true), half * 1000);
            }}
            onEnded={() => setActiveMenu(targetSection)}
          />
        </div>
      )}

      {activeMenu === "about" && <About />}
      {activeMenu === "experience" && <Experience />}
      {activeMenu === "projects" && <Projects />}
      {activeMenu === "skills" && <Skills />}
      {activeMenu === "contact" && <Contact />}
    </div>
  );
}

export default App;
