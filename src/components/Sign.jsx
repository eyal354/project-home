import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { get, ref, set } from "firebase/database";
import { database } from "../Firebase";
// import "../style.css";
import "../component-css/Sign.css";
import { useNavigate } from "react-router-dom";

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
  const [error, setError] = useState(null);

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
    if (passwordMismatch) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, formData.email, passwords.password)
      .then((userCredential) => {
        // User account created successfully
        const user = userCredential.user;
        const userProfile = {
          ...formData,
          age: parseInt(formData.age, 10) || 0,
        };
        // Save user profile in the 'users' node
        return set(ref(database, `users/${user.uid}`), userProfile);
      })
      .then(() => {
        // If a houseId is provided, proceed to check for ownership
        if (formData.houseId) {
          const houseRef = ref(database, `Houses/${formData.houseId}`);
          return get(houseRef).then((snapshot) => {
            const houseData = snapshot.val();
            // Check if the user is not the owner of the house
            if (houseData && houseData.owner !== auth.currentUser.uid) {
              // User is not the owner, add to pending requests
              const newPendingKey = auth.currentUser.uid; // Create a unique key
              const pendingRef = ref(
                database,
                `Houses/${formData.houseId}/PendingRequest`
              );
              return set(pendingRef, { [newPendingKey]: formData.email });
            }
          });
        }
      })
      .then(() => {
        console.log(
          "Registration Successful, User profile saved, and Pending request handled"
        );
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
        console.error("Registration Failed:", error);
      });
  }

  return (
    <>
      <div className="background">
        {/* <div className="shape"></div>
        <div className="shape"></div> */}
      </div>
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
        {passwordMismatch && (
          <p className="pass-error">Passwords do not match</p>
        )}
        {error && <p className="error">{error}</p>}
        <button className="formBTN" type="submit">
          Sign Up
        </button>
      </form>
    </>
  );
}
