import { useEffect, useRef, useState } from "react"
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import { useUserContext } from "../hooks/useUserContext";
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";
import { FaEye, FaMoon, FaPlus, FaSignOutAlt, FaThemeco, FaThemeisle } from "react-icons/fa";
import Input from "./Input";
import Button from "./Button";
import { apiUrl } from '../constant/apiUrl'
import { MdFlood, MdMood, MdSettings, MdSunny, MdViewAgenda } from "react-icons/md";
import { TfiThemifyFavicon } from "react-icons/tfi";
import { HiViewBoards, HiViewGrid, HiViewList } from "react-icons/hi";
import { BiLandscape } from "react-icons/bi";

const Profile = () => {
    const { user, dispatch } =  useUserContext();
    const { mood } = useThemeMoodContext();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [addedPhoto, setAddedPhoto] = useState();
    const [addContact, setAddContact] = useState(false)
    const [userInfo, setUserInfo] = useState();
    const [whatsapp, setWhatsapp] = useState();
    const [facebook, setFacebook] = useState();
    const [gmail, setGmail] = useState();
    const [instagram, setInstagram] = useState();
    const [moreSettings, setMoreSettings] = useState(false);
    const [addBIO, setAddBIO] = useState(false)
    const [BIO, setBIO] = useState();

    const { dispatch: dispatchMood } = useThemeMoodContext()

    const file = useRef();

    const to = useNavigate();

    useEffect(() => {
        axios.get(`${apiUrl}/user/${user.user._id}`)
            .then(res => {
                setUserInfo(res.data)
                setWhatsapp(res.data?.contact?.whatsapp)
                setInstagram(res.data?.contact?.instagram)
                setFacebook(res.data?.contact?.facebook)
                setGmail(res.data?.contact?.gmail)
                setBIO(res.data?.BIO)
            })
    },[user])

    const handleClick = () => {
        file.current.click();
    }

    const handleUploadImgChange = (e) => {
        setIsLoading(true);

        const files = e.target.files 
        const formData = new FormData();
        
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])            
        }
        
        axios.post(`${apiUrl}/user/upload`, formData,{
            headers: {
                'Content-Type': `multipart/form-data`,
                'Authorization': `Bearer ${user.token}`
            }
        }).then((res) => {
            if(res.statusText !== "OK") {
                throw Error("Failed Fetch");
            }
            setAddedPhoto(res.data)
        } )
        setIsLoading(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const contact = { whatsapp, facebook, instagram, gmail } 

        const data = { name, password, addedPhoto, contact, BIO };
        
        setIsLoading(true)
        axios.patch(`${apiUrl}/user/update/${user.user._id}`, data)
        .then(res => {
            if(res.statusText !== "OK") {
                return setError(res.error)
            }
            
            dispatch({type: "UPDATE_USER", payload: res.data})
            to(`/user/${user.user._id}`)
        })

        setIsLoading(false)
    }

    return (
        <form className={`${mood === 'MOON'?'bg-black text-black':'bg-white'} p-4 rounded-xl text-center flex flex-col gap-2 max-w-[35em] mx-auto my-10 w-full min-h-[calc(100vh-7em)]`} onSubmit={handleSubmit}>
            <h2 className="font-bold text-4xl mb-4">Edit Info</h2>
            <div className="relative flex justify-center w-[10em] h-[10em] sm:w-[15em] sm:h-[15em] rounded-full overflow-hidden border-[#ddd] border-solid border-[1px] mx-auto my-2" onClick={handleClick}>
                <input 
                    ref={file}
                    type="file"
                    placeholder={"Photo"}
                    className={`hidden w-full h-full`}
                    onChange={handleUploadImgChange}/>
                {!addedPhoto && userInfo && <img className="object-cover" src={`http://localhost:4000/uploads/${userInfo.photo}`} alt="profile" />}
                {addedPhoto && <img className="object-cover" src={`http://localhost:4000/uploads/${addedPhoto}`} alt="profile" />}
                <span className="cursor-pointer absolute right-[3em] bottom-[1.5em] bg-primary rounded-full p-1 text-white z-20">
                    <FaPlus/>
                </span>
            </div>
            <Input type={"text"} placeholder={userInfo && userInfo.name} onChange={(e) => setName(e.target.value)}/>
            <Input type={"password"} placeholder={"password"} onChange={(e) => setPassword(e.target.value)}/>
            {addContact && (
                <>
                    <Input type={"tel"} value={(userInfo && userInfo?.contact?.whatsapp)} placeholder={"+963....."} onChange={(e) => setWhatsapp(e.target.value)}/>
                    <Input type={"text"} value={(userInfo && userInfo?.contact?.facebook)} placeholder={"facebook account name"} onChange={(e) => setFacebook(e.target.value)}/>
                    <Input type={"email"} value={(userInfo && userInfo?.contact?.gmail)} placeholder={"myemail@gmail.com"} onChange={(e) => setGmail(e.target.value)}/>
                    <Input type={"text"} value={(userInfo && userInfo?.contact?.instagram)} placeholder={"instagram username"} onChange={(e) => setInstagram(e.target.value)}/>
                </>
            )}
            {addBIO && 
                <textarea 
                    defaultValue={(userInfo && userInfo?.BIO)} 
                    className="w-full py-3 px-5 rounded-3xl border-[#ddd] border-solid border-[1px] placeholder:text-neutral-500 focus:outline-primary"
                    placeholder={"BIO"} 
                    onChange={(e) => setBIO(e.target.value)}></textarea>}
            <Button value={'Save'}/>
            <p className={`cursor-pointer hover:underline ${mood === 'MOON'?'text-white':'text-black'}`} onClick={() => setAddContact(!addContact)}>{!addContact?'Add some contact info':'less contact info'}</p>
            <p className={`cursor-pointer hover:underline ${mood === 'MOON'?'text-white':'text-black'}`} onClick={() => setAddBIO(!addBIO)}>{!addBIO?'Add BIO':'less BIO'}</p>
            {error && 
                <p className="text-[red] mt-2 rounded-md border-[1px] border-solid border-[red] p-3 w-full bg-red-100">{error}</p>}
            {isLoading && 
                <div className="loading flex gap-2 items-center justify-center fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
                    <span className="w-[1em] h-[1em] md:w-[2em] md:h-[2em] rounded-full shadow-md shadow-[#ccc] bg-primary opacity-[50%]"></span>
                    <span className="w-[1em] h-[1em] md:w-[2em] md:h-[2em] rounded-full shadow-md shadow-[#ccc] bg-primary opacity-[50%]"></span>
                    <span className="w-[1em] h-[1em] md:w-[2em] md:h-[2em] rounded-full shadow-md shadow-[#ccc] bg-primary opacity-[50%]"></span>
                </div>}
            <span className={`${mood === 'MOON'?'text-white':'text-black'} flex mt-5 gap-2 items-center cursor-pointer w-fit hover:underline`} onClick={() => setMoreSettings(!moreSettings)}>
                <MdSettings className={`text-4xl transition-[2s] ${moreSettings? 'rotate-90': ''}`}/> {`${moreSettings? 'more': 'less'}`} settings
            </span>
            <div className={`${mood === 'MOON'?'text-white':'text-black'} relative flex-col p-[1em] shadow-md rounded-lg transition-[.5s] ${moreSettings? 'opacity-0': 'opacity-100'} border-[1px] border-[#ddd] border-solid`}>
                <Link to={`/user/${user.user._id}`} className="flex items-center gap-3 py-2 px-4 rounded-[30px] hover:underline">
                    <FaEye className="text-lg"/>View     
                </Link> 
                <div className='flex items-center justify-between py-2 px-4 rounded-[30px] hover:underline'>
                        <span className="flex gap-3 items-center cursor-pointer" onClick={() => dispatchMood({type: (mood==="MOON"? "SUN": "MOON")})}>
                            <BiLandscape className="text-lg"/>Mood
                        </span>
                        <span className="flex items-center gap-5">
                            <FaMoon className={`cursor-pointer ${(mood === 'MOON') && 'text-primary'}`} onClick={() => dispatchMood({type: 'MOON'})}/>
                            <MdSunny className={`cursor-pointer ${(mood === 'SUN') && 'text-primary'}`} onClick={() => dispatchMood({type: 'SUN'})}/>
                        </span>
                </div>
                <Link to={'/logout'} className="flex items-center gap-3 py-2 px-4 rounded-[30px] hover:underline">
                    <FaSignOutAlt className="text-[red] text-lg"/>Log out   
                </Link> 
            </div>
        </form>
    )
}

export default Profile