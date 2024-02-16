import { useState } from "react"
import { Link } from "react-router-dom";
import { useUserContext } from '../hooks/useUserContext'
import { useThemeMoodContext } from '../hooks/useThemeMoodContext'
import Input from "../components/Input";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ErrorInput from "../components/ErrorInput";
import axios from "axios";
import { apiUrl } from "../constant/apiUrl";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [emptyFilds, setEmptyFilds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { dispatch } = useUserContext();
    const { mood } = useThemeMoodContext()

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        const res = await fetch('http://127.0.0.1:4000/api/user/login', {
            method: "POST",
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json();

        if(res.ok) {
            setError(null);
            setEmptyFilds([]);
            dispatch({type: "LOGIN", payload: data})
            setIsLoading(false);
        } else {
            setError(data.error);
            setEmptyFilds(data.emptyFilds);
            setIsLoading(false);
        }
    }

    const loginWithGoogle = async (e) => {
        e.preventDefault();

        axios.get(`${apiUrl}/auth/login/success`)
            .then(res => {
                if(res.statusText !== 'OK') {
                    return console.log(res.data);
                }
                console.log(res.data);
            })
    }

    return (
        <form className={`${mood === 'MOON'? 'bg-black text-white': 'bg-white text-black'} p-4 rounded-xl text-center flex flex-col justify-center items-center gap-2 max-w-[35em] mx-auto my-10 w-full h-[calc(100vh-7em)]`} onSubmit={handleSubmit}>
            <h2 className="font-bold text-4xl mb-4">Log in</h2>
            <Input type={"email"} placeholder={"your@email.com"} value={email} style={(emptyFilds && emptyFilds.includes("email"))? "border-[red] bg-red-100 shake": ""} onChange={(e) => setEmail(e.target.value)}/>
            <Input type={"password"} placeholder={"password"} value={password} style={(emptyFilds && emptyFilds.includes("email"))? "border-[red] bg-red-100 shake": ""} onChange={(e) => setPassword(e.target.value)}/>
            <Button value={'Login'}/>
            <div onClick={(e) => loginWithGoogle(e)}>
                <Button value={'Login with Google'}/>
            </div>
            <p>
                you dont have an accaount?
                <Link to="/signup" className="hover:underline font-bold"> Sign up</Link>
            </p>
            {error && <ErrorInput error={error}/>}
            {isLoading && <Loading/>}
        </form>
    )
}

export default Login