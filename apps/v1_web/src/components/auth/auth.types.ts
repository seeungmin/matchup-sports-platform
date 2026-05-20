export type AuthRoute = 'login' | 'terms' | 'signup';

export type AuthAction = {
  label: string;
  href?: string;
  disabled?: boolean;
  tone?: 'primary' | 'neutral' | 'danger';
};

export type LoginProvider = {
  label: string;
  background: string;
  color: string;
  disabled?: boolean;
};

export type LoginViewModel = {
  heroTitle: string;
  heroSub: string;
  emailHref: string;
  guestHref: string;
  signupHref: string;
  providers: LoginProvider[];
};

export type TermsViewModel = {
  backHref: string;
  title: string;
  sub: string;
  agreements: Array<{ title: string; meta: string; required: boolean; checked: boolean }>;
  primary: AuthAction;
};

export type SignupViewModel = {
  title: string;
  sub: string;
  steps: Array<{ title: string; body: string; done: boolean }>;
  primary: AuthAction;
  secondary: AuthAction;
};

export type OnboardingStep = 'resume' | 'sport' | 'level' | 'region' | 'confirm';

export type OnboardingOption = {
  label: string;
  meta?: string;
  selected?: boolean;
  disabled?: boolean;
};

export type OnboardingViewModel = {
  step: OnboardingStep;
  stepNo: number;
  totalSteps: number;
  title: string;
  sub: string;
  backHref?: string;
  skipHref?: string;
  options: OnboardingOption[];
  summary?: Array<{ label: string; value: string }>;
  notice?: { title: string; body: string; tone?: 'blue' | 'orange' | 'green' };
  primary: AuthAction;
  secondary?: AuthAction;
};
