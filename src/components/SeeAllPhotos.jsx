import { useEffect, useState } from "react";
import { IoMdReturnRight } from "react-icons/io"
import { Link, useParams } from "react-router-dom"
import { useUserContext } from "../hooks/useUserContext";
import { apiUrl } from "../constant/ApiUrl";
import axios from "axios";
import ErrorInput from "./ErrorInput";
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const SeeAllPhotos = () => {
    const [place, setPlace] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { user } = useUserContext();
    const { mood } = useThemeMoodContext();

    const { id } = useParams();

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
            })
            .catch(err => [
                setError(err.mesaage)
            ])
        setIsLoading(false)
    }, [])
    return (
        <div className={`left-0 top-0 absolute ${mood === 'MOON'? 'bg-black text-white': 'bg-[#eee] text-black'} min-h-screen w-full p-5 overflow-hidden`}>
            <h2 className="text-2xl">Photos of {place && place.title}</h2>
            <Link to={`/place/${id}`} className={`fixed top-[1em] right-[1em] flex items-center rounded-[30px] px-[1em] py-[.5em] ${mood === 'MOON'? 'bg-white text-black':'bg-black text-white'} gap-2 cursor-pointer`}>
                <IoMdReturnRight />
                close photos
            </Link>
            <div className="flex gap-5 flex-col items-center mt-5">
                {place && place.photos.length > 0 && place.photos.map((photo, id) => {
                    return (<div className="h-screen flex justify-center rounded-md overflow-hidden" key={id}>
                        <img className="object-cover aspect-square" src={`http://localhost:4000/uploads/${photo}`} alt="place"/>
                    </div>)
                })}
            </div>
            
            {isLoading && <isLoading/>}
            {error && <ErrorInput error={error}/>}
        </div>
    )
}

export default SeeAllPhotos