import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import api from "../api"
import { useStateContext } from "../components/contexts/ContextProvider.jsx"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()

    const {setUser, setToken} = useStateContext()
    const [errors, setErrors] = useState(null)
    const onSubmit = (ev) => {
        ev.preventDefault()
        setErrors(null)
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        api.post('/login', payload).then(({data}) => {
            setToken(data.token)
            setUser(data.user)
        }).catch(error => {
            const response = error.response;
            if(response && response.status === 422) {
                if(response.data.errors) {
                    setErrors(response.data.errors)
                } else {
                    setErrors({
                        email: [response.data.message]
                    })
                }
            }
        })
    }
    return <div className="login-signup-form animated fadeInDown">
        <div className="form">
            <h1>Login into your account</h1>
            {errors && <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            }
            <form onSubmit={onSubmit}>
                <input ref={emailRef} type="email" placeholder="Email Address" />
                <input ref={passwordRef} type="password" placeholder="Password" />
                <button className="btn block">Login</button>
                <p className="foot-note">
                    Not Registered? <Link to="/signup">Create an account</Link>
                </p>
            </form>
        </div>
    </div>
}