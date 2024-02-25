import { useState, useContext } from "react";
import { AuthContext } from "../App";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { database } from "../Firebase";
// import "../style.css";
import "../component-css/Login.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { setLoggedIn } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // User signed in
        const user = userCredential.user;
        setLoggedIn(true);
        localStorage.setItem("loggedIn", true);

        // Fetch and store user details
        const userRef = ref(database, "users/" + user.uid);
        onValue(userRef, (snapshot) => {
          const userDetails = snapshot.val();
          localStorage.setItem("UserDetails", JSON.stringify(userDetails));
        });

        navigate("/");
      })
      .catch(() => {
        toast.error("Email or password is incorrect");
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
        transition:Bounce
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
