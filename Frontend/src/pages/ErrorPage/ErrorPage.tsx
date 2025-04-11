import { Link } from "react-router"

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="mb-4">404 Page Not Found</div>
            <Link to="/" className="cursor-pointer p-3 text-white font-semibold rounded-md transition bg-gradient-to-r from-[#9537c7] to-[#3ec3ba] hover:opacity-90">Go to Home</Link>
        </div>
    )
}

export default ErrorPage