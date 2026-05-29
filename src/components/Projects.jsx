import projectsBg from "../assets/projects-bg.jpeg";

function Projects() {
  return (
    <main className="section" style={{ backgroundImage: `url(${projectsBg})` }}>
      <h1>Projects</h1>
      <p>Persona 5 portfolio, Salesforce workflow builder, gaming PC optimization.</p>
      <p>Press ESC to return to the menu.</p>
    </main>
  );
}

export default Projects;
