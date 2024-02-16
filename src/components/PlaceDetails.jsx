import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"
import { apiUrl } from "../constant/apiUrl";
import { useUserContext } from "../hooks/useUserContext";
import { useBookingContext } from "../hooks/useBookingContext";
import { usePlaceContext } from "../hooks/usePlaceContext";
import Loading from "./Loading";
import ErrorInput from "./ErrorInput";
import Button from './Button'
import Input from './Input'
import { differenceInCalendarDays } from 'date-fns'
import { IoIosPhotos } from 'react-icons/io'
import { MdPlace } from 'react-icons/md'
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const PlaceDetails = () => {
    const [place, setPlace] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [users, setUsers] = useState();
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [remove, setRemove] = useState();

    const { user } = useUserContext();
    const { dispatchPlace } = usePlaceContext();
    const { dispatch } = useBookingContext();
    const { mood } = useThemeMoodContext();

    const { id } = useParams();

    const to = useNavigate()

    const maxQuestArr = [];

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

        if(!user) {
            return;
        }

        const price = place && checkIn && checkOut && generatePrice(place.price, place.per, differenceInCalendarDays(new Date(checkOut),new Date(checkIn)));
        const data = { placeId:id, name, phone, price, checkIn, checkOut, guests:maxGuests }

        axios.post(`${apiUrl}/booking`, data, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => {
                if(res.statusText !== "ok") {
                    return setError(res.error)
                }
                dispatch({type: "CREATE_BOOKING", payload: res.data})
            })

    }

    const handleRemoveClick = (e) => {
        e.preventDefault()

        if(!user) {
            return;
        }
        setIsLoading(true)
        
        axios.delete(`${apiUrl}/place/remove/${id}`, {
            headers: {
            'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => {
                dispatchPlace({type:"REMOVE_PLACE" ,payload: res.data});
                to('/account/recommendations/');
            })
        setIsLoading(false)
    }

    useEffect(() => {
        if(!user || !id) {
            return;
        }
        setIsLoading(true)
        axios.get(`${apiUrl}/place/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => {
                setPlace(res.data);
                for (let i = 0; i <= res.data.maxGuests; i++) {
                    maxQuestArr.push(i)
                }
            })
            .catch(err => [
                setError(err.mesaage)
            ])
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if(!user) {
            return;
        }
        axios.get(`${apiUrl}/user`, {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
        })
        .then(res => {
            setUsers([...res.data]);
        })
    }, [])

    return (
        <div className={`py-10 px-8 bg-[#eee] ${mood === 'MOON'?'bg-black text-white':'bg-white text-black'}`}>
            {place && 
                <>
                    <h2 className="text-3xl first-letter:uppercase">{place.title}</h2>
                    <p className="mt-3 font-bold underline flex gap-2 items-center"><MdPlace className="text-lg"/>{place.address}</p>
                    <div className="flex justify-between gap-3 rounded-sm overflow-hidden mt-4 relative max-lg:flex-col">
                        <div className="min-w-[50%] max-w-full">
                            {place.photos[0] && 
                                <div>
                                    <img className='aspect-square object-cover' src={`http://localhost:4000/uploads/${place.photos[0]}`}/>
                                </div>}
                        </div>
                        <div className="flex-[50%] gap-3 flex flex-col overflow-hidden w-[50%] max-lg:w-full max-lg:flex-row">
                            <div className="h-[50%] max-lg:w-[50%]">
                                {place.photos[1] &&
                                    <div className="h-full">
                                        <img className='aspect-square h-full object-cover' src={`http://localhost:4000/uploads/${place.photos[1]}`}/>
                                    </div>}
                            </div>
                            <div className="bg-white h-[50%] max-lg:w-[50%]">
                                {place.photos[2] &&
                                    <div className="h-full">
                                        <img className='aspect-square h-full object-cover' src={`http://localhost:4000/uploads/${place.photos[2]}`}/>
                                    </div>}
                            </div>
                        </div>
                        {place.photos.length > 2 && <Link to={`/place/${id}/photos`} className="absolute flex items-center gap-2 text-[.9rem] shadow-md transition-[.5s] hover:shadow-lg bg-white rounded-[30px] px-[1em] py-[.5em] cursor-pointer right-[1em] bottom-[1em] max-sm:text-xs text-black"><IoIosPhotos/>show more photos</Link>}
                    </div>
                    <div className="flex gap-10 mt-5 flex-col lg:flex-row text-center min-[500px]:m-0 sm:text-left">
                        <div className="flex-[80%]">
                            <div className="flex justify-between items-center py-5 flex-col-reverse min-[500px]:flex-row flex-wrap">
                                <div>
                                    <h2 className="font-bold first-letter:uppercase mb-2">{place.title} by {users && users.map(user => {
                                        if(user._id === place.userId) {
                                            return user.name
                                        }
                                    })}
                                    </h2>
                                    <div className="flex gap-1 text-neutral-500 flex-col min-[500px]:flex-row">
                                        <p>{(+place.rooms >= 2)?`${place.rooms} rooms` : `${place.rooms} room`}</p>
                                        <p><span className="max-[500px]:hidden">-</span> {(+place.beds >= 2)?`${place.beds} beds` : `${place.beds} bed`}</p>
                                        <p><span className="max-[500px]:hidden">-</span> {(+place.maxGuests >= 2)?`${place.maxGuests} guests` : `${place.maxGuests} guest`}</p>
                                    </div>
                                </div>
                                <div className="rounded-full w-[4em] h-[4em] min-[500px]:w-[3em] min-[500px]:h-[3em] bg-black mb-5 flex justify-center overflow-hidden">
                                    <Link to={`/user/${place.userId}`} className="rounded-full overflow-hidden w-[4em] h-[4em] flex justify-center items-start">
                                        {users && users.map(user => {
                                            if(user._id === place.userId) {
                                                return <img key={user._id} src={`http://localhost:4000/uploads/${user.photo}`} alt="profile" className="object-cover" />
                                            }
                                        })}
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full h-[2px] bg-white"/>
                            <div className="py-10 flex flex-col gap-3">
                                <p><span className="font-bold text-lg">Check In:</span> {place.checkIn}</p>
                                <p><span className="font-bold text-lg">Check Out:</span> {place.checkOut}</p>
                            </div>
                            <div className="w-full h-[2px] bg-white"/>
                            <div className="py-10">
                                <h2 className="font-bold text-lg mb-2">Description</h2>
                                {place.description}
                            </div>
                            <div className="w-full h-[2px] bg-white"/>
                            <div className="py-10">
                                <h2 className="font-bold text-lg mb-2">Extra Info</h2>
                                {place.extraInfo}
                            </div>
                            {place.perks.length > 0 && (<><div className="w-full h-[2px] bg-white"/>
                            <div className="py-10">
                                <h2 className="font-bold text-lg mb-2">Perks</h2>
                                {place.perks.map((e,i) => {
                                    return <p key={i}>{e}</p>
                                })}
                                    
                            </div></>)}
                        </div>
                        <div className={`${mood === 'MOON'?'bg-black border-solid border-[1px] border-white':'bg-white shadow-lg'} mb-5 lg:mt-5 lg:mb-0 p-[2em] rounded-lg h-fit`}>
                            <h2><span className="font-bold text-[1.2rem]">${place.price} Per</span> {place.per}</h2>
                            <div className="my-5 rounded-md border-[1px] border-solid border-[#ccc] flex flex-col">
                                <div className="border-b-solid border-b-[1px] border-[#ccc] flex flex-col min-[500px]:flex-row justify-center">
                                    <span className="flex-[50%] border-b-[1px] border-b-[#ccc] border-b-solid min-[500px]:border-b-0 min-[500px]:border-r-[1px] min-[500px]:border-r-[#ccc] min-[500px]:border-r-solid p-[1em]">
                                        <label className="font-bold">Check&nbsp;In</label>
                                        <br/>
                                        <input defaultValue={checkIn} onChange={(e) => setCheckIn(e.target.value)} type="date" className={`outline-none w-full sm:w-fit ${mood === "MOON"? 'bg-black text-white placeholder:text-white': 'bg-white text-black placeholder:text-black'}`}/>
                                    </span>
                                    <span className="flex-[50%] p-[1em]">
                                        <label className="font-bold">Check&nbsp;Out</label>
                                        <br/>
                                        <input defaultValue={checkOut} onChange={(e) => setCheckOut(e.target.value)} type="date" className={`outline-none w-full sm:w-fit ${mood === "MOON"? 'bg-black text-white placeholder:text-white': 'bg-white text-black placeholder:text-black'}`}/>
                                    </span>
                                </div>
                                <span className="p-[1em]">
                                    <h2 className="font-bold">Guests</h2>
                                    <input defaultValue={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} type="number" className={`w-full outline-none ${mood === "MOON"? 'bg-black text-white placeholder:text-white': 'bg-white text-black placeholder:text-black'}`} min={1} max={place.maxGuests} placeholder={1} />
                                </span>
                            </div>
                            {checkIn && checkOut && differenceInCalendarDays(new Date(checkOut),new Date(checkIn)) >= 0 && (
                                <>
                                    <p className="ml-2 mb-5">Your booking for <span className="font-bold">{differenceInCalendarDays(new Date(checkOut),new Date(checkIn))}</span> days</p>
                                    <Input type={'text'} value={name} onChange={(e) => setName(e.target.value) } placeholder={'Full name'} style={'mb-5 text-black'}/>
                                    <Input type={'tel'} value={phone} onChange={(e) => setPhone(e.target.value) } placeholder={'Phone number'} style={'mb-5 text-black'}/>
                                    <p className="ml-2 mb-5">Cost <span className="font-bold">${generatePrice(place.price, place.per, differenceInCalendarDays(new Date(checkOut),new Date(checkIn)))}</span></p>
                                </>
                            )}
                            <div onClick={(e) => handleBookingClick(e)}>
                                <Button value={'Reserve'}/>
                            </div>
                        </div>
                    </div>
                </>
            }
            {place && place.userId === user.user._id &&
                (
                    <div className="flex gap-5 flex-wrap items-center justify-center sm:justify-normal sm:items-start">
                        <Link className="w-fit py-3 outline-none px-10 rounded-3xl bg-primary text-white transition-[.5s] hover:shadow-md" to={`/account/recommendations/update/${place._id}`}>Edit</Link>
                        <Link className="w-fit py-3 outline-none px-10 rounded-3xl bg-primary text-white transition-[.5s] hover:shadow-md" onClick={() => setRemove(true)}>Remove</Link>
                    </div>
                )}
            {remove && (
                <div className="fixed top-0 left-[50%] border-[1px] border-[#ddd] border-solid z-50 translate-x-[-50%] p-[1.5em] rounded-lg bg-white shadow-md">
                    <p className="font-bold">Are you sure to remove this booking?</p>
                    <div className="flex gap-3 mt-5 flex-wrap">
                        <span onClick={(e) => handleRemoveClick(e)} className="rounded-md cursor-pointer py-[.5em] px-[1em] bg-green-600 text-white">Yes</span>
                        <span onClick={() => setRemove(false)} className="rounded-md cursor-pointer py-[.5em] px-[1em] bg-[red] text-white">No</span>
                    </div>
                </div>
            )}
            {error && <ErrorInput error={error}/> }
            {isLoading && <Loading/>}
        </div>
    )
}

export default PlaceDetails