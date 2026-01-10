import React, { useState } from 'react';
import './Login.css';
import { login, signup } from '../firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const [signState, setSignState] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const user_auth = async (event) => {
    event.preventDefault();

    if (signState === "Sign In") {
      await login(email, pass);
      toast.success("Logged in successfully!");
    } else {
      await signup(name, email, pass);
      toast.success("Account created successfully!");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className='login'>
       
        <div className="login-form">
          <h1>{signState}</h1>
          <form>
            {signState === "Sign Up" && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your name'
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Your email'
            />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder='Your password'
            />
            <button onClick={user_auth} type='submit'>{signState}</button>
          </form>
          <div className="form-switch">
            {signState === "Sign In" ? (
              <p>New? <span onClick={() => setSignState("Sign Up")}>Sign Up Now</span></p>
            ) : (
              <p>Already have an account? <span onClick={() => setSignState("Sign In")}>Sign In Now</span></p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
