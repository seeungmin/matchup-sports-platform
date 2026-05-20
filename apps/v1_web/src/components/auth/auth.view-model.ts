import type { LoginViewModel, OnboardingStep, OnboardingViewModel, SignupViewModel, TermsViewModel } from './auth.types';

export function getLoginViewModel(): LoginViewModel {
  return {
    heroTitle: '같이 뛸 사람을\n한 번에 찾아요',
    heroSub: 'Teameet에 오신 걸 환영합니다',
    emailHref: '/signup',
    guestHref: '/home',
    signupHref: '/terms',
    providers: [
      { label: '카카오', background: '#FEE500', color: 'var(--static-black)', disabled: true },
      { label: '네이버', background: 'var(--green500)', color: 'var(--static-white)', disabled: true },
      { label: 'Apple', background: 'var(--static-black)', color: 'var(--static-white)', disabled: true },
    ],
  };
}

export function getTermsViewModel(): TermsViewModel {
  return {
    backHref: '/login',
    title: '가입 전에 약관을 먼저 확인합니다',
    sub: '필수 약관을 모두 동의해야 회원가입 입력 화면으로 이동할 수 있습니다.',
    agreements: [
      { title: '서비스 이용약관', meta: '필수 · 최신 버전 2026.05', required: true, checked: true },
      { title: '개인정보 처리방침', meta: '필수 · 인증/매치 참여에 필요', required: true, checked: true },
      { title: '위치 기반 서비스', meta: '선택 · 나중에 설정 가능', required: false, checked: false },
      { title: '마케팅 알림', meta: '선택 · 설정에서 변경 가능', required: false, checked: false },
    ],
    primary: { label: '동의하고 회원가입하기', href: '/signup' },
  };
}

export function getSignupViewModel(): SignupViewModel {
  return {
    title: '회원가입이 완료됐어요',
    sub: '이제 운동 설정을 하면 더 정확한 매치 추천을 받을 수 있습니다.',
    steps: [
      { title: '약관 동의 완료', body: '필수 약관 동의가 저장되었습니다.', done: true },
      { title: '회원가입 완료', body: '계정 생성이 완료되었습니다. 뒤로가도 계정은 유지됩니다.', done: true },
    ],
    primary: { label: '운동 설정 시작하기', href: '/onboarding/sport' },
    secondary: { label: '나중에 설정하기', href: '/home', tone: 'neutral' },
  };
}

export function getOnboardingViewModel(step: OnboardingStep): OnboardingViewModel {
  const models: Record<OnboardingStep, OnboardingViewModel> = {
    resume: {
      step,
      stepNo: 0,
      totalSteps: 3,
      title: '운동 설정을 이어갈까요?',
      sub: '이전에 선택한 종목과 실력은 유지됩니다. 완료하지 않은 지역 선택부터 다시 시작할 수 있습니다.',
      options: [
        { label: '관심 종목', meta: '축구 · 풋살 · 배드민턴', selected: true },
        { label: '실력 입력', meta: '축구 B · 풋살 C · 배드민턴 B', selected: true },
        { label: '활동 지역', meta: '아직 선택 전', selected: false },
      ],
      notice: { title: '입력값 보존', body: '중단 복귀 시 완료된 단계는 체크하고, 진행 단계만 다시 요청합니다.', tone: 'blue' },
      primary: { label: '지역 선택부터 이어가기', href: '/onboarding/region' },
      secondary: { label: '처음부터 다시 선택', href: '/onboarding/sport', tone: 'neutral' },
    },
    sport: {
      step,
      stepNo: 1,
      totalSteps: 3,
      title: '관심 종목을 선택해 주세요',
      sub: '선택한 종목을 기준으로 다음 실력 입력 단계가 구성됩니다.',
      backHref: '/signup',
      skipHref: '/home',
      options: ['축구', '풋살', '하키', '배드민턴', '농구', '테니스'].map((label, index) => ({
        label,
        meta: index < 4 ? '선택됨' : '선택 가능',
        selected: index < 4,
      })),
      primary: { label: '실력 입력하기', href: '/onboarding/level' },
    },
    level: {
      step,
      stepNo: 2,
      totalSteps: 3,
      title: '종목별 실력을 입력해 주세요',
      sub: '무리 없는 매칭을 위해 종목마다 현재 실력을 선택합니다.',
      backHref: '/onboarding/sport',
      options: [
        { label: '축구', meta: 'B 레벨 선택됨', selected: true },
        { label: '풋살', meta: 'C 레벨 선택됨', selected: true },
        { label: '하키', meta: 'D 레벨 선택됨', selected: true },
        { label: '배드민턴', meta: 'B 레벨 선택됨', selected: true },
      ],
      primary: { label: '지역 선택하기', href: '/onboarding/region' },
    },
    region: {
      step,
      stepNo: 3,
      totalSteps: 3,
      title: '주 활동 지역을 선택해 주세요',
      sub: '현재 위치는 선택 사항이며, 거부해도 수동 지역 선택으로 계속할 수 있습니다.',
      backHref: '/onboarding/level',
      options: ['마포구', '강남구', '성동구', '송파구', '서초구', '용산구'].map((label, index) => ({
        label,
        selected: index < 2,
      })),
      notice: { title: '위치 권한 예외', body: '권한 거부 시 선택한 종목과 실력은 유지하고 수동 지역 선택으로 복구합니다.', tone: 'orange' },
      primary: { label: '선택 확인하기', href: '/onboarding/confirm' },
    },
    confirm: {
      step,
      stepNo: 3,
      totalSteps: 3,
      title: '준비가 끝났어요',
      sub: '선택한 종목, 실력, 지역을 기준으로 홈 추천과 필터가 시작됩니다.',
      backHref: '/onboarding/region',
      options: [],
      summary: [
        { label: '관심 종목', value: '축구 · 풋살 · 하키 · 배드민턴' },
        { label: '실력', value: '축구 B · 풋살 C · 하키 D · 배드민턴 B' },
        { label: '활동 지역', value: '마포구 · 강남구' },
      ],
      notice: { title: '완료 상태', body: '홈 진입 후에도 설정에서 종목, 실력, 지역을 수정할 수 있습니다.', tone: 'green' },
      primary: { label: '홈으로 시작하기', href: '/home' },
    },
  };

  return models[step];
}
