// Importing necessary CSS files
import "../style.css";
import "../component-css/Home.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1500, // animations will take 1500ms (1.5 seconds)
    });
  }, []);

  return (
    <>
      <div className="position-relative d-flex flex-column justify-content-center align-items-center vh-100">
        <video className="background-video" autoPlay loop muted>
          <source src="/src/assets/vid.mp4" type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
        <div className="text-overlay mt-2 text-center">
          <h1 className="display-1 text-uppercase">Casa AI</h1>
          <hr className="title-hr" />
          <p>Building future for your home.</p>
        </div>
      </div>
      <div className="container mt-5">
        <h2 className="display-4 text-center mb-5" data-aos="fade-up">
          What We Offer
        </h2>
        <div className="row">
          <div
            className="col-sm-12 col-md-6 col-lg-4 mb-4"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-thermometer-sun"></i> Temperature Control
                </h5>
                <p className="card-text">
                  Adjust the temperature from anywhere to ensure your home is
                  always comfortable.
                </p>
              </div>
            </div>
          </div>
          <div
            className="col-sm-12 col-md-6 col-lg-4 mb-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-lightbulb"></i> Lighting Automation
                </h5>
                <p className="card-text">
                  Control lights across your entire home with automated settings
                  and remote access.
                </p>
              </div>
            </div>
          </div>
          <div
            className="col-sm-12 col-md-6 col-lg-4 mb-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-shield-lock"></i> Security Monitoring
                </h5>
                <p className="card-text">
                  Keep your home safe with 24/7 monitoring, alert systems, and
                  smart locks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
