import { Link } from 'react-router-dom';
import heroImg from '../assets/img05.jpg';
// import featuresImg from '../assets/img02.jpg'; // add a relevant image
import arIcon from '../assets/vr-gaming.png'; // placeholder for icon
import routeIcon from '../assets/route.png'; // placeholder for icon
import searchIcon from '../assets/map-search.png';

const HomePage = () => {
    return (
        <div className="w-full bg-[#fffdfd] text-black">
            {/* Hero Section */}
            <section className="w-full h-fit flex flex-col md:flex-row items-center justify-around p-5">
                <div className="w-full md:w-1/2 flex flex-col space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Welcome to <span className="text-red-600">MapMyWay</span></h1>
                    <p className="text-gray-600 text-lg md:text-xl">Your all-in-one, interactive campus navigator designed to make finding your way around NSUK effortless and enjoyable.</p>
                    <Link to="/map" className="inline-block bg-red-600 text-white px-8 py-4 font-bold rounded-lg hover:bg-red-500 transition">View Map</Link>
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center mt-12 md:mt-0">
                    <img src={heroImg} alt="Map navigation system" className="w-4/5 h-auto rounded-2xl shadow-lg" />
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-16 px-5 md:px-20 bg-white">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
                        <img src={searchIcon} alt="Search icon" className="w-16 h-16 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Search & Discover</h3>
                        <p className="text-gray-600">Type any location name and instantly see it highlighted on the map with photos and descriptions.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
                        <img src={routeIcon} alt="Route icon" className="w-16 h-16 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Personalized Routes</h3>
                        <p className="text-gray-600">Get turn-by-turn directions on foot or by shuttle—navigate campus like a pro.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg shadow-md">
                        <img src={arIcon} alt="AR icon" className="w-16 h-16 mb-4" />

                        <h3 className="text-xl font-semibold mb-2">Photo-Backed POIs</h3>
                        <p className="text-gray-600">Upload and view real user photos for every location to know exactly what to look for.</p>
                    </div>
                </div>
            </section>

            {/* Who It's For Section */}
            <section className="w-full py-16 px-5 md:px-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Who It's For</h2>
                <div className="flex flex-col md:flex-row md:space-x-8 items-start md:items-start justify-center">
                    <div className="flex-1 mb-8 md:mb-0">
                        <div className='flex items-start space-x-4 mb-6'>
                            <span className='w-2 h-8 bg-red-600'></span>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">New Students & Visitors</h3>
                            <p className="text-gray-600">Orient yourself on day one—locate lecture halls, hostels, and key facilities without stress.</p>
                        </div>
                        </div>
                    </div>
                    <div className="flex-1 mb-8 md:mb-0">
                        <div className='flex items-start space-x-4 mb-6'>
                            <span className='w-2 h-8 bg-red-600'></span>
                        <div>
                        <h3 className="text-2xl font-semibold mb-4">Daily Commuters</h3>
                        <p className="text-gray-600">Save time between classes with the fastest, most efficient paths across campus.</p>
                        </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className='flex items-start space-x-4 mb-6'>
                            <span className='w-2 h-8 bg-red-600'></span>
                        <div>
                        <h3 className="text-2xl font-semibold mb-4">Campus Admins</h3>
                        <p className="text-gray-600">Easily add, edit, and manage campus points of interest to keep the map up to date.</p>
                        </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Get Started Section */}
            <section className="w-full py-16 px-5 md:px-20 bg-gray-800 text-white rounded-2xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get Started in Seconds</h2>
                <ol className="max-w-2xl mx-auto list-decimal list-inside space-y-6 text-white">
                    <li><span className="font-semibold">Sign Up or Log In:</span> Create a free account or use your campus credentials.</li>
                    <li><span className="font-semibold">Explore the Map:</span> Pan, zoom, and click any point of interest.</li>
                    <li><span className="font-semibold">Search & Navigate:</span> Find any building and get directions instantly.</li>
                    <li><span className="font-semibold">Share & Photos:</span> Upload images to help future users recognize locations.</li>
                </ol>
                <div className="text-center mt-12">
                    <Link to="/signup" className="bg-red-600 text-white px-8 py-4 font-bold rounded hover:bg-red-500 transition">
                        Get Started Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
