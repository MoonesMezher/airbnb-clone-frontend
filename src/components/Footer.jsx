import { TfiWorld } from 'react-icons/tfi'
import { BiCheck, BiX } from 'react-icons/bi'
import { FaEuroSign, FaRegHeart, FaSearch } from 'react-icons/fa'
import { RiArrowUpSLine } from 'react-icons/ri'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'
import axios from 'axios'
import { apiUrl } from '../constant/apiUrl'
import { useThemeMoodContext } from '../hooks/useThemeMoodContext'


const Footer = () => {
    const [supportLists, setSupportLists] = useState(false);
    const [userInfo, setUserInfo] = useState(false);

    const { user } = useUserContext();
    const { mood } = useThemeMoodContext();

    useEffect(() => {
        if(!user) {
            return
        }
        axios.get(`${apiUrl}/user/${user.user._id}`)
            .then(res => {
                setUserInfo(res.data)
            })
    },[user])

    return (
        <footer className={`${mood === 'MOON'? 'bg-black':'bg-white'} footer md:fixed bottom-0 left-0 w-full border-t-[1px] border-[#ddd] border-solid py-5 px-8 flex justify-between max-[1180px]:items-center max-md:flex-col gap-4 max-[480px]:text-center text-[.9rem] z-50 max-md:pb-0`}>
            <div className='left-side flex max-[1180px]:flex-col min-[1171px]:items-center gap-4 text-stone-500 flex-wrap'>
                <span>&copy; 2023 Airbnb, Inc </span>
                <a href="" className="hover:underline relative">Terms</a>
                <a href="" className="hover:underline relative">Sitemap </a>
                <a href="" className="hover:underline relative">Privacy</a>
                <span className='flex items-center gap-2'> 
                    <a href="" className="hover:underline relative">Your Privacy Choices</a>
                        <span  className='flex rounded-[30px] border-[1px] border-solid border-blue-600 overflow-hidden'> 
                            <BiCheck className='text-blue-600'/>
                            <BiX className='bg-blue-600 text-white'/>
                        </span> 
                </span>
                <a href="" className="hover:underline relative">Destinations</a>
            </div>
            <div className={`${mood === 'MOON'? 'text-white':'text-black'} flex min-[1181px]:items-center gap-4 max-[1180px]:flex-col`}>
                <span className='flex cursor-pointer items-center gap-2 max-[480px]:mx-auto'>
                    <TfiWorld/>
                    <a href="" className="hover:underline">English (US)</a>
                </span>
                <span className='flex cursor-pointer items-center gap-2 max-[480px]:mx-auto'>
                    <FaEuroSign/>
                    <a href="" className="hover:underline">EUR</a>
                </span>
                <span className='flex cursor-pointer items-center gap-2 max-[480px]:mx-auto' onClick={() => setSupportLists(true)}>
                    <p className="hover:underline">Support & Resources</p>
                    <RiArrowUpSLine className='font-bold text-2xl'/>
                </span>
            </div>
            <div className='flex z-50 w-full bg-white md:hidden gap-10 text-neutral-400 items-center fixed bottom-0 left-0 p-4 justify-center shadow-xl border-t-[1px] border-[#ccc] border-solid'>
                <Link to={"/"} className='flex flex-col items-center justify-center'>
                    <FaSearch className='text-3xl mb-2'/>
                    <p className='text-black text-[.8rem]'>Exploer</p>
                </Link>
                <Link to={""} className='flex flex-col items-center justify-center'>
                    <FaRegHeart className='text-3xl mb-2'/>
                    <p className='text-black text-[.8rem]'>Wishlists</p>
                </Link>
                <Link to={user? "/account": "/login"} className='flex flex-col items-center justify-center'>
                    <div className="rounded-full w-[2.5em] h-[2.5em] bg-black mb-1 flex justify-center overflow-hidden">
                        {userInfo && <img key={userInfo._id} src={`http://localhost:4000/uploads/${userInfo.photo}`} alt="profile" className="object-cover" />}
                    </div>
                    <p className='text-black text-[.8rem] capitalize'>{user? (user.user.name.split(" ")[0] || "Account"): "Log In"}</p>
                </Link>
            </div>
            <div className={`support-lists ${!supportLists? 'hidden': 'flex'} fixed bottom-0 left-0 w-full p-10 py-16 text-[1rem] ${mood === 'MOON'?'bg-black text-white':'bg-white'} justify-between rounded-t-3xl border-t-[1px] border-[#ddd] border-solid z-30 max-md:flex-col max-md:relative max-md:bottom-[0em] max-md:w-screen max-sm:pb-0`}>
                <BiX className='absolute left-[.5em] top-[.5em] text-neutral-400 cursor-pointer text-[2.2rem]' onClick={() => setSupportLists(false)}/>
                <ul>
                    <h2>Support</h2>
                    <li><a href="">Help Center</a></li>
                    <li><a href="">AirCover</a></li>
                    <li><a href="">Supporting people with disabilities</a></li>
                    <li><a href="">Cancellation options</a></li>
                    <li><a href="">Our COVID-19 Response</a></li>
                    <li><a href="">Report a neighborhood concern</a></li>
                </ul>
                <ul>
                    <h2>Community</h2>
                    <li><a href="">Airbnb.org: disaster relief housing</a></li>
                    <li><a href="">Combating discrimination</a></li>
                </ul>
                <ul>
                    <h2>Hosting</h2>
                    <li><a href="">Airbnb your home</a></li>
                    <li><a href="">AirCover for Hosts</a></li>
                    <li><a href="">Explore hosting resources</a></li>
                    <li><a href="">Visit our community forum</a></li>
                    <li><a href="">How to host responsibly</a></li>
                    <li><a href="">Airbnb-friendly apartments</a></li>
                </ul>
                <ul>
                    <h2>Airbnb</h2>
                    <li><a href="">Newsroom</a></li>
                    <li><a href="">Learn about new features</a></li>
                    <li><a href="">Letter from our founders</a></li>
                    <li><a href="">Careers</a></li>
                    <li><a href="">Investors</a></li>
                    <li><a href="">Gift cards</a></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer