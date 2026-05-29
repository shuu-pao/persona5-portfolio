import contactBg from "../assets/contact-bg.jpeg";

function Contact() {
  return (
    <main className="section" style={{ backgroundImage: `url(${contactBg})` }}>
      <h1>Contact</h1>
      <p>Email: <a href="mailto:paolo.enrera@gmail.com">paolo.enrera@gmail.com</a></p>
      <p>GitHub: <a href="https://github.com/shuu-pao" target="_blank" rel="noopener noreferrer">github.com/shuu-pao</a></p>
      <p>LinkedIn: <a href="https://www.linkedin.com/in/paolo-jansen-enrera-7736611b8/" target="_blank" rel="noopener noreferrer">linkedin.com/in/paolo-jansen-enrera-7736611b8</a></p>
      <p>Resume: <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Download Resume</a></p>
      <p>Press ESC to return to the menu.</p>
    </main>
  );
}

export default Contact;
