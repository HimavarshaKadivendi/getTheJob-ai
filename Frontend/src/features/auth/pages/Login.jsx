import "../auth.form.scss";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({email, password}); // manages everything --> loadingState = true, call api, where-we-store-users data from frontend
        navigate("/");
    }

    if(loading){
        return (<main><h1>Loading...</h1></main>)
    }

  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>
            {/* wants email & password */}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                    onChange={(e) => { setEmail(e.target.value)}}
                    type="email" id="email" name="email" placeholder="Enter your email address" />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                    onChange={(e) => {setPassword(e.target.value)}}
                    type="password" id="password" name="password" placeholder="Enter your password" />
                </div>
                <button className="button primary-button" type="submit">Login</button>
            </form>

            <p>Don't have an account? <Link to="/register" className="button link-button">Register here</Link></p>
        </div>

    </main>
  )
}

export default Login
