import expBg from "../assets/experience-bg.jpeg";

function Experience() {
  return (
    <main className="section" style={{ backgroundImage: `url(${expBg})` }}>
      <h1>Experience</h1>
      <p>Internship in Salesforce workflow design and Agentforce process architecture.</p>
      <p>Press ESC to return to the menu.</p>
    </main>
  );
}

export default Experience;
