// Import necessary hooks and utilities from React, React Router, Firebase, and external libraries
import { useState, useContext } from "react";
import { AuthContext } from "../App";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { database } from "../Firebase";
// import "../style.css";

import "../component-css/Login.css";
import { useNavigate } from "react-router-dom";
// Import ToastContainer for notifications and toast function to trigger those notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Defines the Login functional component
export default function Login() {
  // Hook to programmatically navigate to other routes
  const navigate = useNavigate();
  // Initialize Firebase authentication service
  const auth = getAuth();
  // Destructuring setLoggedIn from AuthContext to manage login state
  const { setLoggedIn } = useContext(AuthContext);

  // useState hook to manage form data for email and password inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Function to handle form input changes and update formData state accordingly
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  // Function to handle form submission, authenticate user, and navigate to the home page upon successful login
  function handleSubmit(event) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // User successfully signed in
        const user = userCredential.user;
        // Update login state and store login status in local storage
        setLoggedIn(true);
        localStorage.setItem("loggedIn", true);

        // Fetch and store user details from Firebase database
        const userRef = ref(
          database,
          "users/" + user.email.replace(/\./g, ",")
        );
        onValue(userRef, (snapshot) => {
          const userDetails = snapshot.val();
          localStorage.setItem("UserDetails", JSON.stringify(userDetails));
        });

        // Navigate to the home page
        navigate("/");
      })
      .catch((error) => {
        // Display error message using toast notification
        toast.error(error.message);
      });
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition="Bounce"
      />
      <form className="form-login" onSubmit={handleSubmit}>
        <h3>Login Here</h3>

        <label htmlFor="email">Email</label>
        <input
          className="formElement"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          name="email"
          value={formData.email}
        />

        <label htmlFor="password">Password</label>
        <input
          className="formElement"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          name="password"
          value={formData.password}
        />

        <button className="formBTN" type="submit">
          Login
        </button>
      </form>
    </>
  );
}
