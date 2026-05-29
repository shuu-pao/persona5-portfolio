import aboutBg from "../assets/about-bg.jpeg";

function About() {
  return (
    <main className="section" style={{ backgroundImage: `url(${aboutBg})` }}>
      <h1>About Me</h1>
      <p>Computer Engineering graduate</p>
      <p>Press ESC to return to the menu.</p>
    </main>
  );
}

export default About;
