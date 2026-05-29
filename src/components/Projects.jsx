import projectsBg from "../assets/projects-bg.jpeg";

function Projects() {
  return (
    <main className="section" style={{ backgroundImage: `url(${projectsBg})` }}>
      <h1>Projects</h1>
      <ul>
        <li>Smartbin3 (Thesis)</li>
        <li>PIC-Based Futsal Scoreboard</li>
        <li>Persona5-Themed Portfolio</li>
      </ul>
      <p>Press ESC to return to the menu.</p>
    </main>
  );
}

export default Projects;
