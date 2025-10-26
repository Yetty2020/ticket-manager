export  interface signUpForm  {
    email: string;
    fullName: string;
    password: string;
    confirmPassword: string; 
    errors: {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
}

export interface FormErrors   {
    email?: string;
    fullName?: string;
    password?: string;
    confirmPassword?: string;
}

export interface LoginForm {
    email: string;
    password: string;
    
}

export interface LoginFormErrors {
    email?: string;
    password?: string;
    general?: string;   
}