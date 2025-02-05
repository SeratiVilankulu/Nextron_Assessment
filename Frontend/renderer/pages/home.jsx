import React, { useState } from "react"; 
import Head from "next/head"; 
import { useRouter } from "next/router"; 
import axios from "axios"; 

const LoginPage = () => {
  // State to store user input (Email and Password)
  const [userInput, setUserInput] = useState({
    Email: "",
    Password: "",
  });

  // State to manage error messages and success messages
  const [errorMsg, setErrorMsg] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [Submitting, setSubmitting] = useState(false); // To track if the form is being submitted
  const router = useRouter(); // useRouter hook for navigation after successful login

  // Handle changes in input fields (Email, Password)
  const handleLogin = (name, value) => {
    setUserInput({
      ...userInput, // Retain previous state values
      [name]: value, // Update the state with the new value
    });
  };

  // Function to validate form submission
  const validateFormSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setErrorMsg({}); // Reset errors
    setSuccessMsg(""); // Reset success message

    let inputError = {}; // Object to hold validation errors

    // Basic validation checks for Email and Password
    if (!userInput.Email) {
      inputError.Email = "Email cannot be empty";
    }
    if (!userInput.Password) {
      inputError.Password = "Password cannot be empty";
    }

    // If there are validation errors, stop the submission and display errors
    if (Object.keys(inputError).length > 0) {
      setErrorMsg(inputError);
      return;
    }

    setSubmitting(true); // Disable the submit button while the request is in progress

    try {
      // Making POST request for login
      const userData = await axios.post("http://localhost:5110/api/account/login", {
        Email: userInput.Email,
        Password: userInput.Password,
      });

      // If login is successful, store the user data in localStorage (Renderer Process)
      localStorage.setItem("user", JSON.stringify(userData.data));
      setSuccessMsg("Credentials Valid!"); // Display success message

      // After a short delay, navigate the user to the dashboard
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (error) {
      console.log(error);

      // Handle responses from the API
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMsg({
            api: error.response.data.message, // Unauthorized (invalid credentials)
          });
        } else {
          setErrorMsg({ api: "Login failed. Please try again." });
        }
      } else {
        // If no response from the server, show a generic error message
        setErrorMsg({ api: "An error occurred. Please try again." });
      }
    } finally {
      setSubmitting(false); // Enable the submit button after the request finishes
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Streamify Login</title>
      </Head>
      <div className="loginContainer">
        <div className="loginCard">
          <div className="loginCardContent">
            <h1 className="loginTitle">Login</h1>
            <form onSubmit={validateFormSubmit} className="loginForm">
              <div className="formGroup">
                <label htmlFor="email" className="formLabel">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="Email"
                  value={userInput.Email}
                  onChange={(e) => handleLogin(e.target.name, e.target.value)}
                  placeholder="Enter your email"
                  className="formInput"
                />
              </div>
              <div className="formGroup">
                <label htmlFor="password" className="formLabel">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="Password"
                  value={userInput.Password}
                  onChange={(e) => handleLogin(e.target.name, e.target.value)}
                  placeholder="Enter your password"
                  className="formInput"
                />
                {/* Display error message for password */}
                <p className="errorMessage">{errorMsg.Password}</p>
                {/* Display error message from the API */}
                {errorMsg.api && <p className="errorMessage">{errorMsg.api}</p>}
                {/* Display success message */}
                {successMsg && <p className="successMessage">{successMsg}</p>}
              </div>
              {/* Login Button */}
              <button
                type="submit"
                className="loginButton"
                disabled={Submitting} // Disable button while submitting
              >
                Login to Streamify
              </button>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default LoginPage;