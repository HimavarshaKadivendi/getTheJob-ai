import { useState } from "react";
import {useNavigate } from "react-router";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth"

const Register = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const {loading, handleRegister} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleRegister({username, email, password})
        navigate('/')
    }

    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            {/* wants username, email & password */}
 
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input 
                    onChange={(e) => { setUsername(e.target.value) }}
                    type="text" id="username" name="username" placeholder="Enter your username" />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e) => { setEmail(e.target.value) }}
                    type="email" id="email" name="email" placeholder="Enter your email address" />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e) => { setPassword(e.target.value) }}
                    type="password" id="password" name="password" placeholder="Enter your password" />
                </div>
                <button className="button primary-button" type="submit">Register</button>
            </form>

            <p>Already have an account? <Link to="/login" className="button link-button">Login here</Link></p>
        </div>

    </main>
  )
}

export default Register
