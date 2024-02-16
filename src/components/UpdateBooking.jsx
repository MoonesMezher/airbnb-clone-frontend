import { useEffect, useState } from "react"
import Input from "./Input"
import axios from "axios";
import { apiUrl } from "../constant/apiUrl";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext";
import Button from "./Button";
import { differenceInCalendarDays } from "date-fns";
import Loading from "./Loading";
import ErrorInput from "./ErrorInput";
import { useBookingContext } from "../hooks/useBookingContext";
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const UpdateBooking = () => {
    const [place, setPlace] = useState();
    const [bookingInfo, setBookingInfo] = useState();
    const [checkIn, setCheckIn] = useState();
    const [checkOut, setCheckOut] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [maxGuests, setMaxGuests] = useState();
    const [phone, setPhone] = useState();
    const [name, setName] = useState();

    const { user } = useUserContext();
    const { booking, dispatch } = useBookingContext()
    const { mood } = useThemeMoodContext()

    const { id } = useParams()

    const to = useNavigate();

    const generatePrice = (price, per, days) => {
        let output = 0;
        if(per.toLowerCase() == "hour") {
            output = 24*price;
        } else if(per.toLowerCase() == "day") {
            output = price;
        } else if(per.toLowerCase() == "month") {
            output = price/30;
        } else if(per.toLowerCase() == "year") {
            output = price/360;
        }
        return output*days;
    }

    const handleBookingClick = (e) => {
        e.preventDefault();

        setIsLoading(true);

        const price = place && checkIn && checkOut && generatePrice(place.price, place.per, differenceInCalendarDays(new Date(checkOut),new Date(checkIn)));
        const data = { name, phone, price, checkIn, checkOut, guests:maxGuests }

        axios.put(`${apiUrl}/booking/update/${id}`, data, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => {
                if(res.statusText !== 'OK') {
                    return setError(res.error)
                }
                dispatch({type: "UPDATE_BOOKING", payload: res.data})

                to(`/booking/${id}`)
            })
        
        setIsLoading(false);
    }

    useEffect(() => {
        if(!user) {
            return
        }

        setIsLoading(true)

        axios.get(`${apiUrl}/booking/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => {
                if(res.statusText !== 'OK') {
                    return setError(res.error)
                }
                setBookingInfo(res.data)
                setName(res.data.username)
                setPhone(res.data.phoneNumber)
                setMaxGuests(res.data.quests)
                setCheckIn(res.data.checkIn)
                setCheckOut(res.data.checkOut)
            })
        
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if(!user) {
            return
        }

        setIsLoading(true)

        if(bookingInfo) {
            axios.get(`${apiUrl}/place/${bookingInfo.placeId}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => {
                    if(res.statusText !== 'OK') {
                        return setError(res.error)
                    }
                    setPlace(res.data)
                })
        }

        setIsLoading(false)
    }, [bookingInfo])

    return (
        <form className="mt-14 px-4">
            {place && bookingInfo && 
                <div className={`${mood === 'MOON'? 'bg-black':'bg-white'}mb-3 lg:mt-5 lg:mb-0 p-[2em] rounded-lg h-fit`}>
                    <h2 className={`${mood === 'MOON'? 'text-white': 'text-black'} font-bold mb-5 text-xl`}>Update Booking</h2>
                    <h2><span className={`font-bold text-[1.2rem] ${mood === 'MOON'? 'text-white': 'text-black'}`}>${place.price} Per</span> {place.per}</h2>
                    <div className={`my-5 rounded-md border-[1px] border-solid border-[#ccc] flex flex-col ${mood === 'MOON'? 'text-white': 'text-black'}`}>
                        <div className="border-b-solid border-b-[1px] border-[#ccc] flex flex-col min-[500px]:flex-row justify-center">
                            <span className="flex-[50%] border-b-[1px] border-b-[#ccc] border-b-solid min-[500px]:border-b-0 min-[500px]:border-r-[1px] min-[500px]:border-r-[#ccc] min-[500px]:border-r-solid p-[1em]">
                                <label className="font-bold">Check&nbsp;In</label>
                                <br/>
                                <input defaultValue={checkIn} onChange={(e) => setCheckIn(e.target.value)} type="date" className={`${mood === 'MOON'? 'bg-black': 'bg-white'} outline-none w-full sm:w-fit`}/>
                            </span>
                            <span className="flex-[50%] p-[1em]">
                                <label className="font-bold">Check&nbsp;Out</label>
                                <br/>
                                <input defaultValue={checkOut} onChange={(e) => setCheckOut(e.target.value)} type="date" className={`${mood === 'MOON'? 'bg-black': 'bg-white'} outline-none w-full sm:w-fit`}/>
                            </span>
                        </div>
                        <span className="p-[1em]">
                            <h2 className="font-bold">Guests</h2>
                            <input defaultValue={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} type="number" className={`${mood === 'MOON'? 'bg-black': 'bg-white'} w-full outline-none`} min={1} max={place.maxGuests} placeholder={1} />
                        </span>
                    </div>
                    {checkIn && checkOut && differenceInCalendarDays(new Date(checkOut),new Date(checkIn)) >= 0 && (
                        <>
                            <p className={`${mood === 'MOON'? 'text-white': 'text-black'} ml-2 mb-5`}>Your booking for <span className="font-bold">{differenceInCalendarDays(new Date(checkOut),new Date(checkIn))}</span> days</p>
                            <Input type={'text'} value={name} onChange={(e) => setName(e.target.value) } placeholder={'Full name'} style={'mb-5'}/>
                            <Input type={'tel'} value={phone} onChange={(e) => setPhone(e.target.value) } placeholder={'Phone number'} style={'mb-5'}/>
                            <p className={`${mood === 'MOON'? 'text-white': 'text-black'} ml-2 mb-5`}>Cost <span className="font-bold">${generatePrice(place.price,place.per, differenceInCalendarDays(new Date(checkOut),new Date(checkIn)))}</span></p>
                        </>
                    )}
                    <div onClick={(e) => handleBookingClick(e)}>
                        <Button value={'Save'}/>
                    </div>
                </div>
            }
            {error && <ErrorInput error={error}/>}
            {isLoading && <Loading/>}
        </form>
    )
}

export default UpdateBooking