import { useNavigate } from "react-router-dom"
import { useUserContext } from "../hooks/useUserContext";
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const Logout = () => {
    const { dispatch } = useUserContext();
    const { mood } = useThemeMoodContext();
    
    const to = useNavigate();

    return (
        <div className={`border-[1px] border-[#ddd] border-solid flex flex-col justify-center items-center m-14 p-[1.5em] rounded-lg ${mood === 'MOON'? 'bg-black text-white': 'bg-white text-black'} shadow-md min-h-screen`}>
            <p className="font-bold">Are you sure you want to log out?</p>
            <div className="flex gap-3 mt-5 flex-wrap">
                <span onClick={() => dispatch({type: "LOGOUT"})} className="rounded-md cursor-pointer py-[.5em] px-[1em] bg-green-600 text-white">Yes</span>
                <span onClick={() => to('/')} className="rounded-md cursor-pointer py-[.5em] px-[1em] bg-[red] text-white">No</span>
            </div>
        </div>
    )
}

export default Logout