import { useEffect, useState } from "react"
import api from "../api"
import { Link } from "react-router-dom"

export default function Attendance() {
    const [attendances, setAttendances] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getAttendances()
    }, [])

    const getAttendances = () => {
        api.get('/attendances').then(({data}) => {
            setLoading(false)
            setAttendances(data.data)
        }).catch((err) => {
            setLoading(false)
        })
    }

    return <div className="container">
        <div className="table-container">
            <div className="table-header">
                <h3>My Attendances</h3>
                <Link to="/attendance/clock" className="btn__new"><i className="material-icons">work_history</i> New Attendance</Link>
            </div>
            <div className="table-content animated fadeInDown">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Schedule</th>
                            <th>Clock-In</th>
                            <th>Clock-Out</th>
                        </tr>
                    </thead>
                    {loading && <tbody><tr><td colSpan={4}><span className="loading">Loading...</span></td></tr></tbody>}
                    {!loading && attendances && <tbody>
                        {attendances.map(it => (
                            <tr key={it.id}>
                                <td>{it.date}</td>
                                <td>{it.from} - {it.to}</td>
                                <td>{it.in}</td>
                                <td>{it.out}</td>
                            </tr>
                        ))}
                    </tbody>
                    }
                </table>
            </div>
        </div>
    </div>
}