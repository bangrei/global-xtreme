import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import api from "../api"
import { useStateContext } from "../components/contexts/ContextProvider"

export default function HolidayForm() {
    const {user} = useStateContext()

    if(user.type == 'employee') return <Navigate to="/dashboard"/>
    
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [holiday, setHoliday] = useState({
        id: null,
        name: '',
        date: null,
        remark: '',
    })
    const [errors, setErrors] = useState(null)
    
    const onSubmit = (ev) => {
        ev.preventDefault()
        setErrors(null);
        if(holiday.id) {
            api.put(`/holidays/${holiday.id}`, holiday).then(({data}) => {
                navigate("/setting-attendance");
            }).catch(error => {
                const response = error.response;
                if(response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
        } else {
            api.post(`/holidays`, holiday).then(({data}) => {
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
            api.get(`/holidays/${id}`).then(({data}) => {
                setLoading(false)
                setHoliday(data)
            }).catch(() => {
                setLoading(false)
            })
        }, [])
    }
    return <div className="login-signup-form animated fadeInDown">
        <div className="form">
            {holiday.id && <h1>Update Public Holiday</h1>}
            {!holiday.id && <h1>New Public Holiday</h1>}
            {errors && <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            }
            {!loading && <form onSubmit={ev => onSubmit(ev)}>
                    <input value={holiday.name} onChange={ev => setHoliday({...holiday, name: ev.target.value})} type="text" placeholder="Holiday Name" />
                    <input value={holiday.date} onChange={ev => setHoliday({...holiday, date: ev.target.value})} type="date" placeholder="Date" />
                    <textarea value={holiday.remark} onChange={ev => setHoliday({...holiday, remark: ev.target.value})} placeholder="Remark">{holiday.remark}</textarea>
                    <button className="btn block">Save</button>
                    <Link to="/setting-attendance" className="btn__default">Cancel</Link>
                </form>
            }
        </div>
    </div>
}