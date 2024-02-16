import { Link, useParams } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext"
import { FaUser, FaListUl } from 'react-icons/fa'
import { HiHome } from 'react-icons/hi'

import Profile from "../components/Profile";
import Bookings from "../components/Bookings";
import Recommendations from "../components/Recommendations";
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const Account = () => {
    const { subpage } = useParams();

    const { mood } = useThemeMoodContext()
    
    return (
        <div className={`${mood === 'MOON'?'bg-black':'bg-white'} py-10 px-8 min-h-screen overflow-hidden`}>
            <nav className="mx-auto flex flex-wrap gap-10 items-center justify-center">
                <Link 
                    className={`${mood === 'MOON'? (!subpage? 'bg-primary text-white': 'bg-white text-black'):'text-black'} flex items-center gap-2 p-[.8em] rounded-[30px] transition-[.5s] shadow-md hover:bg-primary hover:text-white`} 
                    to={'/account'}><FaUser/>My profile</Link>
                <Link 
                    className={`${mood === 'MOON'?(subpage==='bookings' ? 'bg-primary text-white': 'bg-white text-black'):'text-black'} flex items-center gap-2 p-[.8em] rounded-[30px] transition-[.5s] shadow-md hover:bg-primary hover:text-white`}
                    to={'/account/bookings'}><FaListUl/>My bookings</Link>
                <Link 
                    className={`${mood === 'MOON'? (subpage==='recommendations'? 'bg-primary text-white': 'bg-white text-black'):'text-black'} flex items-center gap-2 p-[.8em] rounded-[30px] transition-[.5s] shadow-md hover:bg-primary hover:text-white`}
                    to={'/account/recommendations'}><HiHome className="text-[1.1rem]"/>My recommendations</Link>
            </nav>
            {!subpage && <Profile/>}
            {subpage == "bookings" && <Bookings/>}
            {subpage == "recommendations" && <Recommendations/>}
        </div>
    )
}

export default Account