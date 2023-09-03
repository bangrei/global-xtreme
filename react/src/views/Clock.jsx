import { useEffect, useState } from "react"
import { useStateContext } from "../components/contexts/ContextProvider";
import moment from 'moment-timezone'
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Clock() {
    const {user} = useStateContext()
    const [openModal, setOpenModal] = useState(false)
    const [clockType, setClockType] = useState()
    const [loading, setLoading] = useState(false)
    const [payload, setPayload] = useState({
        employee_id: user.id,
        date: "",
        in: "",
        out: "",
        remark: "",
    })
    const navigate = useNavigate()
    const [myschedules, setMySchedules] = useState([])
    const [currentSchedule, setCurrentSchedule] = useState(null)
    const [errors, setErrors] = useState(null)

    useEffect(() => {
        setLoading(true)
        getMySchedules()
        _initPayload()
        setLoading(false)
    }, [])

    const toggleModal = () => {
        setOpenModal(!openModal)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        console.log(payload)
        setErrors([])
        api.post(`/attendances`, payload).then(({data}) => {
            if(data.errors){
                setErrors(data.errors)
                toggleModal()
                return
            }
            navigate('/attendance')
        }).catch(error => {
            const response = error.response;
            if(response && response.status === 422) {
                setErrors(response.data.errors)
            }
        })
    }

    const getMySchedules = () => {
        api.get(`/my-schedules/${user.id}`).then(({data}) => {
            setMySchedules(data.data)
        })
    }

    const onDateChange = (ev) => {
        const selectedDate = ev.target.value;
        const day = moment.tz(selectedDate,'Asia/Jakarta').day();
        getMySchedules()
        setCurrentSchedule(myschedules.find(it => it.weekOfDay == day))
        if(currentSchedule) {
            const sdate = {...payload, date: selectedDate, schedule_id: currentSchedule.id, from: currentSchedule.from, to: currentSchedule.to}
            setPayload(sdate)
        }
    }

    const _initPayload = () => {
        const dt = moment.tz('Asia/jakarta').format('YYYY-MM-DD')
        const time = moment.tz('Asia/jakarta').format("HH:mm")
        const sched = myschedules.find(it => it.date == dt)
        setCurrentSchedule(sched)
        setPayload({
            date: dt,
            employee_id: user.id,
            schedule_id: "",
            from: "",
            to: "",
            in: time,
            out: time,
            remark: "",
        })
    }

    const clockIn = () => {
        //if(!currentSchedule) return;
        setClockType("in")
        setOpenModal(true)
        const dt = moment.tz('Asia/jakarta').format('YYYY-MM-DD')
        const time = moment.tz('Asia/jakarta').format("HH:mm")
        const param = {
            date: dt,
            in: time,
            out: ""
        }
        if(currentSchedule) {
            param.schedule_id = currentSchedule.id
            param.from = currentSchedule.from
            param.to = currentSchedule.to
        }
        setPayload({...payload, ...param})
    }

    const clockOut = () => {
        //if(!currentSchedule) return;
        setClockType("out")
        setOpenModal(true)
        const dt = moment.tz('Asia/jakarta').format('YYYY-MM-DD')
        const time = moment.tz('Asia/jakarta').format("HH:mm")
        const param = {
            date: dt,
            in: "",
            out: time
        }
        if(currentSchedule) {
            param.schedule_id = currentSchedule.id
            param.from = currentSchedule.from
            param.to = currentSchedule.to
        }
        setPayload({...payload, ...param})
    }

    return <div className="container">
        {!currentSchedule && <div className="alert">
            <p style={{display:"flex",alignItems:"center",gap:"12px"}}><i className="material-icons-outlined">info</i> You have no schedule today</p>
        </div>}
        <div className="icon__group">
            <div className="icon__group__wrapper" onClick={clockIn}>
                <i className="icon material-icons">work_history</i><span className="text">Clock In</span>
            </div>
            <div className="icon__group__wrapper" onClick={clockOut}>
                <i className="icon material-icons">work_history</i><span className="text">Clock Out</span>
            </div>
        </div>
        {!loading && <div className={openModal ? 'custom__modal active' : 'custom__modal'}>
            <div className="custom__modal__overlay"></div>
            <div className="custom__modal__dialog animated fadeInDown">
                <form onSubmit={(e) => onSubmit(e)}>
                    <div className="custom__modal__header">
                        <span>Clock {clockType}</span>
                        <i className="header-close material-icons" onClick={toggleModal}>close</i>
                    </div>
                    <div className="custom__modal__body">
                        <div className="form">
                            <div className="form__input">
                                <input type="date" value={payload.date} onChange={(e) => onDateChange(e)} />
                                <span className="label">Date</span>
                            </div>
                            <div className="form__input">
                                <input type="time" value={clockType == "in" ? payload.in : payload.out} onChange={() => setPayload({...payload, in: e.target.value})} />
                                <span className="label">Time</span>
                            </div>
                            <div className="form__input">
                                <textarea placeholder="Remark" value={payload.remark} onChange={(e) => setPayload({...payload, remark: e.target.value})}></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="custom__modal__footer">
                        <div className="btn__group">
                            <button className="btn__delete block">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        }
        {errors && <div className="notification animated fadeInUp">
            {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
            ))}
            </div>
        }
    </div>
}