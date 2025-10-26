// import React, { useReducer, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import type { LoginForm, LoginFormErrors } from "../../types/auth";



// const initialValues: LoginForm = {
//   email: "",
//   password: "",
// };

// const initialErrors: LoginFormErrors = {};


// type Action =
//   | { type: "SET_FIELD"; field: keyof LoginForm; value: string }
//   | { type: "SET_ERRORS"; errors: LoginFormErrors }
//   | { type: "SET_SUBMITTING"; submitting: boolean }
//   | { type: "RESET" };


// function reducer(
//   state: { values: LoginForm; errors: LoginFormErrors; submitting: boolean },
//   action: Action
// ) {
//   switch (action.type) {
//     case "SET_FIELD":
//       return {
//         ...state,
//         values: { ...state.values, [action.field]: action.value },
//       };

//     case "SET_ERRORS":
//       return { ...state, errors: action.errors };

//     case "SET_SUBMITTING":
//       return { ...state, submitting: action.submitting };

//     case "RESET":
//       return { values: initialValues, errors: {}, submitting: false };

//     default:
//       return state;
//   }
// }


// export default function Login(): JSX.Element {
//   const [state, dispatch] = useReducer(reducer, {
//     values: initialValues,
//     errors: initialErrors,
//     submitting: false,
//   });

//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   /* Helper: simple email regex */
//   const isValidEmail = (email: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // reset errors
//     dispatch({ type: "SET_ERRORS", errors: {} });

//     const values = state.values;
//     const errors: LoginFormErrors = {};

//     // basic validation
//     if (!values.email.trim()) {
//       errors.email = "Email is required.";
//     } else if (!isValidEmail(values.email)) {
//       errors.email = "Please enter a valid email address.";
//     }

//     if (!values.password) {
//       errors.password = "Password is required.";
//     }

//     if (Object.keys(errors).length > 0) {
//       dispatch({ type: "SET_ERRORS", errors });
//       return;
//     }

//     // start submitting
//     setIsLoading(true);
//     dispatch({ type: "SET_SUBMITTING", submitting: true });

//     // simulate a small delay for UX (and to show disabled button)
//     setTimeout(() => {
//       try {
//         // read saved signup data
//         const raw = localStorage.getItem("userData");
//         if (!raw) {
//           // no user was signed up yet
//           dispatch({
//             type: "SET_ERRORS",
//             errors: { general: "Email or password is incorrect." },
//           });
//           return;
//         }

//         let saved;
//         try {
//           saved = JSON.parse(raw) as { fullName?: string; email?: string; password?: string };
//         } catch {
//           saved = null;
//         }

//         if (!saved || saved.email !== values.email || saved.password !== values.password) {
//           // mismatch
//           dispatch({
//             type: "SET_ERRORS",
//             errors: { general: "Email or password is incorrect." },
//           });
//           return;
//         }

//         // success: set session token (simulated)
//         const session = { email: saved.email, token: "fake_token_" + Date.now() };
//         localStorage.setItem("ticketapp_session", JSON.stringify(session));

//         // clear form and redirect to dashboard
//         dispatch({ type: "RESET" });
//         navigate("/dashboard");
//       } finally {
//         setIsLoading(false);
//         dispatch({ type: "SET_SUBMITTING", submitting: false });
//       }
//     }, 700); // small UX delay
//   };

//   /* ---------- helper for inputs ---------- */
//   const handleChange = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
//     dispatch({ type: "SET_FIELD", field, value: e.target.value });

//   return (
//     <div >
    

//       {/* general error */}
      

//       <form onSubmit={handleSubmit} noValidate>
//         <label htmlFor="email">Email</label>
//         <input
//           id="email"
//           type="email"
//           value={state.values.email}
//           onChange={handleChange("email")}
//           aria-describedby={state.errors.email ? "error-email" : undefined}
//           required
//         />
//         {state.errors.email && (
//           <p id="error-email" className="error" role="alert">{state.errors.email}</p>
//         )}

//         <label htmlFor="password">Password</label>
//         <input
//           id="password"
//           type="password"
//           value={state.values.password}
//           onChange={handleChange("password")}
//           aria-describedby={state.errors.password ? "error-password" : undefined}
//           required
//         />
//         {state.errors.password && (
//           <p id="error-password" className="error" role="alert">{state.errors.password}</p>
//         )}

//         {state.errors.general && <p className="error" role="alert">{state.errors.general}</p>}

//         <button type="submit" disabled={isLoading || state.submitting} aria-busy={isLoading}>
//           {isLoading ? "Signing in…" : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }


