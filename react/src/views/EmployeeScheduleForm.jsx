import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import api from "../api"
import { useStateContext } from "../components/contexts/ContextProvider"

export default function EmployeeScheduleForm() {
    const {user} = useStateContext()

    if(user.type == 'employee') return <Navigate to="/dashboard"/>
    
    const {id, scheduleId} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [employee, setEmployee] = useState({})
    const [schedule, setSchedule] = useState({})
    const [schedules, setSchedules] = useState([])
    const [day, setDay] = useState(-1)
    const [errors, setErrors] = useState(null)

    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

    const _setSchedule = () => {
        setSchedule({
            employee_id: employee.id,
            schedule_id: "",
            week_of_day: "",
            name: "",
            from: "",
            to: ""
        })
    }

    const _setDay = (ev,it) => {
        ev.target.parentElement.previousElementSibling.checked = false
        setDay(days.indexOf(it))
    } 

    const _selectSchedule = (ev,it) => {
        ev.target.parentElement.previousElementSibling.checked = false
        const param = {
            employee_id: employee.id,
            schedule_id: it.id,
            week_of_day: day,
            name: it.name,
            from: it.from,
            to: it.to
        }
        setSchedule(param)
    }
    
    const onSubmit = (ev) => {
        ev.preventDefault()
        setErrors(null)
        console.log(schedule);

        setLoading(true)
        api.post(`/employee-schedules/`, schedule).then(() => {
            setLoading(false)
            navigate(`/employee/${employee.id}/schedule`)
        })
    }
    
    useEffect(() => {
        if(id) {
            setLoading(true);
            api.get(`/users/${id}`).then(({data}) => {
                setLoading(false)
                setEmployee(data)
                _setSchedule()
            }).catch(() => {
                setLoading(false)
            })
        }
        getSchedules()
    }, [])
    const getSchedules = () => {
        api.get('/schedules').then(({data}) => {
            setLoading(false)
            setSchedules(data.data)
        }).catch((err) => {
            setLoading(false)
        })
    }
    return <div className="login-signup-form animated fadeInDown">
        <div className="form">
            {schedule.id && <h1>Update Schedule</h1>}
            {!schedule.id && <h1>New Schedule</h1>}
            {errors && <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            }
            {!loading && <form onSubmit={onSubmit}>
                    <div className="options">
                        <div className="option-select">
                            <span>{day > -1 ? days[day] : '-- Day --'}</span>
                            <span className="material-icons">expand_more</span>
                        </div>
                        <input type="checkbox" />
                        <div className="option-wrapper animated fadeInDown">
                            {days.map(it => (
                                <div key={it} onClick={(ev) => _setDay(ev,it)} className="option-item">{it}</div>
                            ))}
                        </div>
                    </div>
                    <div className="options">
                        <div className="option-select">
                            <span>{schedule.schedule_id ? `${schedule.name} (${schedule.from} - ${schedule.to})` : '-- Schedule --'}</span>
                            <span className="material-icons">expand_more</span>
                        </div>
                        <input type="checkbox" />
                        <div className="option-wrapper animated fadeInDown">
                            {schedules.map(it => (
                                <div key={it.id} onClick={(ev) => _selectSchedule(ev,it)} className="option-item">{it.name} ({it.from} - {it.to})</div>
                            ))}
                        </div>
                    </div>
                    <button className="btn block">Save</button>
                    <Link to={`/employee/${employee.id}/schedule`} className="btn__default">Cancel</Link>
                </form>
            }
        </div>
    </div>
}