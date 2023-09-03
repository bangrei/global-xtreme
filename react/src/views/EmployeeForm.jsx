import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import api from "../api"
import { useStateContext } from "../components/contexts/ContextProvider"

export default function EmployeeForm() {
    const {user} = useStateContext()

    if(user.type == 'employee') return <Navigate to="/dashboard"/>
    
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [employee, setEmployee] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        type: 'employee',
        password_confirmation: ''
    })
    const [errors, setErrors] = useState(null)
    
    const onSubmit = (ev) => {
        ev.preventDefault()
        setErrors(null)
        if(employee.id) {
            api.put(`/users/${employee.id}`, employee).then(({data}) => {
                navigate("/employee");
            }).catch(error => {
                const response = error.response;
                if(response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
        } else {
            api.post(`/employees`, employee).then(({data}) => {
                if(data.errors){
                    setErrors(data.errors)
                    return;
                }
                navigate("/employee")
            }).catch(error => {
                const response = error.response;
                setErrors(response.data.errors)
            })
        }
    }
    if(id) {
        useEffect(() => {
            setLoading(true);
            api.get(`/users/${id}`).then(({data}) => {
                setLoading(false)
                setEmployee(data)
            }).catch(() => {
                setLoading(false)
            })
        }, [])
    }
    return <div className="login-signup-form animated fadeInDown">
        <div className="form">
            {employee.id && <h1>Update Employee</h1>}
            {!employee.id && <h1>New Employee</h1>}
            {errors && <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            }
            {!loading && <form onSubmit={onSubmit}>
                    <input value={employee.name} onChange={ev => setEmployee({...employee, name: ev.target.value})} type="text" placeholder="Full Name" />
                    <input value={employee.email} onChange={ev => setEmployee({...employee, email: ev.target.value})} type="email" placeholder="Email Address" />
                    <input value={employee.password} onChange={ev => setEmployee({...employee, password: ev.target.value})} type="password" placeholder="Password" />
                    <input value={employee.password_confirmation} onChange={ev => setEmployee({...employee, password_confirmation: ev.target.value})} type="password" placeholder="Password Confirmation" />
                    <button className="btn block">Save</button>
                    <Link to="/Employee" className="btn__default">Cancel</Link>
                </form>
            }
        </div>
    </div>
}