import React, { useReducer, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for the Signup link
import type { LoginForm, LoginFormErrors } from "../../types/auth";

// --- State and Reducer logic (Unchanged from your provided code) ---

const initialValues: LoginForm = {
    email: "",
    password: "",
};

const initialErrors: LoginFormErrors = {};

type Action =
    | { type: "SET_FIELD"; field: keyof LoginForm; value: string }
    | { type: "SET_ERRORS"; errors: LoginFormErrors }
    | { type: "SET_SUBMITTING"; submitting: boolean }
    | { type: "RESET" };

function reducer(
    state: { values: LoginForm; errors: LoginFormErrors; submitting: boolean },
    action: Action
) {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                values: { ...state.values, [action.field]: action.value },
            };
        case "SET_ERRORS":
            return { ...state, errors: action.errors };
        case "SET_SUBMITTING":
            return { ...state, submitting: action.submitting };
        case "RESET":
            return { values: initialValues, errors: {}, submitting: false };
        default:
            return state;
    }
}

// --- Login Component with Tailwind Styling ---

export default function Login(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, {
        values: initialValues,
        errors: initialErrors,
        submitting: false,
    });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    /* Helper: simple email regex */
    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: "SET_ERRORS", errors: {} });

        const values = state.values;
        const errors: LoginFormErrors = {};

        // basic validation
        if (!values.email.trim()) {
            errors.email = "Email is required.";
        } else if (!isValidEmail(values.email)) {
            errors.email = "Please enter a valid email address.";
        }

        if (!values.password) {
            errors.password = "Password is required.";
        }

        if (Object.keys(errors).length > 0) {
            dispatch({ type: "SET_ERRORS", errors });
            return;
        }

        // start submitting
        setIsLoading(true);
        dispatch({ type: "SET_SUBMITTING", submitting: true });

        // simulate a small delay for UX (and to show disabled button)
        setTimeout(() => {
            try {
                // read saved signup data
                const raw = localStorage.getItem("userData");
                if (!raw) {
                    dispatch({
                        type: "SET_ERRORS",
                        errors: { general: "No user found. Please sign up." },
                    });
                    return;
                }

                let saved;
                try {
                    saved = JSON.parse(raw) as { fullName?: string; email?: string; password?: string };
                } catch {
                    saved = null;
                }

                if (!saved || saved.email !== values.email || saved.password !== values.password) {
                    dispatch({
                        type: "SET_ERRORS",
                        errors: { general: "Email or password is incorrect." },
                    });
                    return;
                }

                // success: set session token (simulated)
                const session = { email: saved.email, token: "fake_token_" + Date.now() };
                localStorage.setItem("ticketapp_session", JSON.stringify(session));

                // clear form and redirect to dashboard
                dispatch({ type: "RESET" });
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
                dispatch({ type: "SET_SUBMITTING", submitting: false });
            }
        }, 700); // small UX delay
    };

    /* ---------- helper for inputs ---------- */
    const handleChange = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: "SET_FIELD", field, value: e.target.value });

    // Helper function for input styling based on error presence
    const getInputClasses = (error: string | undefined) =>
        `mt-1 block w-full rounded-md border p-3 shadow-sm transition ${
            error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } disabled:bg-gray-100 disabled:cursor-not-allowed`;

    return (
        // Centered Layout Container
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
                
                {/* Header */}
                <div className="text-center">
                    <div className="text-3xl font-extrabold text-blue-600">🎫 TICKETFLEX</div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>

                {/* General Error Message (Top of Form) */}
                {state.errors.general && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center" role="alert">
                        {state.errors.general}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4 rounded-md shadow-sm">
                        
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className={getInputClasses(state.errors.email)}
                                value={state.values.email}
                                onChange={handleChange("email")}
                                aria-describedby={state.errors.email ? "error-email" : undefined}
                                disabled={isLoading || state.submitting}
                            />
                            {/* Inline Error Message */}
                            {state.errors.email && (
                                <p id="error-email" className="mt-1 text-sm text-red-600" role="alert">
                                    {state.errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={getInputClasses(state.errors.password)}
                                value={state.values.password}
                                onChange={handleChange("password")}
                                aria-describedby={state.errors.password ? "error-password" : undefined}
                                disabled={isLoading || state.submitting}
                            />
                            {/* Inline Error Message */}
                            {state.errors.password && (
                                <p id="error-password" className="mt-1 text-sm text-red-600" role="alert">
                                    {state.errors.password}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || state.submitting}
                            aria-busy={isLoading}
                        >
                            {isLoading || state.submitting ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>

                    {/* Link to Sign Up */}
                    <div className="text-sm text-center">
                        <p className="font-medium text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/auth/Signup" className="text-blue-600 hover:text-blue-500 font-semibold transition">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}