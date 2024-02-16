import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useUserContext } from '../hooks/useUserContext'
import { BiLike, BiRadio, BiTv, BiWindow, } from "react-icons/bi"
import { FaCarAlt, FaCloudUploadAlt, FaStar, FaTrash, FaWifi } from "react-icons/fa"
import Input from "./Input"
import Button from "./Button"
import { useEffect, useRef, useState } from "react"
import HeaderInput from "./HeaderInput"
import Loading from "./Loading"
import ErrorInput from './ErrorInput'
import { apiUrl } from '../constant/apiUrl'
import { usePlaceContext } from '../hooks/usePlaceContext'
import { useThemeMoodContext } from '../hooks/useThemeMoodContext'

const AddNewPlace = () => {
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [price, setPrice] = useState('');
    const [per, setPer] = useState('hour');
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [beds, setBeds] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [addedPhoto, setAddedPhoto] = useState([]);
    const [error, setError] = useState('');
    
    const inputFile = useRef()
    
    const { id } = useParams();

    const to = useNavigate();

    const { user } = useUserContext();
    const { dispatch } = usePlaceContext()
    const { mood } = useThemeMoodContext();

    useEffect(() => {
        if(!user) {
            return
        }
        if(id) {
            setIsLoading(true)
            axios.get(`${apiUrl}/place/${id}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => {
                    setAddedPhoto(res.data.photos)
                    setAddress(res.data.address)
                    setCheckIn(res.data.checkIn)
                    setCheckOut(res.data.checkOut)
                    setDescription(res.data.description)
                    setExtraInfo(res.data.extraInfo)
                    setMaxGuests(res.data.maxGuests)
                    setPer(res.data.per)
                    setPrice(res.data.price)
                    setPerks(res.data.perks)
                    setTitle(res.data.title)
                    setRooms(res.data.rooms)
                    setBeds(res.data.beds)
                })
        }
        setIsLoading(false)
    }, [])

    const handleAddPhotoAsFileClick = (e) => {
        e.preventDefault();

        inputFile.current.click();
    }

    const handleUploadPhotoChange = (e) => {
        setIsLoading(true);
        
        const files = e.target.files 
        const formData = new FormData();
        
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])            
        }

        axios.post(`${apiUrl}/place/upload-by-file`, formData,{
            headers: {
                'Content-Type': `multipart/form-data`,
                'Authorization': `Bearer ${user.token}`
            }
        }).then((res) => {
            if(res.statusText !== "OK") {
                throw Error("Failed Fetch");
            }
            setAddedPhoto(prev => {
                return [...prev, res.data]
            })
        } )

        setIsLoading(false);

    }

    const handleAddPhotoLinkClick = (e) => {
        e.preventDefault();

        setIsLoading(true);

        axios.post("http://localhost:4000/api/place/upload-by-link", {
            photoLink
        }, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }).then((res) => {
            if(res.statusText !== "OK") {
                throw Error("Failed Fetch");
            }
            setAddedPhoto(prev => {
                return [...prev, res.data]
            })
        } )

        setIsLoading(false);
        setPhotoLink('');
    }

    const handleCheckboxClick = (e) => {
        const {name, checked} = e.target;

        if(checked) {
            setPerks(prev => [...prev, name])
        } else {
            setPerks(prev => [...prev.filter(e => e != name)])
        }
    }

    const handleSubmit = (e) => {
        if(!user) {
            return;
        }
        e.preventDefault();

        const data = {
            title, address, addedPhoto, 
            description, per, perks, price, beds,
            extraInfo, checkIn, checkOut, maxGuests, rooms
        };
        setIsLoading(true);

        if(id) {
            axios.put(`${apiUrl}/place/update/${id}`, data, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => {
                    if(res.statusText !== "OK") {
                        return setError(res.error);
                    }
                    dispatch({type: 'UPDATE_PLACE', payload: res.data})
                    setError('')
                    to('/account/recommendations/')
                })
                .catch(err => {
                    setError(err.message)
                    console.log(err);
                });
        } else {
            axios.post(`${apiUrl}/place/create`, data, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
                .then(res => {
                    if(res.statusText !== "OK") {
                        return setError(res.error);
                    }
                    dispatch({type: 'CREATE_PLACE', payload: res.data})
                    setError('')
                    to('/account/recommendations/')
                })
                .catch(err => {
                    setError(err.message)
                    console.log(err);
                });
        }
        setIsLoading(false);
    }

    return (
        <form className="my-10 mx-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <label>
                <HeaderInput name={'Title'} shortText={'Title for your place, should be short and cerntly as in adversment'}/>
                <Input type={"text"} placeholder={"title, ex: My lovely apt"} value={title} onChange={(e) => setTitle(e.target.value)}/>
            </label>
            <label>
                <HeaderInput name={'Address'} shortText={'Address for your place'}/>
                <Input type={"text"} placeholder={"address"} value={address} onChange={(e) => setAddress(e.target.value)}/>
            </label>
            <label>
                <HeaderInput name={'Photos'} shortText={'More & Better'}/>
                <div className="flex items-center justify-center gap-2 mb-2 ">
                    <Input type={"text"} placeholder={"Add using a link or jpg..."} value={photoLink} onChange={(e) => setPhotoLink(e.target.value)}/>
                    <button className="p-[1em] rounded-[30px] border-[1px] border-solid border-[#ddd] bg-primary text-white" onClick={handleAddPhotoLinkClick}>Add&nbsp;photo</button>
                </div>
                {(addedPhoto.length > 1) && <p className="text-neutral-500 ml-2 mb-2">Click on the star to be a main photo (make it at first)</p>}
                <input ref={inputFile} multiple type="file" className='hidden' onChange={handleUploadPhotoChange} />
                <div className='photos-added grid gap-5 mt-5'>
                    {(addedPhoto.length > 0) && addedPhoto.map((link, id) => (
                        <div className="relative rounded-[30px] h-[144px] flex justify-center items-center cursor-pointer border-[1px] border-solid border-[#ddd] overflow-hidden" key={id}>
                            <span className='absolute p-2 bg-neutral-500 text-white text-lg right-3 top-3 cursor-pointer rounded-full shadow-2xl transition-[.5s] hover:scale-110 z-40' onClick={() => setAddedPhoto(addedPhoto.filter(e => e != link))}>
                                <FaTrash/>
                            </span>
                            <span className='absolute p-2 bg-neutral-500 text-white text-lg left-3 top-3 cursor-pointer rounded-full shadow-2xl transition-[.5s] hover:scale-110 z-40' onClick={() => setAddedPhoto([link,...addedPhoto.filter(e => e != link)])}>
                                <FaStar className={id == 0? 'text-yellow-400': ""}/>
                            </span>
                            <img className='object-cover' src={`http://localhost:4000/uploads/${link}`} alt={'place'}/>
                        </div>
                    ))}
                    <div className="p-[1em] rounded-[30px] h-[6em] flex gap-2 justify-center items-center cursor-pointer border-[1px] border-solid border-[#ddd] focus:outline-primary text-[1.5rem] text-neutral-500" onClick={handleAddPhotoAsFileClick}>
                        <FaCloudUploadAlt className="text-[2rem]"/>
                        <p>Upload</p>
                    </div>
                </div>
            </label>
            <label>
                <HeaderInput name={'Describtion'} shortText={'Describtion for your place'}/>
                <textarea
                    type="text" 
                    defaultValue={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-[1em] rounded-[30px] w-full h-[10em] border-[1px] border-solid border-[#ddd] focus:outline-primary"
                ></textarea>
            </label>
            <label>
                <HeaderInput name={'Perks'} shortText={'Select all perks for your place'}/>
                <div className="flex justify-between items-center flex-wrap gap-3">
                    <div className="flex-[30%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="checkbox" name={'wifi'} onClick={handleCheckboxClick} value={perks} className="cursor-pointer accent-primary outline-none"/>
                        <FaWifi className="mr-[-4px]"/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>WIFI</p>
                    </div>
                    <div className="flex-[30%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="checkbox" name={'parking'} onClick={handleCheckboxClick} value={perks} className="cursor-pointer accent-primary outline-none"/>
                        <FaCarAlt className="mr-[-4px]"/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>Free&nbsp;parking&nbsp;spot</p>
                    </div>
                    <div className="flex-[30%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="checkbox" name={'tv'} onClick={handleCheckboxClick} value={perks} className="cursor-pointer accent-primary outline-none"/>
                        <BiTv className="mr-[-4px]"/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>TV</p>
                    </div>
                    <div className="flex-[30%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="checkbox" name={'radio'} onClick={handleCheckboxClick} value={perks} className="cursor-pointer accent-primary outline-none"/>
                        <BiRadio className="mr-[-4px]"/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>Radio</p>
                    </div>
                    <div className="flex-[30%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="checkbox" name={'pets'} onClick={handleCheckboxClick} value={perks} className="cursor-pointer accent-primary outline-none"/>
                        <BiLike className="mr-[-4px]"/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>Pets</p>
                    </div>
                    <div className="flex-[30%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="checkbox" name={'entrance'} onClick={handleCheckboxClick} value={perks} className="cursor-pointer accent-primary outline-none"/>
                        <BiWindow className="mr-[-4px]"/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>Private&nbsp;entrance</p>
                    </div>
                </div>
            </label>
            <label>
                <HeaderInput name={'Rooms'} shortText={'Number of rooms (with bathrooms and kitchens)'}/>
                <Input type={"number"} placeholder={"rooms"} value={rooms} onChange={(e) => setRooms(e.target.value)}/>
            </label>
            <label>
                <HeaderInput name={'Beds'} shortText={'Number of beds'}/>
                <Input type={"number"} placeholder={"beds"} value={beds} onChange={(e) => setBeds(e.target.value)}/>
            </label>
            <label>
                <HeaderInput name={'Extra info'} shortText={'House rules, etc'}/>
                <textarea
                    type="text" 
                    defaultValue={extraInfo}
                    onChange={(e) => setExtraInfo(e.target.value)}
                    className="p-[1em] rounded-[30px] w-full h-[10em] border-[1px] border-solid border-[#ddd] focus:outline-primary"
                ></textarea>
            </label>
            <label>
                <HeaderInput name={'Check in&out times, max guests'} shortText={'Add check in&out times, remember to have some time window for cleaning the room between guests'}/>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <div className="flex-[30%]">
                        <h2 className="font-bold mb-1 ml-2">Check&nbsp;in&nbsp;time</h2>
                        <Input type={"time"} value={checkIn} onChange={(e) => setCheckIn(e.target.value)}/>
                    </div>
                    <div className="flex-[30%]">
                        <h2 className="font-bold mb-1 ml-2">Check&nbsp;out&nbsp;time</h2>
                        <Input type={"time"} value={checkOut} onChange={(e) => setCheckOut(e.target.value)}/>
                    </div>
                    <div className="flex-[30%]">
                        <h2 className="font-bold mb-1 ml-2">Max&nbsp;guests</h2>
                        <Input type={"number"} placeholder={"4"} value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)}/>
                    </div>
                </div>
            </label>
            <label>
                <HeaderInput name={'Price'} shortText={'Price for your place in euro'}/>
                <Input type={"number"} placeholder={"price"} value={price} onChange={(e) => setPrice(e.target.value)}/>
            </label>
            <label>
                <HeaderInput name={'Per'} shortText={'Price for every day/month, etc'}/>
                <div className="flex justify-between items-center flex-wrap gap-3">
                    <div className="flex-[45%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="radio" name="per" className="cursor-pointer accent-primary outline-none" value={'hour'} onClick={e => setPer(e.target.value)} defaultChecked/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>Hour</p>
                    </div>
                    <div className="flex-[45%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="radio" name="per" className="cursor-pointer accent-primary outline-none" value={'day'} onClick={e => setPer(e.target.value)}/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>Day</p>
                    </div>
                    <div className="flex-[45%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="radio" name='per' className="cursor-pointer accent-primary outline-none" value={'month'} onClick={e => setPer(e.target.value)}/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>Month</p>
                    </div>
                    <div className="flex-[45%] flex items-center p-[1em] rounded-[30px] gap-3 border-[1px] border-solid border-[#ddd]">
                        <input type="radio" name='per' className="cursor-pointer accent-primary outline-none" value={'year'} onClick={e => setPer(e.target.value)}/>
                        <p className={`${mood === 'MOON'?'text-white':'text-black'}`}>Year</p>
                    </div>
                </div>
            </label>
            <Button value={'Save'}/>
            {error && <ErrorInput error={error}/> }
            {isLoading && <Loading/>}
        </form>
    )
}

export default AddNewPlace