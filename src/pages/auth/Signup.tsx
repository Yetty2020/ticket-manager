
import { useReducer, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for the Login link
import type { FormErrors, signUpForm } from "../../types/auth";



const initialState: signUpForm = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    errors: {},
};

type Action =
    | { type: "SET_FIELD"; field: keyof signUpForm; value: string }
    | { type: "SET_ERRORS"; errors: FormErrors }
    | { type: "SET_SUBMITTING"; submitting: boolean }
    | { type: "RESET" };

function reducer(
    state: { values: signUpForm; errors: FormErrors; submitting: boolean },
    action: Action
) {
    switch (action.type) {
        case "SET_FIELD":
            return {
                ...state,
                values: {
                    ...state.values,
                    [action.field]: action.value,
                },
            };
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.errors,
            };
        case "SET_SUBMITTING":
            return {
                ...state,
                submitting: action.submitting,
            };
        case "RESET":
            return { values: initialState, errors: {}, submitting: false };
        default:
            return state;
    }
}

// --- Signup Component with Tailwind Styling ---

export default function Signup() {
    const [state, dispatch] = useReducer(reducer, {
        values: initialState,
        errors: {},
        submitting: false,
    });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newErrors: signUpForm["errors"] = {};

        // --- Validation Logic ---
        if (!state.values.fullName.trim()) newErrors.fullName = "Name is required.";

        if (!state.values.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
            newErrors.email = "Please enter a valid email address.";

        if (state.values.password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";

        if (state.values.password !== state.values.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";
        // --- End Validation Logic ---

        if (Object.keys(newErrors).length > 0) {
            dispatch({ type: "SET_ERRORS", errors: newErrors });
            setIsLoading(false);
            return;
        }

        // 🔍 Step 1: Get existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

        // 🔍 Step 2: Check if email already exists
        const userExists = existingUsers.some(
            (user: signUpForm) => user.email === state.values.email
        );

        if (userExists) {
            dispatch({
                type: "SET_ERRORS",
                errors: { email: "A user with this email already exists. Please log in instead." },
            });
            setIsLoading(false);
            return;
        }

        // ✅ Step 3: Save new user to localStorage
        const newUser = {
            fullName: state.values.fullName,
            email: state.values.email,
            password: state.values.password,
        }; // Save only necessary fields
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));

        dispatch({ type: "RESET" });
        setIsLoading(false);
        alert("Signup successful! Redirecting to login...");

        // ✅ Step 4: Redirect to login page
        navigate("/auth/Login");
    };

    /* ---------- helper for inputs and errors ---------- */
    const handleChange = (field: keyof signUpForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatch({ type: "SET_FIELD", field, value: e.target.value });
    
    // Helper function for input styling based on error presence
    const getInputClasses = (error: string | undefined) =>
        `mt-1 block w-full rounded-md border p-3 shadow-sm transition ${
            error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
        } disabled:bg-gray-100 disabled:cursor-not-allowed`;

    // Extract the general error, which is often used for non-field specific issues like "user exists"
    const generalError = state.errors.email && !Object.keys(state.errors).filter(k => k !== 'email').length ? state.errors.email : undefined;


    return (
        // Centered Layout Container
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
                
                {/* Header */}
                <div className="text-center">
                    <div className="text-3xl font-extrabold text-blue-600">🎫 TICKETFLEX</div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Create Your Account
                    </h2>
                </div>

                {/* General Error Message (Top of Form, for 'User already exists' or general issues) */}
                {generalError && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center" role="alert">
                        {generalError}
                    </div>
                )}


                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4 rounded-md shadow-sm">
                        
                        {/* Full Name Input */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder=""
                                required
                                className={getInputClasses(state.errors.fullName)}
                                value={state.values.fullName}
                                onChange={handleChange("fullName")}
                                disabled={isLoading}
                            />
                            {/* Inline Error Message */}
                            {state.errors.fullName && (
                                <p className="mt-1 text-sm text-red-600" role="alert">
                                    {state.errors.fullName}
                                </p>
                            )}
                        </div>
                        
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder=""
                                required
                                className={getInputClasses(state.errors.email)}
                                value={state.values.email}
                                onChange={handleChange("email")}
                                disabled={isLoading}
                            />
                            {/* Inline Error Message (only if it's not the general 'user exists' error shown above) */}
                            {state.errors.email && !generalError && (
                                <p className="mt-1 text-sm text-red-600" role="alert">
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
                                placeholder="Min 6 characters"
                                required
                                className={getInputClasses(state.errors.password)}
                                value={state.values.password}
                                onChange={handleChange("password")}
                                disabled={isLoading}
                            />
                            {/* Inline Error Message */}
                            {state.errors.password && (
                                <p className="mt-1 text-sm text-red-600" role="alert">
                                    {state.errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className={getInputClasses(state.errors.confirmPassword)}
                                value={state.values.confirmPassword}
                                onChange={handleChange("confirmPassword")}
                                disabled={isLoading}
                            />
                            {/* Inline Error Message */}
                            {state.errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600" role="alert">
                                    {state.errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                            aria-busy={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </div>

                    {/* Link to Login */}
                    <div className="text-sm text-center">
                        <p className="font-medium text-gray-600">
                            Already have an account?{' '}
                            <Link to="/auth/Login" className="text-blue-600 hover:text-blue-500 font-semibold transition">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}