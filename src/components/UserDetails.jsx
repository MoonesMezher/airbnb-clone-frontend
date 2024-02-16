import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { apiUrl } from "../constant/apiUrl";
import { useUserContext } from "../hooks/useUserContext";
import { FaFacebook, FaGoogle, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const UserDetails = () => {
    const { id } = useParams();

    const [userInfo, setUserInfo] = useState();
    const [placeUser, setPlaceUser] = useState();

    const { user } = useUserContext();
    const { mood } = useThemeMoodContext();

    useEffect(() => {
        if(!user) {
            return;
        }
        axios.get(`${apiUrl}/user/${id}`)
            .then(res => {
                setUserInfo(res.data)
            })
    },[id, user])

    useEffect(() => {
        if(!user) {
            return;
        }
        axios.get(`${apiUrl}/place`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        .then(res => {
            setPlaceUser([...res.data].filter(e => e.userId === id));
        })
    },[user])

    return (
        <div className={`p-8 flex flex-col gap-5 ${mood === 'MOON'?'bg-black text-white':'bg-white text-black'} `}>
            <div>
                <h2 className="font-bold mb-3 text-lg">Info</h2>
                <div className="flex gap-5 items-center">
                    <div className="flex justify-center rounded-full overflow-hidden w-[10em] h-[10em] border-[1px] border-[#ddd] border-solid">
                        <img className="object-cover" src={`http://localhost:4000/uploads/${userInfo && userInfo.photo}`} alt="profile" />
                    </div>
                    <div>
                        <p className="font-bold mb-3 text-lg">Name: <span className="font-normal">{userInfo && userInfo.name}</span></p>
                        {userInfo && userInfo.BIO && <p className="font-bold mb-3 text-lg">BIO: <span className="font-normal">{userInfo.BIO}</span></p>}
                    </div>
                </div>
            </div>
            <div>
                <h2 className="font-bold mb-3 text-lg">Places {`(${placeUser && placeUser.length || 0})`}</h2>
                <div className="flex flex-col gap-5">
                    {placeUser &&
                    (placeUser.map(place => {
                    return (<Link to={`/place/${place._id}`} className={`flex gap-5 px-[1em] py-[1.5em] rounded-md text-black bg-[#eee] relative flex-col md:flex-row`} key={place._id}>
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
                    {(!placeUser || placeUser.length === 0) && <p>No places yet</p>}
                </div>
            </div>
            <div>
                <h2 className="font-bold mb-3 text-lg">Contact</h2>
                <div className="flex gap-5">
                    {userInfo && userInfo.contact?.whatsapp && (
                        <Link className="text-2xl w-fit text-white rounded-[4px] p-1 overflow-hidden bg-[#25d366]" target="_blank" to={`https://wa.me/${userInfo.contact?.whatsapp }`}>
                            <FaWhatsapp/>
                        </Link>
                    )}
                    {userInfo && userInfo.contact?.facebook && (
                        <Link className="text-2xl w-fit text-white rounded-[4px] p-1 overflow-hidden bg-[#3b5998]" target="_blank" to={`https://www.facebook.com/${userInfo.contact?.facebook}`}>
                            <FaFacebook/>
                        </Link>
                    )}
                    {userInfo && userInfo.contact?.gmail && (
                        <Link className="text-2xl w-fit text-white rounded-[4px] p-1 overflow-hidden bg-[#f4b400]" target="_blank" to={`mailto:${userInfo.contact?.gmail}`}>
                            <FaGoogle/>
                        </Link>
                    )}
                    {userInfo && userInfo.contact?.instagram && (
                        <Link className="text-2xl w-fit text-white rounded-[4px] p-1 overflow-hidden bg-[#cd486b]" target="_blank" to={`https://www.instagram.com/${userInfo.contact?.instagram}`}>
                            <FaInstagram/>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserDetails