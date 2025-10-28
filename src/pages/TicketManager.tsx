import { useReducer, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// --- CORE APPLICATION TYPES (Integrated) ---

type Priority = "Low" | "Medium" | "High";
type Status = "Open" | "In Progress" | "Closed";

interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    status: Status;
    createdAt: string;
}

interface TicketState {
    tickets: Ticket[];
}

type TicketAction =
    | { type: "ADD_TICKET"; payload: Ticket }
    | { type: "UPDATE_TICKET"; payload: Ticket }
    | { type: "DELETE_TICKET"; payload: number };

// --- REDUCER LOGIC (Integrated) ---

const initialTicketState: TicketState = {
    tickets: [
        { id: 101, title: "Initial login failure on mobile app", description: "Users are reporting that they cannot log in to the iOS app after the latest update (v2.1). The API returns a 500 status.", priority: "High", status: "Open", createdAt: new Date(Date.now() - 3600000).toLocaleString() },
        { id: 102, title: "Update copyright year in footer", description: "The footer currently shows ©2024. Please update it to ©2025.", priority: "Low", status: "Closed", createdAt: new Date(Date.now() - 7200000).toLocaleString() },
        { id: 103, title: "Refactor database query service", description: "The service responsible for fetching user data is slow. Need to optimize PostgreSQL queries.", priority: "Medium", status: "In Progress", createdAt: new Date(Date.now() - 10800000).toLocaleString() },
    ],
};

const ticketReducer = (state: TicketState, action: TicketAction): TicketState => {
    switch (action.type) {
        case "ADD_TICKET":
            return {
                ...state,
                tickets: [action.payload, ...state.tickets].sort((a, b) => b.id - a.id), // Add new and sort by ID descending
            };
        case "UPDATE_TICKET":
            return {
                ...state,
                tickets: state.tickets.map(t =>
                    t.id === action.payload.id ? action.payload : t
                ).sort((a, b) => b.id - a.id),
            };
        case "DELETE_TICKET":
            return {
                ...state,
                tickets: state.tickets.filter(t => t.id !== action.payload),
            };
        default:
            return state;
    }
};

// --- Custom Component Types ---

interface ColorScheme {
    text: string;
    bg: string;
    accent: string;
}

interface StatusColors {
    Open: ColorScheme;
    'In Progress': ColorScheme;
    Closed: ColorScheme;
    High: string;
    Medium: string;
    Low: string;
    [key: string]: ColorScheme | string; // Index signature for dynamic access
}

interface HeaderProps {
    onBack: () => void;
}

interface TicketCardProps {
    ticket: Ticket;
    onEdit: (ticket: Ticket) => void;
    onDelete: (id: number) => void;
}

interface ToastProps {
    message: string;
    type: 'success' | 'error';
}

// --- UI Utilities ---

const STATUS_COLORS: StatusColors = {
    Open: {
        text: 'text-green-800',
        bg: 'bg-green-100',
        accent: 'border-green-500'
    },
    'In Progress': {
        text: 'text-amber-800',
        bg: 'bg-amber-100',
        accent: 'border-amber-500'
    },
    Closed: {
        text: 'text-gray-700',
        bg: 'bg-gray-200',
        accent: 'border-gray-500'
    },
    // Adding Priority colors for better visual separation
    High: 'text-red-600',
    Medium: 'text-yellow-600',
    Low: 'text-green-600'
};

// Component for non-modal notifications (replaces alert/confirm)
const ToastNotification = ({ message, type }: ToastProps) => {
    const colorClass = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    return (
        <div 
            className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-xl transition-opacity duration-300 transform translate-y-0 opacity-100 ${colorClass}`} 
            style={{ zIndex: 100 }}
        >
            {message}
        </div>
    );
};


// Custom Header Component
const Header = ({ onBack }: HeaderProps) => (
    <header className="bg-white shadow-md">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
            <div className="text-xl font-bold text-blue-600">
                🎫 TICKETIFY
            </div>
            <button
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg transition"
            >
                Back to Dashboard
            </button>
        </div>
    </header>
);

// --- Styled Ticket Card Component ---
const TicketCard = ({ ticket, onEdit, onDelete }: TicketCardProps) => {
    // Type casting for safer property access
    const status = STATUS_COLORS[ticket.status] as ColorScheme;
    const priorityColor = STATUS_COLORS[ticket.priority] as string;

    const StatusTag = () => (
        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${status.bg} ${status.text} tracking-wider`}>
            {ticket.status.toUpperCase()}
        </span>
    );

    const handleDeleteClick = () => {
        // Using a built-in confirmation dialog is necessary here for a critical destructive action, 
        // as custom modals require additional state/logic outside of this scope.
        // I've added a console log to signal the use of this for the user.
        console.log("NOTE: Using window.confirm for critical deletion. In a production app, replace with a custom modal.");

        if (window.confirm(`Are you sure you want to delete Ticket #${ticket.id}: ${ticket.title}? This cannot be undone.`)) {
             onDelete(ticket.id);
        }
    }


    return (
        <div className={`p-6 bg-white rounded-xl shadow-lg border-l-8 transition-all hover:shadow-xl hover:scale-[1.01] duration-200`} style={{ borderColor: status.accent }}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-900">Ticket ID: <span className="font-mono">{ticket.id}</span></h3>
                <StatusTag />
            </div>
            
            <h4 className="text-xl font-bold text-gray-800 mb-2">{ticket.title}</h4>
            <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
            
            <div className="mt-4 text-sm flex justify-between items-center border-t pt-3">
                <p>
                    <strong className="text-gray-700">Priority:</strong> <span className={`${priorityColor} font-bold`}>{ticket.priority}</span>
                </p>
                <small className="text-gray-500">Created: {ticket.createdAt}</small>
            </div>
            
            <div className="mt-4 flex space-x-2 justify-end">
                <button 
                    onClick={() => onEdit(ticket)} 
                    className="px-3 py-2 text-sm font-medium rounded-lg text-amber-600 border border-amber-300 bg-amber-50 hover:bg-amber-100 transition shadow-sm"
                >
                    Edit Details
                </button>
                <button 
                    onClick={handleDeleteClick} 
                    className="px-3 py-2 text-sm font-medium rounded-lg text-red-600 border border-red-300 bg-red-50 hover:bg-red-100 transition shadow-sm"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};


