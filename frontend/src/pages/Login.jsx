import React, { useState, useEffect } from 'react';
import './Login.css';
import { login, signup } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // ✅ ONLY FIX: URL madhun mode gheto
  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setSignState("Sign Up");
    } else {
      setSignState("Sign In");
    }
  }, [searchParams]);

  const user_auth = async (event) => {
  event.preventDefault();
  try {
    if (signState === "Sign In") {
      await login(email, pass);
    } else {
      await signup(name, email, pass);
    }

    // ✅ Change "/dashboard" to "/analysis"
    setTimeout(() => {
      navigate("/analysis"); 
    }, 1500);

  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <>
      <ToastContainer />
      <div className="login">
        <div className="login-form">

          <h1>{signState}</h1>

          <form onSubmit={user_auth}>
            {signState === "Sign Up" && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Your password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />

            <button type="submit">
              {signState}
            </button>
          </form>

          <div className="form-switch">
            {signState === "Sign In" ? (
              <p>
                New?
                <span onClick={() => setSignState("Sign Up")}>
                  Sign Up Now
                </span>
              </p>
            ) : (
              <p>
                Already have an account?
                <span onClick={() => setSignState("Sign In")}>
                  Sign In Now
                </span>
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;
