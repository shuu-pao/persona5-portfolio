import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [activeMenu, setActiveMenu] = useState("menu");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleMenuClick = (menu) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveMenu(menu);
      setIsTransitioning(false);
    }, 800); // match animation duration
  };

  // ESC key returns to menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMenu("menu");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={`app ${isTransitioning ? "transition" : ""}`}>
      {activeMenu === "menu" && (
        <nav className="menu">
          <button onClick={() => handleMenuClick("skills")}>Skills</button>
          <button onClick={() => handleMenuClick("projects")}>Projects</button>
          <button onClick={() => handleMenuClick("contact")}>Contact</button>
        </nav>
      )}

      {activeMenu === "skills" && (
        <main className="section">
          <h1>Skills Section</h1>
          <p>Press ESC to return to the menu.</p>
        </main>
      )}

      {activeMenu === "projects" && (
        <main className="section">
          <h1>Projects Section</h1>
          <p>Press ESC to return to the menu.</p>
        </main>
      )}

      {activeMenu === "contact" && (
        <main className="section">
          <h1>Contact Section</h1>
          <p>Press ESC to return to the menu.</p>
        </main>
      )}
    </div>
  );
}

export default App;
