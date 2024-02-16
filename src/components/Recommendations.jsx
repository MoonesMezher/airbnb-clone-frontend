import { FaPlus } from "react-icons/fa"
import { Link } from "react-router-dom"
import { usePlaceContext } from "../hooks/usePlaceContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../constant/apiUrl";
import ErrorInput from "./ErrorInput";
import Loading from "./Loading";
import { useUserContext } from "../hooks/useUserContext";
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const Recommendations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { places, dispatch } = usePlaceContext()
  const { user } = useUserContext()
  const { mood } = useThemeMoodContext();

  useEffect(() => {
    setIsLoading(true)
    axios.get(`${apiUrl}/place/user`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
      .then(res => {
        dispatch({type: "SET_PLACES", payload: res.data})
      })
      .catch(err => {
        setError(err.message)
      })
    setIsLoading(false)
  } ,[dispatch])

  return (
    <div className="w-full">
        <Link 
            className="p-[.8em] rounded-[30px] transition-[.5s] shadow-md bg-primary text-white flex items-center gap-2 justify-center mt-10 mx-auto w-[15em]" 
            to={'/account/recommendations/addnew'}>
              <FaPlus/>Add new place
        </Link>
        <div className="mt-14 w-full flex gap-5 flex-col">
        {(places.length === 0 || !places) && <p className={`text-center ${mood === 'MOON'?'text-white':'text-black'} `}>No Places yet</p>}
          {places.length > 0 &&
            (places.map(place => {
              return (<Link to={`/place/${place._id}`} className="flex gap-5 px-[1em] py-[1.5em] rounded-md bg-[#eee] relative flex-col md:flex-row" key={place._id}>
                <div className="md:h-[10em] rounded-md bg-[#ddd] overflow-hidden flex">
                  <img className="rounded-md object-cover" src={`http://localhost:4000/uploads/${place.photos[0]}`} alt="img" />
                </div>
                <div className="mb-2">
                  <h2 className="font-bold text-lg first-letter:uppercase mb-3">{place.title}</h2>
                  <p>{place.description}</p>
                </div>
                <span className="absolute bottom-[.5em] right-[1em] font-bold">${place.price}/{place.per}</span>
              </Link>)
          }))}
        </div>
        {error && <ErrorInput error={error}/> }
        {isLoading && <Loading/>}
    </div>
  )
}

export default Recommendations