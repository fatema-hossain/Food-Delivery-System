import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { auth } from './firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth'

const LoginPopup = ({setShowLogin}) => {

    const [currState,setCurrState] = useState("Login")
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (currState === "Sign Up") {
                // Create new user
                const userCredential = await createUserWithEmailAndPassword(
                    auth, 
                    formData.email, 
                    formData.password
                )
                
                // Update profile with display name
                await updateProfile(userCredential.user, {
                    displayName: formData.name
                })
                
                setShowLogin(false)
                setFormData({ name: '', email: '', password: '' })
            } else {
                // Sign in existing user
                await signInWithEmailAndPassword(
                    auth, 
                    formData.email, 
                    formData.password
                )
                
                setShowLogin(false)
                setFormData({ name: '', email: '', password: '' })
            }
        } catch (error) {
            console.error('Auth error:', error)
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists.')
                    break
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.')
                    break
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters long.')
                    break
                case 'auth/user-not-found':
                    setError('No account found with this email address.')
                    break
                case 'auth/wrong-password':
                    setError('Incorrect password.')
                    break
                default:
                    setError('An error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const toggleState = () => {
        setCurrState(currState === "Login" ? "Sign Up" : "Login")
        setError('')
        setFormData({ name: '', email: '', password: '' })
    }

  return (
    <div className='login-popup'>
        <form className="login-popup-container" onSubmit={handleSubmit}>
            <div className="login-popup-title">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt="" />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="login-popup-inputs">
                {currState==="Sign Up" && (
                    <input 
                        type="text" 
                        name="name"
                        placeholder='Your name' 
                        value={formData.name}
                        onChange={handleInputChange}
                        required 
                    />
                )}
                <input 
                    type="email" 
                    name="email"
                    placeholder='Your email' 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                />
                <input 
                    type="password" 
                    name="password"
                    placeholder='Password' 
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Loading...' : (currState==="Sign Up"?"Create account":"Login")}
            </button>
            <div className="login-popup-condition">
                <input type="checkbox" required/>
                <p>By continuing,I agree to the terms of use & privacy policy.</p>
           </div>
           {currState==="Login"
                ?<p>Create a new account? <span onClick={toggleState}>Click here</span></p>
                :<p>Already have an account? <span onClick={toggleState}>Login here</span></p>
                
            }
        </form>
    </div>
  )
}

export default LoginPopup
