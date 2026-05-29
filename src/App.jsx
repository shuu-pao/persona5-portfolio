import { useState, useEffect, useRef } from "react";
import "./App.css";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import menuBg from "./assets/menu-bg.jpeg";

function App() {
  const [activeMenu, setActiveMenu] = useState("menu");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // default 50%

  const audioRef = useRef(null);       // background music
  const selectSoundRef = useRef(null); // button sound effect

  const handleMenuClick = (menu) => {
    // Play select sound
    if (selectSoundRef.current) {
      selectSoundRef.current.currentTime = 0; // restart from beginning
      selectSoundRef.current.play();
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveMenu(menu);
      setIsTransitioning(false);
    }, 800);
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

  // Sync mute/volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  return (
    <div className={`app ${isTransitioning ? "transition" : ""}`}>
      {/* Background music */}
      <audio ref={audioRef} src="/bg-music.mp3" autoPlay loop />

      {/* Button select sound */}
      <audio ref={selectSoundRef} src="/select-button.mp3" />

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
          <button onClick={() => handleMenuClick("about")}>About Me</button>
          <button onClick={() => handleMenuClick("experience")}>Experience</button>
          <button onClick={() => handleMenuClick("projects")}>Projects</button>
          <button onClick={() => handleMenuClick("skills")}>Skills</button>
          <button onClick={() => handleMenuClick("contact")}>Contact</button>
        </nav>
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
