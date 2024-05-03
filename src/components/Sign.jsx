import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { database } from "../Firebase";
import { useNavigate } from "react-router-dom";
import "../component-css/Sign.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sign() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    age: "",
    houseId: "",
  });
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  useEffect(() => {
    setPasswordMismatch(passwords.password !== passwords.confirmPassword);
  }, [passwords]);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "password" || name === "confirmPassword") {
      setPasswords((prevPasswords) => ({ ...prevPasswords, [name]: value }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    let currentUser = null; // Define a variable to hold the user object outside of the promise chain

    if (passwordMismatch) {
      toast.error("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, formData.email, passwords.password)
      .then((userCredential) => {
        // User account created successfully
        currentUser = userCredential.user; // Assign the user object to the variable
        const userProfile = {
          ...formData,
          age: parseInt(formData.age, 10) || 0,
        };
        // Save user profile in the 'users' node
        return set(
          ref(database, `users/${currentUser.email.replace(/\./g, ",")}`),
          userProfile
        );
      })
      .then(() => {
        // If a houseId is provided, proceed to check for ownership
        if (formData.houseId && currentUser) {
          // Check if currentUser is available
          const houseRef = ref(database, `Houses/${formData.houseId}`);
          return get(houseRef).then((snapshot) => {
            const houseData = snapshot.val();
            // Check if the user's email is not the owner's email of the house
            if (houseData && houseData.owner !== formData.email) {
              // User's email is not the owner's email, add to pending requests
              const pendingRef = ref(
                database,
                `Houses/${
                  formData.houseId
                }/PendingRequest/${currentUser.email.replace(/\./g, ",")}`
              );
              return set(pendingRef, formData.email); // Use the currentUser's UID as key for the pending request
            }
          });
        }
      })
      .then(() => {
        //success
        navigate("/");
      })
      .catch((error) => {
        //error
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
      <form className="form-sign" onSubmit={handleSubmit}>
        <h3>Sign Up Here</h3>

        <input
          className="formElement"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          name="email"
          value={formData.email}
        />
        <input
          className="formElement"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          name="password"
          value={passwords.password}
        />
        <input
          className="formElement"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
          name="confirmPassword"
          value={passwords.confirmPassword}
        />
        <input
          className="formElement"
          type="text"
          placeholder="First Name"
          onChange={handleChange}
          name="firstname"
          value={formData.firstname}
        />
        <input
          className="formElement"
          type="text"
          placeholder="Last Name"
          onChange={handleChange}
          name="lastname"
          value={formData.lastname}
        />
        <input
          className="formElement"
          type="number"
          placeholder="Age"
          onChange={handleChange}
          name="age"
          value={formData.age}
        />
        <input
          className="formElement"
          type="text"
          placeholder="House ID"
          onChange={handleChange}
          name="houseId"
          value={formData.houseId}
        />
        <p className={`pass-error ${passwordMismatch ? "active" : ""}`}>
          {passwordMismatch && "Passwords do not match"}
        </p>

        <button className="formBTN-s" type="submit">
          Sign Up
        </button>
      </form>
    </>
  );
}
