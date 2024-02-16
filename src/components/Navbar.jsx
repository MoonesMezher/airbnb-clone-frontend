import { useEffect, useRef, useState } from 'react'
import { FaAirbnb, FaSearch, FaBars, FaMoon} from 'react-icons/fa'
import { TfiWorld } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import { useUserContext } from '../hooks/useUserContext'
import axios from 'axios'
import { apiUrl } from '../constant/apiUrl'
import { MdSunny } from 'react-icons/md'
import { useThemeMoodContext } from '../hooks/useThemeMoodContext'
import Input from '../components/Input'
import { BiX } from 'react-icons/bi'

const Navbar = () => {
    const [menuClick, setMenuClick] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const [serach, setSerach] = useState(false);
    const [deatilsSearch, setDetailsSearch] = useState([]);
    const [itemClicked, setItemClicked] = useState(false);

    const searchInput = useRef()

    const { user } = useUserContext();
    const { mood, dispatch: dispatchMood } = useThemeMoodContext();

    const handleSearch = (e) => {
        if(!user || !e) {
            setDetailsSearch([])
            return;
        }

        setDetailsSearch([])

        if(serach === 'users') {
            axios.get(`${apiUrl}/user`)
                .then(res => {
                    res.data.forEach(el => {
                        if(el.name.toLowerCase().includes(e.toLowerCase())) {
                            setDetailsSearch(prev => {
                                return [...prev, el]
                            })
                            console.log(el.name);
                        }
                    });
                });
        } else if(serach === 'places') {
            axios.get(`${apiUrl}/place`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => {
                    res.data.forEach(el => {
                        if(el.title.toLowerCase().includes(e.toLowerCase())) {
                            setDetailsSearch(prev => {
                                return [...prev, el]
                            })
                        }
                    });
                });
        } else {
            axios.get(`${apiUrl}/place`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => {
                    res.data.forEach(el => {
                        if(el.address.toLowerCase().includes(e.toLowerCase())) {
                            setDetailsSearch(prev => {
                                return [...prev, el]
                            })
                        }
                    });
                });
        } 
    }

    useEffect(() => {
        if(!user) {
            return
        }
        axios.get(`${apiUrl}/user/${user.user._id}`)
            .then(res => {
                setUserInfo(res.data)
            })
    },[user])

    useEffect(() => {
        searchInput.current.value = ''
    }, [itemClicked])

    return (
        <>
            <header className="max-[500px]:px-4 py-5 px-8 flex max-[450px]:flex-col justify-between items-center border-b-[1px] border-[#ddd] border-solid">
                <Link to={'/'} className="logo text-primary font-bold flex items-center">
                    <FaAirbnb className='text-[3rem]'/>
                    <span className='text-[1.5rem] hidden lg:block'>airbnb</span>
                </Link>
                <div className={`${mood === 'MOON'? 'text-white':'text-black'} min-[451px]:absolute max-[450px]:mt-2 max-[500px]:right-[1rem] right-[2rem] md:left-[6em] lg:left-[50%] lg:translate-x-[-50%] flex rounded-[30px] w-fit shadow-md border-[1px] border-[#ddd] border-solid p-2 text-[.9rem] transition-[.5s] hover:shadow-xl`}>
                    <span onClick={() => setSerach('anywhere')} className={`border-r-[2px] border-[#ddd] border-solid py-2 px-4 cursor-pointer text-[.8rem] lg:text-[.9rem] ${(serach === 'anywhere') && 'text-neutral-400'}`}>Anywhere</span>
                    <span onClick={() => setSerach('places')} className={`border-r-[2px] border-[#ddd] border-solid py-2 px-4 cursor-pointer text-[.8rem] lg:text-[.9rem] ${(serach === 'places') && 'text-neutral-400'}`}>Places</span>
                    <span onClick={() => setSerach('users')} className={`py-2 px-4 cursor-pointer text-[.8rem] lg:text-[.9rem] ${(serach === 'users') && 'text-neutral-400'}`}>Users</span>
                    <button className='bg-primary text-white rounded-full p-2 w-[2.5em] h-[2.5em] flex justify-center items-center'>
                        {serach? <BiX className='text-xl' onClick={() => setSerach(false)}/>:<FaSearch onClick={() => setSerach('users')}/>}
                    </button>
                </div>
                <div className={`${mood === 'MOON'? 'text-white':'text-black'} items-center gap-2 text-[.9rem] lg:gap-3 hidden md:flex`}>
                    <span className={`cursor-pointer p-3 transition-[.5s] ${mood === 'MOON'? 'hover:bg-slate-900':'hover:bg-[#eee]'} rounded-[30px]`}>Airbnb&nbsp;your&nbsp;home</span>
                    <span className={`cursor-pointer p-3 transition-[.5s] ${mood === 'MOON'? 'hover:bg-slate-900':'hover:bg-[#eee]'} rounded-full`}>
                        <TfiWorld />
                    </span>
                    <div className='flex justify-between items-center gap-3 shadow-md rounded-[30px] border-[1px] border-[#ddd] border-solid p-2 transition-[.5s] hover:shadow-xl cursor-pointer' onClick={() => setMenuClick(!menuClick)}>
                        <FaBars className={`${mood === 'MOON'? 'text-white':'text-black'} text-[1.2rem]`}/>
                        <div className='flex justify-center w-[2.5em] h-[2.5em] rounded-full overflow-hidden border-[1px] border-[#ddd] border-solid'>
                            {<img className='object-cover' src={`http://localhost:4000/uploads/${userInfo?.photo || 'profileDefault.jpeg'}`} alt="profile" />}
                        </div>
                    </div>
                </div>
                <ul className={`${menuClick? 'block': 'hidden'} fixed right-[2rem] top-[5em] bg-white rounded-xl overflow-hidden shadow-lg py-2 w-[15em] z-[100]`}>
                    {!user && (
                        <>
                            <Link to={'/signup'} onClick={() => setMenuClick(false)} className='block hover:bg-[#eee] p-3 px-5 mb-2'>
                                <span>Sign up</span>
                            </Link>
                            <Link to={'/login'} onClick={() => setMenuClick(false)} className='block p-3 px-5 mb-2 hover:bg-[#eee]'>
                                <span>Log in</span>
                            </Link>
                        </>
                    )}
                    {user && (
                        <>
                            <Link to={'/account'} onClick={() => setMenuClick(false)} className='block hover:bg-[#eee] p-3 px-5 mb-2 capitalize'>
                                <span>{userInfo && userInfo.name || "account"}</span>
                            </Link>
                            <Link to={'/logout'} onClick={() => setMenuClick(false)} className='block p-3 px-5 mb-2 hover:bg-[#eee]'>
                                <span>Log out</span>
                            </Link>
                        </>
                    )}
                    <hr/>
                    <Link to={'/home'} className='block p-3 px-5 my-2 hover:bg-[#eee]'>
                        <span>Airbnb your home</span>
                    </Link>
                    <Link to={'/help'} className='block p-3 px-5 hover:bg-[#eee]'>
                        <span>Help Center</span>
                    </Link>
                    <div className='p-3 px-5 hover:bg-[#eee] flex justify-between items-center'>
                        <FaMoon className={`cursor-pointer ${(mood === 'MOON') && 'text-primary'}`} onClick={() => dispatchMood({type: 'MOON'})}/>
                        <MdSunny className={`cursor-pointer ${(mood === 'SUN') && 'text-primary'}`} onClick={() => dispatchMood({type: 'SUN'})}/>
                    </div>
                </ul>
            </header>
            <div className={`${serach? 'absolute': 'hidden'} top-[5em] left-[50%] translate-x-[-50%] w-full p-1 min-[700px]:w-[60%] z-50`}>
                <input type='text' placeholder={serach && serach} ref={searchInput} onChange={(e) => handleSearch(e.target.value)} className={`border-none outline-none rounded-md ${mood === "MOON"? 'bg-white text-black': 'bg-black text-white'} w-full px-5 py-3`}/>
                {deatilsSearch && <div className='w-full flex-col mt-1 rounded-md overflow-hidden'>
                    {deatilsSearch.map((e, id) => <Link key={id} to={serach === 'places'? `/place/${e._id}`: `/user/${e._id}`} onClick={() => {
                        setSerach(false)
                        setDetailsSearch([])
                        setItemClicked(!itemClicked)
                    }} className={`border-b border-solid border-[#ddd] w-ful ${mood === "MOON"? 'bg-white text-black': 'bg-black text-white'} p-2 w-full block`}>{serach === 'users'? e.name: (serach === 'anywhere'? e.address: e.title)}</Link>)}
                </div>}
            </div>
        </>
    )
}

export default Navbar;