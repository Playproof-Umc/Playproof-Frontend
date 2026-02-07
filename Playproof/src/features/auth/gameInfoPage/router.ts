// src/features/auth/gameInfoPage/router.ts

export type AuthRedirectState = {
  from?: {
    pathname: string;
  };
};

export type SignupCompleteState = {
  signupCompleted?: boolean;
  signupUsername?: string;
};

export type AppLocationState = AuthRedirectState & SignupCompleteState;