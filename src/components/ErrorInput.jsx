const ErrorInput = ({ error }) => {
    return (
        <p className="text-[red] mt-2 rounded-md border-[1px] border-solid border-[red] p-3 w-full bg-red-100">{error}</p>
    )
}

export default ErrorInput