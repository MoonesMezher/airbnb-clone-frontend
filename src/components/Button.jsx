const Button = ({ value }) => {
    return (
        <button className="w-full py-3 outline-none px-5 rounded-3xl bg-primary text-white transition-[.5s] hover:shadow-md">{value}</button>
    )
}

export default Button