import { useEffect, useState } from "react"
import api from "../api"
import { Link, useParams } from "react-router-dom"

export default function Leave() {
    const [leaves, setLeaves] = useState([])
    const [user, setUser] = useState({name:""})
    const [loading, setLoading] = useState(false)
    const {id} = useParams()

    useEffect(() => {
        getUser()
        getLeaves()
    }, [])

    const getLeaves = () => {
        api.get(`/my-leaves/${id}`).then(({data}) => {
            setLoading(false)
            setLeaves(data.data)
        }).catch((err) => {
            setLoading(false)
        })
    }

    const getUser = () => {
        api.get(`/users/${id}`).then(({data}) => {
            setLoading(false)
            setUser(data)
        }).catch((err) => {
            setLoading(false)
        })
    }

    return <div className="container">
        <div className="table-container">
            {!loading && <div className="table-header">
                <h3>Employee: {user.name}</h3>
                
                <Link to={`/employee/${id}/leave/new`} className="btn__new"><i className="material-icons">work_history</i> Apply Leave</Link>
            </div>
            }
            <div className="table-content animated fadeInDown">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Start</th>
                            <th>End</th>
                            <th>Remark</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    {loading && <tbody><tr><td colSpan={4}><span className="loading">Loading...</span></td></tr></tbody>}
                    {!loading && leaves && <tbody>
                        {leaves.map(it => (
                            <tr key={it.id}>
                                <td>{it.start}</td>
                                <td>{it.end}</td>
                                <td>{it.remark}</td>
                                <td>{it.created_at}</td>
                            </tr>
                        ))}
                    </tbody>
                    }
                </table>
            </div>
        </div>
    </div>
}