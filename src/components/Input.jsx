const Input = ({ type, placeholder, value, style, onChange }) => {
    return (
        <input 
            type={type} 
            placeholder={placeholder}
            onChange={onChange}
            className={`text-black w-full py-3 px-5 rounded-3xl border-[#ddd] border-solid border-[1px] placeholder:text-neutral-500 focus:outline-primary ${style}`}
            defaultValue={value}
            min={0}
        />
    )
}

export default Input