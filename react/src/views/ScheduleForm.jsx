import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import api from "../api"
import { useStateContext } from "../components/contexts/ContextProvider"

export default function ScheduleForm() {
    const {user} = useStateContext()

    if(user.type == 'employee') return <Navigate to="/dashboard"/>
    
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [schedule, setSchedule] = useState({
        id: null,
        name: '',
        from: '',
        to: '',
    })
    const [errors, setErrors] = useState(null)
    
    const onSubmit = (ev) => {
        ev.preventDefault()
        setErrors(null);
        if(schedule.id) {
            api.put(`/schedules/${schedule.id}`, schedule).then(({data}) => {
                navigate("/setting-attendance");
            }).catch(error => {
                const response = error.response;
                if(response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
        } else {
            api.post(`/schedules`, schedule).then(({data}) => {
                if(data.errors){
                    setErrors(data.errors)
                    return;
                }
                navigate("/setting-attendance");
            }).catch(error => {
                const response = error.response;
                if(response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
        }
    }
    if(id) {
        useEffect(() => {
            setLoading(true);
            api.get(`/schedules/${id}`).then(({data}) => {
                setLoading(false)
                setSchedule(data)
            }).catch(() => {
                setLoading(false)
            })
        }, [])
    }
    return <div className="login-signup-form animated fadeInDown">
        <div className="form">
            {schedule.id && <h1>Update Shift</h1>}
            {!schedule.id && <h1>New Shift</h1>}
            {errors && <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            }
            {!loading && <form onSubmit={ev => onSubmit(ev)}>
                    <input value={schedule.name} onChange={ev => setSchedule({...schedule, name: ev.target.value})} type="text" placeholder="Schedule Name" />
                    <input value={schedule.from} onChange={ev => setSchedule({...schedule, from: ev.target.value})} type="time" placeholder="Start Time" />
                    <input value={schedule.to} onChange={ev => setSchedule({...schedule, to: ev.target.value})} type="time" placeholder="End Time" />
                    <button className="btn block">Save</button>
                    <Link to="/setting-attendance" className="btn__default">Cancel</Link>
                </form>
            }
        </div>
    </div>
}