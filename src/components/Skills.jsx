import skillsBg from "../assets/skills-bg.jpeg";

function Skills() {
  return (
    <main className="section" style={{ backgroundImage: `url(${skillsBg})` }}>
      <h1>Skills</h1>
      <p>React, JavaScript, CSS, HTML, Firebase, Salesforce workflows, PC hardware optimization.</p>
      <p>Press ESC to return to the menu.</p>
    </main>
  );
}

export default Skills;
