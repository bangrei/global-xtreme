import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "./contexts/ContextProvider.jsx";
import api from "../api";

export default function DefaultLayout() {
    const {user,token,setUser,setToken} = useStateContext()
    if(!token) return <Navigate to="/login"/>
    
    const [loading, setLoading] = useState(false)
    const [fold, setFold] = useState(false)

    const location = useLocation();
    const currentPage = location.pathname;

    const onLogout = (ev) => {
        ev.preventDefault()
        setLoading(true)
        api.post('/logout').then(() => {
            setLoading(false)
            setToken('')
            setUser({})
        }).catch((error) => {
            setLoading(false)
        })
    }

    useEffect(() => {
        setLoading(true)
        api.get('/user').then(({data}) => {
            setLoading(false)
            setUser(data)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    return <div className="layout">
        <aside className={fold ? 'folded' : ''}>
            <div className="title">Employee Management</div>
            {user.type == 'employee' && <div className="nav">
                <Link to="/dashboard" className={currentPage == '/dashboard' ? 'active' : 'no'}><small className="material-icons-outlined">widgets</small>Dashboard</Link>
                <Link to="/attendance" className={currentPage == '/attendance' ? 'active' : 'no'}><small className="material-icons-outlined">book</small>Attendance</Link>
            </div>}
            {user.type !== 'employee' && <div className="nav">
                <Link to="/dashboard" className={currentPage == '/dashboard' ? 'active' : 'no'}><small className="material-icons-outlined">widgets</small>Dashboard</Link>
                <Link to="/employee" className={currentPage == '/employee' ? 'active' : 'no'}><small className="material-icons-outlined">view_in_ar</small>Employee</Link>
                <Link to="/attendance" className={currentPage == '/attendance' ? 'active' : 'no'}><small className="material-icons-outlined">book</small>Attendance</Link>
                <Link to="/setting-attendance" className={currentPage == '/setting-attendance' ? 'active' : 'no'}><small className="material-icons-outlined">card_membership</small>Setting Attendance</Link>
                <Link to="/users" className={currentPage.indexOf('/users') > -1 ? 'active' : 'no'}><small className="material-icons-outlined">person_search</small>Users</Link>
            </div>
            }
        </aside>
        <div className="content">
            <header className={fold ? 'folded' : ''}>
                <div className="header-left" onClick={() => setFold(!fold)}><small className="burger material-icons-outlined">menu</small> Dashboard</div>
                <div className="user-con">
                    <span>Hi, {user.name}</span>
                    <a href="#" onClick={ev => onLogout(ev)} className="btn">Logout</a>
                </div>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    </div>
}