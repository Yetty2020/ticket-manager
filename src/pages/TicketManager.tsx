// import { useReducer, useState, type ChangeEvent, type FormEvent } from "react";
// import { ticketReducer, initialTicketState, type Ticket } from "../reducers/ticketReducer";
// import { useNavigate } from "react-router-dom";

// export default function TicketManager() {
//   const [state, dispatch] = useReducer(ticketReducer, initialTicketState);
//   const navigate = useNavigate();

//   const [form, setForm] = useState<Omit<Ticket, "id" | "createdAt">>({
//     title: "",
//     description: "",
//     priority: "Low",
//     status: "Open",
//   });

//   const [editId, setEditId] = useState<number | null>(null);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();

//     if (!form.title || !form.description) {
//       alert("Please fill all fields");
//       return;
//     }

//     if (editId) {
//       dispatch({
//         type: "UPDATE_TICKET",
//         payload: { ...form, id: editId, createdAt: new Date().toLocaleString() },
//       });
//       setEditId(null);
//     } else {
//       const newTicket: Ticket = {
//         id: Date.now(),
//         ...form,
//         createdAt: new Date().toLocaleString(),
//       };
//       dispatch({ type: "ADD_TICKET", payload: newTicket });
//     }

//     setForm({ title: "", description: "", priority: "Low", status: "Open" });
//   };

//   const handleEdit = (ticket: Ticket) => {
//     setEditId(ticket.id);
//     setForm({
//       title: ticket.title,
//       description: ticket.description,
//       priority: ticket.priority,
//       status: ticket.status,
//     });
//   };

//   const handleDelete = (id: number) => {
//     if (window.confirm("Delete this ticket?")) {
//       dispatch({ type: "DELETE_TICKET", payload: id });
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>🎫 Ticket Manager</h2>
//       <button onClick={() => navigate("/dashboard")}>
//           Back to Dashboard
//         </button>
     

//       <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
//         <input
//           type="text"
//           name="title"
//           placeholder="Title"
//           value={form.title}
//           onChange={handleChange}
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//         ></textarea>

//         <select name="priority" value={form.priority} onChange={handleChange}>
//           <option>Low</option>
//           <option>Medium</option>
//           <option>High</option>
//         </select>

//         <select name="status" value={form.status} onChange={handleChange}>
//           <option>Open</option>
//           <option>In Progress</option>
//           <option>Closed</option>
//         </select>

//         <button type="submit">
//           {editId ? "Update Ticket" : "Add Ticket"}
//         </button>
//       </form>

//       <div>
//         {state.tickets.length === 0 ? (
//           <p>No tickets yet.</p>
//         ) : (
//           state.tickets.map((ticket) => (
//             <div
//               key={ticket.id}
//               style={{
//                 border: "1px solid #ccc",
//                 padding: "10px",
//                 marginBottom: "10px",
//               }}
//             >
//               <h3>{ticket.title}</h3>
//               <p>{ticket.description}</p>
//               <p>
//                 <strong>Priority:</strong> {ticket.priority}
//               </p>
//               <p>
//                 <strong>Status:</strong> {ticket.status}
//               </p>
//               <p>
//                 <small>Created at: {ticket.createdAt}</small>
//               </p>

//               <button onClick={() => handleEdit(ticket)}>Edit</button>
//               <button onClick={() => handleDelete(ticket.id)}>Delete</button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

