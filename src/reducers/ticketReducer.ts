// Define what a Ticket looks like
export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
}

export interface TicketState {
  tickets: Ticket[];
}

export type TicketAction =
  | { type: "ADD_TICKET"; payload: Ticket }
  | { type: "UPDATE_TICKET"; payload: Ticket }
  | { type: "DELETE_TICKET"; payload: number };

export const initialTicketState: TicketState = {
  tickets: JSON.parse(localStorage.getItem("tickets") || "[]"),
};

export function ticketReducer(
  state: TicketState,
  action: TicketAction
): TicketState {
  switch (action.type) {
    case "ADD_TICKET": {
      const newTickets = [...state.tickets, action.payload];
      localStorage.setItem("tickets", JSON.stringify(newTickets));
      return { tickets: newTickets };
    }

    case "UPDATE_TICKET": {
      const updated = state.tickets.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
      localStorage.setItem("tickets", JSON.stringify(updated));
      return { tickets: updated };
    }

    case "DELETE_TICKET": {
      const filtered = state.tickets.filter((t) => t.id !== action.payload);
      localStorage.setItem("tickets", JSON.stringify(filtered));
      return { tickets: filtered };
    }

    default:
      return state;
  }
}
