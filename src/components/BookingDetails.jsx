import axios from "axios"
import { useEffect, useState } from "react"
import { apiUrl } from "../constant/apiUrl"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useUserContext } from "../hooks/useUserContext"
import ErrorInput from "./ErrorInput"
import Button from "./Button"
import { useBookingContext } from "../hooks/useBookingContext"
import Loading from "./Loading"
import { useThemeMoodContext } from "../hooks/useThemeMoodContext"

const BookingDetails = () => {
    const [booking, setBooking] = useState();
    const [place, setPlace] = useState();
    const [userInfo, setUserInfo] = useState();
    const [error, setError] = useState();
    const [remove, setRemove] = useState();
    const [isLoading, setIsLoading] = useState(false)

    const { id } = useParams();

    const { user } = useUserContext();
    const { dispatch } = useBookingContext();
    const { mood } = useThemeMoodContext()

    const to = useNavigate();

    const handleRemoveClick = () => {
        setRemove(false);

        if(!user) {
            return;
        }

        setIsLoading(true);

        axios.delete(`${apiUrl}/booking/remove/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => {
                if(res.statusText !== "OK") {
                    return setError(res.error);
                }
                dispatch({type: 'REMOVE_BOOKING', payload: res.data})
                setError('')
                to('/account/bookings')
            })
        setIsLoading(false);
    } 

    useEffect(() => {
        if(!user) {
            return
        }
        axios.get(`${apiUrl}/booking/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => {
                if(res.statusText !== 'OK') {
                    return setError(res.error);
                }
                setBooking(res.data)
            })
    }, [])

    useEffect(() => {
        if(!user) {
            return
        }
        if(booking) {
            axios.get(`${apiUrl}/place/${booking.placeId}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => {
                    if(res.statusText !== 'OK') {
                        return setError(res.error);
                    }
                    setPlace(res.data)
                })
        }
    }, [booking])

    useEffect(() => {
        if(!user) {
            return
        }
        if(booking) {
            axios.get(`${apiUrl}/user/${booking.userId}`)
                .then(res => {
                    if(res.statusText !== 'OK') {
                        return setError(res.error);
                    }
                    setUserInfo(res.data)
                })
        }
    }, [booking])

    return (
        <div className={`mt-14 px-[1em] flex flex-col gap-5`}>
            <div>
                <h2 className={`font-bold text-lg mb-2 ${mood === 'MOON'? 'text-white': 'text-black'}`}>Booking Details</h2>
                <div className="flex flex-col gap-2">
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Name:</span> {booking && booking.username}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Phone</span>: {booking && booking.phoneNumber}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Guests:</span> {booking && booking.guests}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Check In:</span> {booking && booking.checkIn}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Check Out:</span> {booking && booking.checkOut}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Price:</span> ${booking && booking.price}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">{booking && (booking.updatedAt === booking.createdAt)? "Created At:":"Updated At:"}</span> {booking && Date(booking.updatedAt).split(" ").slice(0, 4).join(" ")}</p>
                </div>
                <div className="flex gap-3 mt-2 flex-col sm:flex-row">
                    <Link to={`/booking/update/${booking && booking._id}`}>
                        <Button value={'Update'}/>
                    </Link>
                    <Link onClick={() => setRemove(true)}>
                        <Button value={'Remove'}/>
                    </Link>
                </div>
            </div>
            <div>
                <h2 className={`font-bold text-lg mb-2 ${mood === 'MOON'? 'text-white': 'text-black'}`}>Place Details</h2>
                <div className="flex flex-col gap-2">
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Title:</span> {place && place.title}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Address:</span> {place && place.address}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Description</span>: {place && place.description}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Owner:</span> {userInfo && userInfo.name}</p>
                    <p className="p-2 bg-[#eee] rounded-md"><span className="font-bold">Price:</span> ${place && place.price}</p>
                </div>

                <div className="flex gap-3 mt-2 flex-col sm:flex-row">
                    <Link to={`/place/${booking && booking.placeId}`}>
                        <Button value={'View Place'}/>
                    </Link>
                    <Link to={`/user/${booking && booking.userId}`}>
                        <Button value={'Visit Owner'}/>
                    </Link>
                </div>
            </div>
            {remove && (
                <div className="fixed top-0 left-[50%] border-[1px] border-[#ddd] border-solid z-50 translate-x-[-50%] p-[1.5em] rounded-lg bg-white shadow-md">
                    <p className="font-bold">Are you sure to remove this booking?</p>
                    <div className="flex gap-3 mt-5 flex-wrap">
                        <span onClick={handleRemoveClick} className="rounded-md cursor-pointer py-[.5em] px-[1em] bg-green-600 text-white">Yes</span>
                        <span onClick={() => setRemove(false)} className="rounded-md cursor-pointer py-[.5em] px-[1em] bg-[red] text-white">No</span>
                    </div>
                </div>
            )}
            {isLoading && <Loading/>}
            {error && <ErrorInput error={error}/>}
        </div>
    )
}

export default BookingDetails