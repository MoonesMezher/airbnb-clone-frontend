const Loading = () => {
    return (
        <div className="loading flex gap-2 items-center justify-center fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50">
            <span className="w-[1em] h-[1em] md:w-[2em] md:h-[2em] rounded-full shadow-md shadow-[#ccc] bg-primary opacity-[50%]"></span>
            <span className="w-[1em] h-[1em] md:w-[2em] md:h-[2em] rounded-full shadow-md shadow-[#ccc] bg-primary opacity-[50%]"></span>
            <span className="w-[1em] h-[1em] md:w-[2em] md:h-[2em] rounded-full shadow-md shadow-[#ccc] bg-primary opacity-[50%]"></span>
        </div>
    )
}

export default Loading