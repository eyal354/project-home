export default function About() {
  return (
    <div className="container text-center my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="display-1 text-center my-4">About</h2>
          <h2>Name: Eyal Brenner</h2>
          <h2>ID: 326663606</h2>
          <h2>Age: 19</h2>

          <a href="https://www.react.dev" className="d-block my-3">
            <img
              src="/react.png"
              alt="React Logo"
              className="img-fluid mx-auto"
              style={{ maxWidth: "500px" }}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
