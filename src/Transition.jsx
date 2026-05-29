import { useEffect, useState } from "react";

export default function Transition({ videoSrc, targetSection, onFinish, menuBg }) {
  const [showTarget, setShowTarget] = useState(false);

  useEffect(() => {
    const video = document.querySelector(".transition-video");

    if (video) {
      video.onloadedmetadata = () => {
        const half = video.duration / 2;
        // Switch background halfway through
        setTimeout(() => setShowTarget(true), half * 1000);
      };
    }
  }, []);

  return (
    <div className="transition-container">
      {/* Background underneath video */}
      <div className="transition-background">
        {!showTarget ? (
          <div
            className="menu-bg"
            style={{ backgroundImage: `url(${menuBg})` }}
          />
        ) : (
          <div className="section-bg">
            {targetSection === "about" && <div className="section">About Me</div>}
            {targetSection === "experience" && <div className="section">Experience</div>}
            {targetSection === "projects" && <div className="section">Projects</div>}
            {targetSection === "skills" && <div className="section">Skills</div>}
            {targetSection === "contact" && <div className="section">Contact</div>}
          </div>
        )}
      </div>

      {/* Transition video overlay */}
      <video
        src={videoSrc}
        autoPlay
        muted
        playsInline
        className="transition-video"
        onEnded={onFinish}
      />
    </div>
  );
}
