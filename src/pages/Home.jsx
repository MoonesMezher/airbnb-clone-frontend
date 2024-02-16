import { useEffect, useState } from "react"
import { useUserContext } from "../hooks/useUserContext";
import axios from "axios";
import { apiUrl } from "../constant/apiUrl";
import { Link, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const Home = () => {
    const { user } = useUserContext(); 

    const [places, setPlaces] = useState();
    const [users, setUsers] = useState();
    const [isLoading, setIsLoading] = useState();

    const { mood } = useThemeMoodContext();

    const to = useNavigate();

    useEffect(() => {
      if(!user) {
        return;
      }
      setIsLoading(true)
      axios.get(`${apiUrl}/place`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then(res => {
          setPlaces(res.data);
        })
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
      <div className="my-10 mx-8">
        <div className="home-places grid gap-5">
          {places && places.map(place => {
            return (
              <div key={place._id} className={`${mood === 'MOON'? 'bg-black shadow-white shadow-sm':'text-black bg-white shadow-lg'} rounded-lg p-[1em] cursor-pointer`}>
                <div className="rounded-lg flex overflow-hidden" onClick={() => to(`/place/${place._id}`)}>
                  <img className="object-cover aspect-square" src={`http://localhost:4000/uploads/${place.photos[0]}`} alt="place" />
                </div>
                <div className="mt-5 flex flex-col gap-1">
                  <div className="flex justify-between items-center mb-1">
                    <h2 className={`${mood === 'MOON'? 'text-white':'text-black'} font-bold text-lg`}>{place.title}</h2>
                    <Link to={`/user/${place.userId}`} className="rounded-full overflow-hidden w-[4em] h-[4em] flex justify-center">
                        {users && users.map(user => {
                          if(user._id === place.userId) {
                            return <img key={user._id} className="object-contain" src={`http://localhost:4000/uploads/${user.photo}`} alt="profile" /> 
                          }
                        })}
                    </Link>
                  </div>
                  <p className="text-neutral-500">{place.address}</p>
                  <span className="text-neutral-500">{place.createdAt.split("T").splice(0, 1).join(" ").split('-').join(" / ")}</span>
                  <span className={`${mood === 'MOON'? 'text-white':'text-black'} text-[.9rem]`}><span className="font-bold">${place.price}</span> per {place.per}</span>
                </div>
              </div>
            )
          })}
        </div>
        {isLoading && <Loading/>}
      </div>
    )
}

export default Home