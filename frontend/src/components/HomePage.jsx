import { Link } from 'react-router-dom';
import heroImg from '../assets/img05.jpg';
// import featuresImg from '../assets/img02.jpg'; // add a relevant image
import arIcon from '../assets/vr-gaming.png'; // placeholder for icon
import routeIcon from '../assets/route.png'; // placeholder for icon
import searchIcon from '../assets/map-search.png';
import senate from '../assets/senate.jpg';

const HomePage = () => {
    return (
        <div className="w-full bg-[#fffdfd] text-black">
            {/* Hero Section */}
            <section className="w-full min-h-[80vh] flex flex-col md:flex-row items-center justify-around p-5 md:p-10">
                <div className="w-full md:w-1/2 flex flex-col space-y-8 animate-fadeIn">
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
                        Welcome to <span className="text-red-600 hover:text-red-500 transition-colors">MapMyWay</span>
                    </h1>
                    <p className="text-gray-600 text-xl md:text-2xl leading-relaxed">
                        Your all-in-one, interactive campus navigator designed to make finding your way around NSUK effortless and enjoyable.
                    </p>
                    <div className="flex space-x-4">
                        <Link 
                            to="/map" 
                            className="group inline-flex items-center bg-red-600 text-white px-8 py-4 font-bold rounded-lg hover:bg-red-500 transition-all transform hover:-translate-y-1"
                        >
                            View Map
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </Link>
                        <Link 
                            to="/signup" 
                            className="inline-flex items-center px-8 py-4 font-bold rounded-lg border-2 border-red-600 text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center mt-12 md:mt-0">
                    <img 
                        src={heroImg} 
                        alt="Map navigation system" 
                        className="w-4/5 h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </section>

            {/* Campus Exploration Section */}
            <section className='w-full my-16 px-5 md:px-20'>
                <div className='w-full h-[40vh] md:h-[50vh] relative overflow-hidden rounded-2xl shadow-2xl group'>
                    <img 
                        className='w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110' 
                        src={senate} 
                        alt="NSUK senate building" 
                    />
                    {/* Dark Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 to-transparent'></div>
                    
                    {/* Content */}
                    <div className='absolute bottom-0 left-0 w-full p-8 text-white'>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3 transform transition-all duration-500 group-hover:-translate-y-2">
                            Explore the NSUK Campus
                        </h2>
                        <p className="text-lg md:text-xl text-gray-200 max-w-2xl transform transition-all duration-500 group-hover:-translate-y-2">
                            Discover all the key locations, from lecture halls to hostels, with ease.
                        </p>
                        
                        {/* Optional: Add a CTA button */}
                        <Link 
                            to="/map" 
                            className="inline-block mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg 
                                    hover:bg-red-500 transition-all duration-300 transform group-hover:-translate-y-2"
                        >
                            Start Exploring →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-20 px-5 md:px-20 bg-gray-50">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                    <span className="text-red-600">Key</span> Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        {
                            icon: searchIcon,
                            title: "Search & Discover",
                            description: "Type any location name and instantly see it highlighted on the map with photos and descriptions."
                        },
                        {
                            icon: routeIcon,
                            title: "Personalized Routes",
                            description: "Get turn-by-turn directions on foot or by shuttle—navigate campus like a pro."
                        },
                        {
                            icon: arIcon,
                            title: "Photo-Backed POIs",
                            description: "Upload and view real user photos for every location to know exactly what to look for."
                        }
                    ].map((feature, index) => (
                        <div 
                            key={index}
                            className="group flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        >
                            <div className="w-20 h-20 mb-6 p-4 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
                                <img src={feature.icon} alt={feature.title} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
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
            <section className="w-full py-20 px-5 md:px-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        Get Started in <span className="text-red-500">Seconds</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {[
                            {
                                step: "1",
                                title: "Sign Up or Log In",
                                description: "Create a free account or use your campus credentials."
                            },
                            {
                                step: "2",
                                title: "Explore the Map",
                                description: "Pan, zoom, and click any point of interest."
                            },
                            {
                                step: "3",
                                title: "Search & Navigate",
                                description: "Find any building and get directions instantly."
                            },
                            {
                                step: "4",
                                title: "Share & Photos",
                                description: "Upload images to help future users recognize locations."
                            }
                        ].map((step, index) => (
                            <div key={index} className="flex items-start space-x-4 p-6 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors">
                                <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-red-600 rounded-full font-bold text-xl">
                                    {step.step}
                                </span>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                    <p className="text-gray-300">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <Link 
                            to="/signup" 
                            className="inline-flex items-center bg-red-600 text-white px-10 py-5 font-bold rounded-xl hover:bg-red-500 transition-all transform hover:-translate-y-1"
                        >
                            Get Started Now
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
