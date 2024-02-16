import { useThemeMoodContext } from "../hooks/useThemeMoodContext"

const HeaderInput = ({ name, shortText }) => {
    const { mood } = useThemeMoodContext();

    return (
        <>
            <h2 className={`font-bold ml-2 text-xl ${mood === 'MOON'?'text-white':'text-black'} `}>{name}</h2>
            <p className="text-neutral-500 ml-2 mb-2">{shortText}</p>
        </>
    )
}

export default HeaderInput