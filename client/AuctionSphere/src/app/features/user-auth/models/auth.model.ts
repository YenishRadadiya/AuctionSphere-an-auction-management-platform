export interface SignupFormData {
    username: string;
    email: string;
    password: string;
}

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface ForgotPasswordFormData {
    email: string;
}

export interface ResetPasswordFormData {
    token: string,
    newPassword: string;
}