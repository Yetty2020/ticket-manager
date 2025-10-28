import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

// --- Type Definitions ---
// Define the Ticket structure required by the useEffect hook
interface Ticket {
    status: "Open" | "In Progress" | "Closed";
    // Add other fields if necessary for future functionality (id, title, etc.)
}

interface UserSession {
    fullName?: string;
    email?: string;
}

interface HeaderProps {
    onLogout: () => void;
    userName: string;
}

interface DashboardCardProps {
    title: string;
    value: number; // Stats values are numbers
    barColor: string;
}

// --- Shared Components for Layout Consistency (Type Fixes Applied) ---

const SESSION_KEY = "ticketapp_session";

// Header component (Fixed 'any' type)
const Header = ({ onLogout, userName }: HeaderProps) => (
    <header className="bg-white shadow-md">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <div className="text-xl font-bold text-blue-600">
                🎫 TICKETIFY
            </div>
            <nav className="flex space-x-4 items-center">
                <span className="hidden sm:inline text-gray-700 font-semibold">
                    Welcome, {userName}
                </span>
                <Link to="/tickets" className="text-gray-600 hover:text-blue-600 transition">
                    Ticket Management
                </Link>
                <button
                    onClick={onLogout}
                    className="ml-4 px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 shadow-lg transition"
                >
                    Logout
                </button>
            </nav>
        </div>
    </header>
);

// Dashboard Card Component (Fixed 'any' type)
const DashboardCard = ({ title, value, barColor }: DashboardCardProps) => (
    <div className={`p-6 bg-white rounded-xl shadow-xl transition-all hover:shadow-2xl border-b-4 ${barColor}`}>
        <p className={`text-lg font-medium text-gray-700`}>{title}</p>
        <div className="mt-4 text-5xl font-extrabold text-gray-900">{value}</div>
    </div>
);

// --- Main Dashboard Component with Styling ---

export default function Dashboard() {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserSession | null>(null);

    const [stats, setStats] = useState({
        open: 0,
        inProgress: 0,
        closed: 0,
        total: 0,
    });

    // Authentication and Data Loading Logic (Unchanged)
    useEffect(() => {
        // Check authentication
        const session = localStorage.getItem(SESSION_KEY);
        if (!session) {
            navigate("/auth/login");
            return;
        }

        let parsedUser: UserSession = {};
        try {
            const sessionData = JSON.parse(session);
            // Assuming the ticket reducer and type is correctly imported or defined elsewhere
            const userDataRaw = localStorage.getItem("users");
            // NOTE: allUsers filter 'u' is correctly inferred as UserSession from the array type
            const allUsers: UserSession[] = userDataRaw ? JSON.parse(userDataRaw) : [];
            parsedUser = allUsers.find(u => u.email === sessionData.email) || { email: sessionData.email };
            
            setUser(parsedUser);
        } catch (error) {
            console.error("Error parsing session data:", error);
            localStorage.removeItem(SESSION_KEY);
            navigate("/auth/login");
            return;
        }

        // Load and calculate ticket stats
        // NOTE: The array 'tickets' is explicitly typed as Ticket[]
        const tickets: Ticket[] = JSON.parse(localStorage.getItem("tickets") || "[]");

        // The filter callback argument 't' is correctly inferred as 'Ticket'
        const open = tickets.filter((t) => t.status === "Open").length;
        const inProgress = tickets.filter((t) => t.status === "In Progress").length;
        const closed = tickets.filter((t) => t.status === "Closed").length;

        setStats({
            open,
            inProgress,
            closed,
            total: tickets.length,
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem(SESSION_KEY);
        navigate("/auth/login");
    };

    const userName = user?.fullName || user?.email || "User";

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onLogout={handleLogout} userName={userName} />

            <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
                    👋 Hello, {userName}!
                </h1>

                {/* --- Statistic Cards Grid --- */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    
                    {/* Total Tickets */}
                    <DashboardCard
                        title="Total Tickets"
                        value={stats.total}
                        barColor="border-blue-500"
                    />
                    
                    {/* Open Tickets -> Green Accent */}
                    <DashboardCard
                        title="Open Tickets"
                        value={stats.open}
                        barColor="border-green-500"
                    />
                    
                    {/* In Progress -> Amber Accent */}
                    <DashboardCard
                        title="In Progress"
                        value={stats.inProgress}
                        barColor="border-amber-500"
                    />
                    
                    {/* Closed Tickets -> Gray Accent */}
                    <DashboardCard
                        title="Closed Tickets"
                        value={stats.closed}
                        barColor="border-gray-500"
                    />
                </div>

                {/* --- Central Call-to-Action Block --- */}
                <div className="mt-10 p-8 bg-blue-600 text-white rounded-xl shadow-2xl">
                    <h2 className="text-2xl font-bold">Manage Your Workflow</h2>
                    <p className="mt-2 text-blue-100">
                        View, create, and update all active tickets in the system.
                    </p>
                    <button
                        onClick={() => navigate("/tickets")}
                        className="mt-4 inline-block px-6 py-3 font-semibold rounded-lg bg-white text-blue-600 hover:bg-gray-100 transition shadow-md transform hover:scale-[1.02]"
                    >
                        Go to Ticket Management
                    </button>
                </div>
            </main>
        </div>
    );
}