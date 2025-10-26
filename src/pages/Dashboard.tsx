// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// interface Ticket {
//   status: "Open" | "In Progress" | "Closed";
// }

// interface UserSession {
//   fullName?: string;
//   email?: string;
// }

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState<UserSession | null>(null);

//   const [stats, setStats] = useState({
//     open: 0,
//     inProgress: 0,
//     closed: 0,
//     total: 0,
//   });

//   // ✅ Run once when dashboard loads
//   useEffect(() => {
//     // Check authentication
//     const session = localStorage.getItem("ticketapp_session");
//     if (!session) {
//       navigate("/auth/login");
//       return;
//     }

//     try {
//       const parsedUser: UserSession = JSON.parse(session);
//       setUser(parsedUser);
//     } catch (error) {
//       console.error("Error parsing session data:", error);
//       localStorage.removeItem("ticketapp_session");
//       navigate("/auth/login");
//       return;
//     }

//     // Load and calculate ticket stats
//     const tickets: Ticket[] = JSON.parse(localStorage.getItem("tickets") || "[]");
//     const open = tickets.filter((t) => t.status === "Open").length;
//     const inProgress = tickets.filter((t) => t.status === "In Progress").length;
//     const closed = tickets.filter((t) => t.status === "Closed").length;

//     setStats({
//       open,
//       inProgress,
//       closed,
//       total: tickets.length,
//     });
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("ticketapp_session");
//     navigate("/auth/login");
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <h2>Welcome, {user?.fullName || "User"} 👋</h2>
//         <button onClick={handleLogout}>Logout</button>
//       </header>

//       <section style={{ display: "flex", gap: "1rem", marginTop: "20px" }}>
//         <div>Open Tickets: {stats.open}</div>
//         <div>In Progress: {stats.inProgress}</div>
//         <div>Closed: {stats.closed}</div>
//         <div>Total: {stats.total}</div>
//       </section>

//       <main style={{ marginTop: "30px" }}>
//         <h3>Your Dashboard</h3>
//         <p>Here you’ll see your ticket statistics soon...</p>
//       </main>

//       <button
//         style={{ marginTop: "20px" }}
//         onClick={() => navigate("/tickets")}
//       >
//         Go to Ticket Manager
//       </button>
//     </div>
//   );
// }


import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Ticket } from "../../types/ticket"; // Assuming you have a types file

// --- Shared Components for Layout Consistency ---

const SESSION_KEY = "ticketapp_session";

// Header component (Reused from previous code)
const Header = ({ onLogout, userName }) => (
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

// Dashboard Card Component
const DashboardCard = ({ title, value, barColor }) => (
    <div className={`p-6 bg-white rounded-xl shadow-xl transition-all hover:shadow-2xl border-b-4 ${barColor}`}>
        <p className={`text-lg font-medium text-gray-700`}>{title}</p>
        <div className="mt-4 text-5xl font-extrabold text-gray-900">{value}</div>
    </div>
);

// --- Main Dashboard Component with Styling ---

interface UserSession {
    fullName?: string;
    email?: string;
}

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
            // In a real app, session data should contain user details or a token to fetch them.
            // For this mockup, we check for a fake token and assume user data is in local storage.
            const userDataRaw = localStorage.getItem("users");
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
        // NOTE: The mock ticket statuses in the CRUD component were 'open', 'in_progress', 'closed' (lowercase).
        // This Dashboard component expects 'Open', 'In Progress', 'Closed' (Title Case).
        // I will adjust the logic here to count based on the expected Title Case values for consistency with this file.
        const tickets: Ticket[] = JSON.parse(localStorage.getItem("tickets") || "[]");

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