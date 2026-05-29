import skillsBg from "../assets/skills-bg.jpeg";

function Skills() {
  return (
    <main className="section" style={{ backgroundImage: `url(${skillsBg})` }}>
      <h1>Skills</h1>
      <ul>
        <li>JavaScript</li>
        <li>CSS</li>
        <li>React</li>
        <li>HTML</li>
        <li>Firebase</li>
        <li>Salesforce</li>
      </ul>
      <p>Press ESC to return to the menu.</p>
    </main>
  );
}

export default Skills;
