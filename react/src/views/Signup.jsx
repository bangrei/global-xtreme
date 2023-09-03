import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api"
import { useStateContext } from "../components/contexts/ContextProvider"

export default function Signup() {
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmationRef = useRef()

    const {setUser, setToken} = useStateContext()
    const [errors, setErrors] = useState(null)

    const onSubmit = (ev) => {
        ev.preventDefault()
        setErrors(null)
        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        }
        api.post('/signup', payload).then(({data}) => {
            setToken(data.token)
            setUser(data.user)
        }).catch(error => {
            const response = error.response;
            if(response && response.status === 422) {
                setErrors(response.data.errors)
            }
        })
    }
    return <div className="login-signup-form animated fadeInDown">
        <div className="form">
            <h1>Sign up</h1>
            {errors && <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            }
            <form onSubmit={onSubmit}>
                <input ref={nameRef} type="text" placeholder="Full Name" />
                <input ref={emailRef} type="email" placeholder="Email Address" />
                <input ref={passwordRef} type="password" placeholder="Password" />
                <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation" />
                <button className="btn block">Create an account</button>
                <p className="foot-note">
                    Already Registered? <Link to="/login">Sign in</Link>
                </p>
            </form>
        </div>
    </div>
}