import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../api"

export default function EmployeeSchedule() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [schedules, setSchedules] = useState([])
    const [myschedules, setMySchedules] = useState([])
    const [user, setUser] = useState({})

    useEffect(() => {
        getUser()
        getMySchedules()
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

    const getMySchedules = () => {
        setLoading(true)
        api.get(`/my-schedules/${id}`).then(({data}) => {
            setLoading(false)
            setMySchedules(data.data)
        }).catch(() => {
            setLoading(false)
        })
    }
    const getUser = () => {
        setLoading(true);
        api.get(`/users/${id}`).then(({data}) => {
            setLoading(false)
            setUser(data)
        }).catch(() => {
            setLoading(false)
        })
    }
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    const onDelete = (item) => {
        if(!window.confirm("Are you sure to delete Schedule?")) return;
        setLoading(true)
        api.delete(`/employee-schedules/${item.id}`).then(() => {
            setLoading(false)
            getMySchedules()
        })
    }
    return <div className="table-container">
        <div className="table-header">
            <h1>Employee: {user.name}</h1>
            <Link to={`/employee/${user.id}/schedule/new`} className="btn__new">Add New</Link>
        </div>
        <div className="table-content animated fadeInDown">
            <table className="table">
                <thead>
                    <tr>
                        <th>Schedule</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {loading && <tbody><tr><td colSpan={5}><span className="loading">Loading...</span></td></tr></tbody>}
                {!loading && myschedules && <tbody>
                    {myschedules.map(it => (
                        <tr key={it.id}>
                            <td>{days[it.weekOfDay]}</td>
                            <td>{it.from}</td>
                            <td>{it.to}</td>
                            <td className="btn__group">
                                <button onClick={() => onDelete(it)} className="btn__group__delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                }
            </table>
        </div>
    </div>
}