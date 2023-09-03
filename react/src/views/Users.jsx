import { useEffect, useState } from "react"
import api from "../api";
import { Link } from "react-router-dom";

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true);
        getUsers()
    }, [])

    const getUsers = () => {
        api.get('/users').then(({data}) => {
            setLoading(false)
            setUsers(data.data)
        }).catch((err) => {
            setLoading(false)
        })
    }

    const onDelete = (u) => {
        if(!window.confirm("Are you sure to delete user?")) return;
        api.delete(`/users/${u.id}`).then(({data}) => {
            getUsers()
        })
    }
    return <div className="table-container">
        <div className="table-header">
            <h1>Users</h1>
            <Link to="/users/new" className="btn__new">Add New</Link>
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
                                <Link to={'/users/' + u.id} className="btn__group__edit">Edit</Link>
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