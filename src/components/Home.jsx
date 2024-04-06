// Importing necessary CSS files
import "../style.css";
import "../component-css/Home.css";
// Import AOS for animations (ensure you've installed AOS in your project)
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function Home() {
  // Initialize AOS with slower duration
  useEffect(() => {
    AOS.init({
      duration: 1500, // animations will take 1500ms (1.5 seconds)
    });
  }, []);

  return (
    <>
      <div className="position-relative d-flex flex-column justify-content-center align-items-center vh-100">
        <video
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            width: "100%",
            left: "50%",
            top: "50%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
            zIndex: "-1",
          }}
        >
          <source src="/src/assets/vid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Black overlay with 70% opacity */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "100%",
            backgroundColor: "black",
            opacity: "0.7",
            zIndex: "0",
          }}
        ></div>
        <h1
          className="text-uppercase text-center display-1"
          style={{ zIndex: "1", color: "#fff" }}
        >
          Casa AI
        </h1>
        <hr
          className="w-50 mx-auto"
          style={{
            background: "#fff",
            zIndex: "2",
            position: "relative",
            border: "none",
            height: "2px",
          }}
        />

        <p className="mt-2 text-center" style={{ zIndex: "1", color: "#fff" }}>
          Building future for your home.
        </p>
      </div>
      <div className="container mt-5">
        <h2
          className="display-4 text-center mb-5"
          data-aos="fade-up"
          style={{ color: "inherit" }}
        >
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
