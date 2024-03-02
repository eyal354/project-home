export default function About() {
  return (
    // Use a container to wrap the content, ensuring it's centered and properly padded
    <div className="container text-center my-5">
      {/* Use row and justify-content-center to center the items horizontally */}
      <div className="row justify-content-center">
        {/* Use col classes to define the width of your content area. Adjust the size as needed */}
        <div className="col-12 col-md-8 col-lg-6">
          <h1>About Me</h1>
          <h2>Name: Eyal Brenner</h2>
          <h2>ID: 326663606</h2>
          <h2>Age: 19</h2>
          {/* Add Bootstrap classes to the link and image for styling */}
          <a href="https://www.react.dev" className="d-block my-3">
            {/* Use mx-auto to center the image and d-block to ensure it's centered as a block element */}
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
