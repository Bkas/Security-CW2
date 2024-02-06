import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import img from '../../assets/img3.jpg'
import { register } from '../../redux/authSlice'
import classes from './signup.module.css'
import zxcvbn from 'zxcvbn';

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(null);

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Check password strength using zxcvbn
    const result = zxcvbn(newPassword);
    setPasswordStrength(result.score); // Score ranges from 0 to 4
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/auth/register`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      })
      if(!res.status !== 201){
        throw new Error("Register failed!")
      }
      const data = await res.json()

      dispatch(register(data))
      navigate('/')
    } catch (error) {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 2500)
      console.error(error)
    }
  }
  return (
    <div className={classes.signUpContainer}>
      <div className={classes.signupWrapper}>
        <div className={classes.signupLeftSide}>
          <img src={img} className={classes.leftImg} alt="Signup" />
        </div>
        <div className={classes.signupRightSide}>
          <h2 className={classes.title}>Sign Up</h2>
          <form onSubmit={handleRegister} className={classes.signupForm}>
            <input type="text" placeholder="Type username" onChange={(e) => setUsername(e.target.value)} />
            <input type="email" placeholder="Type email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Type password" onChange={handlePasswordChange} />
            {passwordStrength !== null && (
              <div className={classes.passwordStrength}>
                Password Strength: {passwordStrength}/4
              </div>
            )}
            <button className={classes.submitBtn} disabled={passwordStrength < 3}>
              Sign Up
            </button>
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </form>
          {error && (
            <div className={classes.errorMessage}>
              Wrong credentials! Try different ones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;