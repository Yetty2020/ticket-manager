
import { Link } from 'react-router-dom';

// Define the interface for the DecorativeCircle component props
interface DecorativeCircleProps {
    size: string;
    positionClass: string;
}

// Component for the decorative circle with explicit typing
const DecorativeCircle = ({ size, positionClass }: DecorativeCircleProps) => (
    <div 
        className={`absolute rounded-full bg-blue-300 opacity-20 filter blur-xl ${size} ${positionClass}`}
        style={{ zIndex: 0 }}
    />
);

export default function Hero() {
    return (
        // Wrapper for the entire page content, centering and setting max-width
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            
            {/* --- Hero Section: Applies Wavy Background and Height --- */}
            <div className="relative pt-10 pb-32 sm:pb-40 lg:pb-56 bg-white rounded-xl shadow-2xl overflow-hidden">
                
                {/* Decorative Circles */}
                <DecorativeCircle size="w-72 h-72" positionClass="top-10 left-1/4 transform -translate-x-1/2" />
                <DecorativeCircle size="w-48 h-48" positionClass="bottom-20 right-1/4 transform translate-x-1/2" />
                
                {/* Wavy Background using a CSS Clip-Path */}
                <div 
                    className="absolute inset-x-0 bottom-0 h-4/5 bg-blue-500/20" 
                    // Applying the required wavy shape via CSS Clip-Path
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 75% 100%, 25% 90%, 0 100%)', zIndex: 1 }}
                >
                    {/* The decorative circle must overlap the hero section content, 
                        so we place it inside the background but give it a high z-index */}
                     <div 
                         className="absolute w-56 h-56 rounded-full bg-blue-400 opacity-30 transform translate-x-1/2 translate-y-1/2 right-1/2 top-1/2"
                         style={{ zIndex: 2 }} 
                     />
                </div>

                {/* --- Content (Text and CTAs) --- */}
                <div className="relative z-10 text-center pt-20">
                    <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
                        TICKETFLEX
                    </h1>
                    <p className="mt-6 text-xl text-gray-700 sm:text-2xl max-w-2xl mx-auto">
                        Manage, track, and resolve tickets seamlessly across all projects with speed and clarity.
                    </p>

                    {/* Call-to-Action Buttons */}
                    <section className="mt-10 flex justify-center space-x-4">
                        <Link 
                            to="/auth/Login"
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition transform hover:scale-105"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/auth/Signup"
                            className="inline-flex items-center justify-center px-8 py-3 border border-blue-600 text-base font-medium rounded-full shadow-lg text-blue-600 bg-white hover:bg-blue-50 transition transform hover:scale-105"
                        >
                            Get Started
                        </Link>
                    </section>
                </div>
            </div>

            {/* Placeholder for the Footer to maintain consistency */}
             <div className="mt-8 py-4 bg-gray-50/50 text-center text-gray-500 text-sm rounded-xl">
                 <p>&copy; {new Date().getFullYear()} TICKETFLEX. All rights reserved.</p>
             </div>
        </div>
    );
}
