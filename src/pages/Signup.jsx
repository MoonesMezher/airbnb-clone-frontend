import { useState } from "react";
import { Link } from "react-router-dom"
import { useUserContext } from "../hooks/useUserContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ErrorInput from "../components/ErrorInput";
import { useThemeMoodContext } from "../hooks/useThemeMoodContext";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [emptyFilds, setEmptyFilds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { dispatch } = useUserContext();
    const { mood } = useThemeMoodContext();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        setIsLoading(true);

        const res = await fetch('http://127.0.0.1:4000/api/user/signup', {
            method: "POST",
            body: JSON.stringify({name ,email, password}),
            headers: {'Content-Type': 'application/json'},
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

    return (
        <form 
            className={`${mood === 'MOON'? 'bg-black text-white': 'bg-white text-black'} p-4 rounded-xl text-center flex flex-col gap-2 max-w-[35em] mx-auto justify-center items-center w-full h-[calc(100vh-7em)]`}
            onSubmit={handleSubmit}>
            <h2 className="font-bold text-4xl mb-4">Sign up</h2>
            <Input type={"text"} placeholder={"John Doe"} value={name} style={(emptyFilds && emptyFilds.includes("email"))? "border-[red] bg-red-100 shake": ""} onChange={(e) => setName(e.target.value)}/>
            <Input type={"email"} placeholder={"your@email.com"} value={email} style={(emptyFilds && emptyFilds.includes("email"))? "border-[red] bg-red-100 shake": ""} onChange={(e) => setEmail(e.target.value)}/>
            <Input type={"password"} placeholder={"password"} value={password} style={(emptyFilds && emptyFilds.includes("email"))? "border-[red] bg-red-100 shake": ""} onChange={(e) => setPassword(e.target.value)}/>
            <Button value={'Signup'}/>
            <p>
                Already a member?
                <Link to="/login" className="hover:underline font-bold"> Log in</Link>
            </p>
            {error && <ErrorInput error={error}/>}
            {isLoading && <Loading/>}
        </form>
    )
}

export default Signup