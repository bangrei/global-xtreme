import {Navigate, createBrowserRouter} from 'react-router-dom';
import Login from './views/Login';
import Signup from './views/SignUp';
import NotFound from './views/NotFound';
import Users from './views/Users';
import Employee from './views/Employee';
import Attendance from './views/Attendance';
import SettingAttendance from './views/SettingAttendance';
import GuestLayout from './components/GuestLayout';
import DefaultLayout from './components/DefaultLayout';
import Dashboard from './views/Dashboard';
import UserForm from './views/UserForm';
import EmployeeForm from './views/EmployeeForm';
import EmployeeSchedule from './views/EmployeeSchedule';
import ScheduleForm from './views/ScheduleForm';
import EmployeeScheduleForm from './views/EmployeeScheduleForm';
import HolidayForm from './views/HolidayForm';
import Clock from './views/Clock';
import Leave from './views/Leave';
import LeaveForm from './views/LeaveForm';

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to="/dashboard" />
            },
            {
                path: '/dashboard',
                element: <Dashboard/>
            },
            {
                path: '/users',
                element: <Users/>
            },
            {
                path: '/users/new',
                element: <UserForm/>
            },
            {
                path: '/users/:id',
                element: <UserForm/>
            },
            {
                path: '/employee',
                element: <Employee/>
            },
            {
                path: '/employee/new',
                element: <EmployeeForm/>
            },
            {
                path: '/employee/:id',
                element: <EmployeeForm/>
            },
            {
                path: '/attendance',
                element: <Attendance />
            },
            {
                path: '/setting-attendance',
                element: <SettingAttendance/>
            },
            {
                path: '/holiday/new',
                element: <HolidayForm/>
            },
            {
                path: '/holiday/:id',
                element: <HolidayForm/>
            },
            {
                path: 'employee/:id/schedule',
                element: <EmployeeSchedule/>
            },
            {
                path: 'employee/:id/schedule/new',
                element: <EmployeeScheduleForm/>
            },
            {
                path: 'employee/:id/schedule/:scheduleId',
                element: <EmployeeScheduleForm/>
            },
            {
                path: '/schedule/new',
                element: <ScheduleForm/>
            },
            {
                path: '/schedule/:id',
                element: <ScheduleForm/>
            },
            {
                path: 'attendance/clock',
                element: <Clock/>
            },
            {
                path: '/employee/:id/leave',
                element: <Leave/>
            },
            {
                path: '/employee/:id/leave/new',
                element: <LeaveForm/>
            }
        ]
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/',
                element: <Navigate to="/login" />
            },
            {
                path: '/login',
                element: <Login/>
            },
            {
                path: '/signup',
                element: <Signup/>
            },
        ]
    },
    {
        path: '*',
        element: <NotFound/>
    },
])

export default router