import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import api from "../api"
import { useStateContext } from "../components/contexts/ContextProvider"

export default function LeaveForm() {
    const {user} = useStateContext()

    if(user.type == 'employee') return <Navigate to="/dashboard"/>
    
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [leave, setLeave] = useState({
        employee_id: id,
        start: '',
        end: null,
        remark: '',
    })
    const [errors, setErrors] = useState(null)
    
    const onSubmit = (ev) => {
        ev.preventDefault()
        setErrors(null);
        api.post(`/leaves`, leave).then(({data}) => {
            if(data.errors){
                setErrors(data.errors)
                return;
            }
            navigate(`/employee/${id}/leave`);
        }).catch(error => {
            const response = error.response;
            if(response && response.status === 422) {
                setErrors(response.data.errors)
            }
        })
    }
    return <div className="login-signup-form animated fadeInDown">
        <div className="form">
            {leave.id && <h1>Update Leave</h1>}
            {!leave.id && <h1>Apply Leave</h1>}
            {errors && <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            }
            {!loading && <form onSubmit={ev => onSubmit(ev)}>
                    <div className="form__input">
                        <input value={leave.start} onChange={ev => setLeave({...leave, start: ev.target.value})} type="date" placeholder="Start Date" />
                        <span className="label">Start Date</span>
                    </div>
                    <div className="form__input">
                        <input value={leave.end} onChange={ev => setLeave({...leave, end: ev.target.value})} type="date" placeholder="End Date" />
                        <span className="label">End Date</span>
                    </div>
                    <textarea value={leave.remark} onChange={ev => setLeave({...leave, remark: ev.target.value})} placeholder="Remark">{leave.remark}</textarea>
                    <button className="btn block">Save</button>
                    <Link to={`/employee/${id}/leave`} className="btn__default">Cancel</Link>
                </form>
            }
        </div>
    </div>
}