import { useEffect, useState } from "react"
import api from "../api";
import { Link, Navigate } from "react-router-dom";
import { useStateContext } from "../components/contexts/ContextProvider";

export default function Employee() {
    const {user} = useStateContext()

    if(user.type == 'employee') return <Navigate to="/dashboard"/>

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true);
        getUsers()
    }, [])

    const getUsers = () => {
        api.get('/employees').then(({data}) => {
            setLoading(false)
            setUsers(data.data)
        }).catch((err) => {
            setLoading(false)
        })
    }

    const onDelete = (u) => {
        if(!window.confirm("Are you sure to delete Employee?")) return;
        api.delete(`/users/${u.id}`).then(({data}) => {
            getUsers()
        })
    }
    return <div className="table-container">
        <div className="table-header">
            <h1>Employees</h1>
            <Link to="/employee/new" className="btn__new">Add New</Link>
        </div>
        <div className="table-content animated fadeInDown">
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                {loading && <tbody><tr><td colSpan={5}><span className="loading">Loading...</span></td></tr></tbody>}
                {!loading && <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.created_at}</td>
                            <td className="btn__group">
                                <Link to={'/employee/' + u.id} className="btn__group__edit">Edit</Link>
                                <Link to={'/employee/' + u.id + '/schedule'} className="btn__group__default">Schedule</Link>
                                <Link to={'/employee/' + u.id + '/leave'} className="btn__group__default">Leave</Link>
                                <button onClick={() => onDelete(u)} className="btn__group__delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                }
            </table>
        </div>
    </div>
}