import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../api";
import { useStateContext } from "../components/contexts/ContextProvider";

export default function SettingAttendance() {
    const {user} = useStateContext()

    if(user.type == 'employee') return <Navigate to="/dashboard"/>

    const [schedules, setSchedules] = useState([])
    const [holidays, setHolidays] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getSchedules()
        getHolidays()
    }, [])

    const getSchedules = () => {
        api.get('/schedules').then(({data}) => {
            setLoading(false)
            setSchedules(data.data)
        }).catch((err) => {
            setLoading(false)
        })
    }

    const getHolidays = () => {
        api.get('/holidays').then(({data}) => {
            setLoading(false)
            setHolidays(data.data)
        }).catch((err) => {
            setLoading(false)
        })
    }

    const onDelete = (u) => {
        if(!window.confirm("Are you sure to delete Employee?")) return;
        api.delete(`/schedules/${u.id}`).then(({data}) => {
            setSchedules()
        })
    }

    const onDeleteHoliday = (u) => {
        if(!window.confirm("Are you sure to delete Public Holiday?")) return;
        api.delete(`/holidays/${u.id}`).then(({data}) => {
            setHolidays()
        })
    }

    return <div className="container">
        <div className="table-container">
            <div className="table-header">
                <h2>Shift Schedules</h2>
                <Link to="/schedule/new" className="btn__new">Add New</Link>
            </div>
            <div className="table-content animated fadeInDown">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Shift Name</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && <tbody><tr><td colSpan={5}><span className="loading">Loading...</span></td></tr></tbody>}
                    {!loading && schedules && <tbody>
                        {schedules.map(it => (
                            <tr key={it.id}>
                                <td>{it.name}</td>
                                <td>{it.from}</td>
                                <td>{it.to}</td>
                                <td>{it.created_at}</td>
                                <td className="btn__group">
                                    <Link to={'/schedule/' + it.id} className="btn__group__edit">Edit</Link>
                                    <button onClick={() => onDelete(it)} className="btn__group__delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    }
                </table>
            </div>
        </div>
        <div className="table-container">
            <div className="table-header">
                <h2>Public Holiday</h2>
                <Link to="/holiday/new" className="btn__new">Add New</Link>
            </div>
            <div className="table-content animated fadeInDown">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Public Holiday</th>
                            <th>Date</th>
                            <th>Remark</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && <tbody><tr><td colSpan={4}><span className="loading">Loading...</span></td></tr></tbody>}
                    {!loading && holidays && <tbody>
                        {holidays.map(it => (
                            <tr key={it.id}>
                                <td>{it.name}</td>
                                <td>{it.date}</td>
                                <td>{it.remark}</td>
                                <td className="btn__group">
                                    <Link to={'/holiday/' + it.id} className="btn__group__edit">Edit</Link>
                                    <button onClick={() => onDeleteHoliday(it)} className="btn__group__delete">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    }
                </table>
            </div>
        </div>
    </div>
}