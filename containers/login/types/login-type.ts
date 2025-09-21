export interface LoginFormData {
  email: string;
  password: string;
  otp?: string;
}

export interface LoginState {
  showPassword: boolean;
  showOtp: boolean;
  isLoading: boolean;
  error: string;
}

export interface DemoCredentials {
  admin: {
    email: string;
    password: string;
  };
  user: {
    email: string;
    password: string;
  };
  otp: string;
}

export interface LoginPageProps {
  onLoginSuccess?: () => void;
}
