import axios from "axios";
import { useEffect, useState } from "react"
import { apiUrl } from "../constant/apiUrl";
import { useUserContext } from "../hooks/useUserContext";
import { useBookingContext } from "../hooks/useBookingContext";
import Loading from './Loading'
import ErrorInput from './ErrorInput'
import { Link } from "react-router-dom";
import { FaArrowRight, FaCalendar, FaMoneyBillWave, FaPhone, FaUser, FaUserFriends } from "react-icons/fa";
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const Bookings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [places, setPlaces] = useState();

  const { user } = useUserContext()
  const { bookings, dispatch } = useBookingContext();
  const { mood } = useThemeMoodContext();
  
  useEffect(() => {
    if(!user) {
      return
    }

    setIsLoading(true);

    axios.get(`${apiUrl}/booking`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
      .then(res => {
        if(res.statusText !== 'OK') {
          return setError(res.error)
        }
        dispatch({type:"SET_BOOKINGS", payload: res.data})
      })

    setIsLoading(false);
  },[])

  useEffect(() => {
    if(!user) {
      return
    }
    setIsLoading(true);

    axios.get(`${apiUrl}/place`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
      .then(res => {
        if(res.statusText !== 'OK') {
          return setError(res.error)
        }
        setPlaces(res.data);
      })

    setIsLoading(false);
  },[])

  return (
    <div className={`${mood === 'MOON'?'bg-black':'bg-white'} pt-14 w-full flex gap-5 flex-col`}>
      {(bookings.length === 0 || !bookings) && <p className={`text-center ${mood === 'MOON'?'text-white':'text-black'} `}>No Bookings yet</p>}
      {bookings && places && bookings.map(booking => {
        return (
          <Link to={`/booking/${booking._id}`} className="flex gap-5 rounded-md bg-[#eee] relative flex-col md:flex-row overflow-hidden" key={booking._id}>
            <div className="flex md:h-[12em] ">
            {places.map((place,id) => {
                if(place._id === booking.placeId) {
                  return  <img key={id} className="aspect-squar bg-[#ddd] object-cover" src={`http://localhost:4000/uploads/${place.photos[0]}`} alt="place" />
                }
              })}
            </div>
            <div className="p-[.5em] pt-0 flex flex-col gap-4 items-center sm:items-start flex-1 relative">
              <h2 className="font-bold text-lg">
                {places.map(place => {
                  if(place._id === booking.placeId) {
                    return place.title
                  }
                })}
              </h2>
              <div className="flex gap-4 sm:items-center flex-col sm:flex-row">
                <span className="flex items-center text-neutral-500 gap-2"><FaCalendar className="text-black"/>{booking.checkIn}<FaArrowRight className="ml-2 text-black hidden sm:block"/></span>
                <span className="flex items-center text-neutral-500 gap-2"><FaCalendar className="text-black"/>{booking.checkOut}</span>
                <span className="flex items-center text-neutral-500 gap-2"><FaUserFriends className="text-black"/>{booking.guests}</span>
              </div>
              <div className="flex gap-4 sm:items-center flex-col sm:flex-row text-neutral-500">
                <div className="flex gap-2 items-center"><FaUser className="text-black"/> {booking.username}</div>
                <div className="flex gap-2 items-center"><FaPhone className="text-black"/> {booking.phoneNumber}</div>
              </div>
              <div className="flex gap-2 items-center font-bold text-2xl bg-primary text-white p-2 w-fit rounded-md md:absloute md:bottom-[0em]"><FaMoneyBillWave/> ${booking.price}</div>
            </div>
          </Link>
        )
      })}
      {isLoading && <Loading/>}
      {error && <ErrorInput error={error}/>}
    </div>
  )
}

export default Bookings