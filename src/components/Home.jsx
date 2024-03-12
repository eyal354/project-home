//import "../style.css"; // Importing the CSS file
import "../component-css/Home.css"; // Importing the CSS file
export default function Home() {
  return (
    <div className="container bd-masthead">
      <header className="header">
        <h1 className="display-1 text-center my-4">CasaAI</h1>
        <p className="headerSubtitle">Building future for you home</p>
      </header>
      <section className="features">
        <div className="featureItem bd-masthead">
          <h2 className="featureTitle">Temperature Control</h2>
          <p className="featureDescription">
            Adjust the temperature from anywhere
          </p>
        </div>
        <div className="featureItem">
          <h2 className="featureTitle">Lighting Automation</h2>
          <p className="featureDescription">
            Control lights across your entire home
          </p>
        </div>
        <div className="featureItem">
          <h2 className="featureTitle">Security Monitoring</h2>
          <p className="featureDescription">
            Keep your home safe with 24/7 monitoring
          </p>
        </div>
      </section>
    </div>
  );
}
