import { Link } from "react-router-dom";
const NotFound = () => {
    return(
        <section className="h-screen w-full flex flex-col items-center justify-center">
            <h1 className="text-xl md:text-3xl font-bold">Page Not Found</h1>
            <Link to='/' className="bg-green-500 text-white px-6 py-3 my-3 rounded hover:bg-green-400 delay-100 ease-in-out">Back to Safety</Link>
        </section>
    )
};
export default NotFound;