import { useReducer, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link for navigation
import { ticketReducer, initialTicketState, type Ticket } from "../reducers/ticketReducer";

// --- UI Utilities (Reused for Consistency) ---

const STATUS_COLORS = {
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
    High: 'text-red-500',
    Medium: 'text-yellow-500',
    Low: 'text-green-500'
};

// Custom Header Component (Simplified for TicketManager route)
const Header = ({ onBack }) => (
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
const TicketCard = ({ ticket, onEdit, onDelete }) => {
    const status = STATUS_COLORS[ticket.status] || STATUS_COLORS.Closed;
    const priorityColor = STATUS_COLORS[ticket.priority] || STATUS_COLORS.Low;

    const StatusTag = () => (
        <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${status.bg} ${status.text}`}>
            {ticket.status}
        </span>
    );

    return (
        <div className={`p-6 bg-white rounded-xl shadow-lg border-l-4 border-r-4 border-opacity-70 transition-all hover:shadow-xl`} style={{ borderColor: status.accent }}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">Ticket #{ticket.id}</h3>
                <StatusTag />
            </div>
            
            <h4 className="text-xl font-semibold text-gray-800">{ticket.title}</h4>
            <p className="mt-2 text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
            
            <div className="mt-3 text-sm flex justify-between items-center">
                <p>
                    <strong className="text-gray-700">Priority:</strong> <span className={`${priorityColor} font-semibold`}>{ticket.priority}</span>
                </p>
                <small className="text-gray-500">Created: {ticket.createdAt}</small>
            </div>
            
            <div className="mt-4 flex space-x-2 justify-end">
                <button 
                    onClick={() => onEdit(ticket)} 
                    className="px-3 py-1 text-sm rounded-lg text-amber-600 border border-amber-200 hover:bg-amber-50 transition"
                >
                    Edit
                </button>
                <button 
                    onClick={() => onDelete(ticket.id)} 
                    className="px-3 py-1 text-sm rounded-lg text-red-600 border border-red-200 hover:bg-red-50 transition"
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

    const [form, setForm] = useState<Omit<Ticket, "id" | "createdAt">>({
        title: "",
        description: "",
        priority: "Low",
        status: "Open",
    });

    const [editId, setEditId] = useState<number | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCancelEdit = () => {
        setEditId(null);
        setForm({ title: "", description: "", priority: "Low", status: "Open" });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) {
            alert("Please provide a title.");
            return;
        }

        if (editId) {
            dispatch({
                type: "UPDATE_TICKET",
                payload: { ...form, id: editId, createdAt: new Date().toLocaleString() },
            });
            // Show toast notification for update success
            alert(`Ticket #${editId} updated successfully!`);
            handleCancelEdit(); // Clear form after update
        } else {
            const newTicket: Ticket = {
                id: Date.now(),
                ...form,
                createdAt: new Date().toLocaleString(),
            };
            dispatch({ type: "ADD_TICKET", payload: newTicket });
            // Show toast notification for creation success
            alert(`Ticket created successfully!`);
            setForm({ title: "", description: "", priority: "Low", status: "Open" }); // Clear form
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
        if (window.confirm("Are you sure you want to delete this ticket? This cannot be undone.")) {
            dispatch({ type: "DELETE_TICKET", payload: id });
            // Show toast notification for deletion success
            alert(`Ticket #${id} deleted.`);
            if (editId === id) {
                handleCancelEdit();
            }
        }
    };


    const submitButtonText = editId ? "Update Ticket" : "Save New Ticket";
    const formTitle = editId ? `Edit Ticket #${editId}` : "Create New Ticket";

    // Reusing the main layout structure (Header + centered main content)
    return (
        <div className="min-h-screen bg-gray-50">
            <Header onBack={() => navigate("/dashboard")} />

            <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Ticket Management (CRUD)</h1>
                
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    
                    {/* Left Column: Create/Edit Form (4/12 width on desktop) */}
                    <div className="lg:col-span-4 mb-8 lg:mb-0">
                        <div className="p-6 bg-white rounded-xl shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">{formTitle}</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                
                                {/* Title Input */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        placeholder="Ticket Title"
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
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
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
                                        <option>Open</option>
                                        <option>In Progress</option>
                                        <option>Closed</option>
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Tickets</h2>
                        
                        <div className="space-y-4">
                            {state.tickets.length === 0 ? (
                                <div className="p-6 bg-white rounded-xl shadow-lg text-center text-gray-500">
                                    No tickets have been created yet. Start by adding one!
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