// --- Main TicketManager Component ---

export default function TicketManager() {
    const [state, dispatch] = useReducer(ticketReducer, initialTicketState);
    const navigate = useNavigate();

    // State for non-modal toast notifications
    const [toastMessage, setToastMessage] = useState<ToastProps | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage({ message, type });
        setTimeout(() => setToastMessage(null), 3000); // Clear after 3 seconds
    };

    const [form, setForm] = useState<Omit<Ticket, "id" | "createdAt">>({
        title: "",
        description: "",
        priority: "Low",
        status: "Open",
    });

    const [editId, setEditId] = useState<number | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        // Type assertion for dynamically setting form state
        setForm({ ...form, [e.target.name]: e.target.value as Ticket['priority'] | Ticket['status'] | string });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setForm({ title: "", description: "", priority: "Low", status: "Open" });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) {
            showToast("The ticket title cannot be empty.", 'error'); 
            return;
        }

        if (editId) {
            dispatch({
                type: "UPDATE_TICKET",
                payload: { ...form, id: editId, createdAt: new Date().toLocaleString() },
            });
            showToast(`Ticket #${editId} updated successfully!`, 'success');
            handleCancelEdit(); 
        } else {
            const newTicket: Ticket = {
                id: Date.now(),
                ...form,
                createdAt: new Date().toLocaleString(),
            };
            dispatch({ type: "ADD_TICKET", payload: newTicket });
            showToast(`New ticket created successfully!`, 'success'); 
            setForm({ title: "", description: "", priority: "Low", status: "Open" }); 
        }
    };

    const handleEdit = (ticket: Ticket) => {
        setEditId(ticket.id);
        setForm({
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            status: ticket.status,
        });
    };

    const handleDelete = (id: number) => {
        dispatch({ type: "DELETE_TICKET", payload: id });
        showToast(`Ticket #${id} was deleted.`, 'error'); 
        
        if (editId === id) {
            handleCancelEdit();
        }
    };


    const submitButtonText = editId ? "Update Ticket" : "Save New Ticket";
    const formTitle = editId ? `Edit Ticket #${editId}` : "Create New Ticket";

    // Reusing the main layout structure (Header + centered main content)
    return (
        <div className="min-h-screen bg-gray-50">
            {toastMessage && <ToastNotification message={toastMessage.message} type={toastMessage.type} />}
            
            <Header onBack={() => navigate("/dashboard")} />

            <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Ticket Management (CRUD)</h1>
                
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    
                    {/* Left Column: Create/Edit Form (4/12 width on desktop) */}
                    <div className="lg:col-span-4 mb-8 lg:mb-0">
                        <div className="sticky top-4 p-6 bg-white rounded-xl shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">{formTitle}</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                
                                {/* Title Input */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        placeholder="Ticket Title (e.g., Bug, Feature Request, Task)"
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-blue-500"
                                        value={form.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                
                                {/* Description Textarea */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        placeholder="Detailed description of the issue or request"
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-blue-500"
                                        value={form.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                {/* Priority Dropdown */}
                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                                    <select 
                                        id="priority"
                                        name="priority" 
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-blue-500"
                                        value={form.priority} 
                                        onChange={handleChange}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                {/* Status Dropdown */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                    <select 
                                        id="status"
                                        name="status" 
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:ring-blue-500"
                                        value={form.status} 
                                        onChange={handleChange}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3 pt-4">
                                    <button 
                                        type="submit"
                                        className="flex-1 px-4 py-2 font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-md"
                                    >
                                        {submitButtonText}
                                    </button>
                                    {editId && (
                                        <button 
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="flex-1 px-4 py-2 font-semibold rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition shadow-md"
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    {/* Right Column: Ticket List (8/12 width on desktop) */}
                    <div className="lg:col-span-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Tickets ({state.tickets.length})</h2>
                        
                        <div className="space-y-4">
                            {state.tickets.length === 0 ? (
                                <div className="p-6 bg-white rounded-xl shadow-lg text-center text-gray-500 border-2 border-dashed border-gray-300">
                                    <p className="text-lg font-medium mb-1">Queue Empty</p>
                                    No tickets have been created yet. Use the form on the left to get started!
                                </div>
                            ) : (
                                state.tickets.map((ticket) => (
                                    <TicketCard
                                        key={ticket.id}
                                        ticket={ticket}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
