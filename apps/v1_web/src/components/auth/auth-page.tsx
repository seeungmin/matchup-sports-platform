import Link from 'next/link';
import type { ReactNode } from 'react';
import { Card } from '@/components/v1-ui/primitives';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/v1-ui/icons';
import type { AuthAction, LoginViewModel, OnboardingOption, OnboardingViewModel, SignupViewModel, TermsViewModel } from './auth.types';

export function LoginPageView({ model }: { model: LoginViewModel }) {
  return (
    <AuthFrame>
      <div className="tm-auth-login">
        <div>
          <div className="tm-auth-logo">T</div>
          <h1 className="tm-text-heading tm-auth-title">{model.heroTitle}</h1>
          <p className="tm-text-body tm-auth-sub">{model.heroSub}</p>
          <Link className="tm-btn tm-btn-lg tm-btn-neutral tm-btn-block" href={model.emailHref}>이메일로 로그인</Link>
          <p className="tm-text-caption tm-auth-helper">기존 계정이 있으면 이메일 로그인 후 종목, 레벨, 지역 확인으로 이어집니다.</p>
        </div>
        <div>
          <Link className="tm-btn tm-btn-lg tm-btn-primary tm-btn-block" href={model.guestHref}>로그인 없이 시작하기</Link>
          <p className="tm-text-body tm-auth-center">
            아직 계정이 없나요? <Link href={model.signupHref}>회원가입</Link>
          </p>
          <AuthDivider />
          <div className="tm-auth-provider-row">
            {model.providers.map((provider) => (
              <button
                key={provider.label}
                className="tm-btn tm-btn-md tm-pressable"
                disabled={provider.disabled}
                style={{ background: provider.background, color: provider.color }}
                type="button"
              >
                {provider.label}
              </button>
            ))}
          </div>
          <p className="tm-text-caption tm-auth-policy">소셜 로그인은 API 연결 전 준비 상태입니다. 계속하면 서비스 약관과 개인정보 처리방침을 확인합니다.</p>
        </div>
      </div>
    </AuthFrame>
  );
}

export function TermsPageView({ model }: { model: TermsViewModel }) {
  return (
    <AuthFrame topTitle="약관 동의" backHref={model.backHref} fixedAction={<AuthActionButton action={model.primary} />}>
      <div className="tm-auth-body">
        <span className="tm-badge tm-badge-blue">회원가입 전 필수</span>
        <h1 className="tm-text-heading tm-auth-heading">{model.title}</h1>
        <p className="tm-text-body tm-auth-sub">{model.sub}</p>
        <Card pad={16} className="tm-auth-agree-all">
          <CheckMark checked />
          <span className="tm-text-body-lg">필수 약관 전체 동의</span>
        </Card>
        <div className="tm-auth-stack">
          {model.agreements.map((item) => (
            <Link key={item.title} className="tm-card tm-auth-agreement tm-pressable" href="/terms">
              <CheckMark checked={item.checked} />
              <div>
                <div className="tm-text-body-lg">{item.title}</div>
                <div className="tm-text-caption">{item.meta}</div>
              </div>
              <ChevronRightIcon size={16} strokeWidth={2} />
            </Link>
          ))}
        </div>
      </div>
    </AuthFrame>
  );
}

export function SignupPageView({ model }: { model: SignupViewModel }) {
  return (
    <AuthFrame fixedAction={<SignupActions primary={model.primary} secondary={model.secondary} />}>
      <div className="tm-auth-complete">
        <div className="tm-auth-complete-icon"><CheckMark checked /></div>
        <h1 className="tm-text-heading tm-auth-heading">{model.title}</h1>
        <p className="tm-text-body tm-auth-sub">{model.sub}</p>
        <div className="tm-auth-stack">
          {model.steps.map((step) => (
            <Card key={step.title} pad={15} className="tm-auth-step-card">
              <CheckMark checked={step.done} />
              <div>
                <div className="tm-text-body-lg">{step.title}</div>
                <div className="tm-text-caption">{step.body}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AuthFrame>
  );
}

export function OnboardingPageView({ model }: { model: OnboardingViewModel }) {
  return (
    <AuthFrame
      topTitle={model.step === 'resume' ? '이어하기' : '운동 설정'}
      backHref={model.backHref}
      skipHref={model.skipHref}
      fixedAction={<OnboardingActions primary={model.primary} secondary={model.secondary} />}
    >
      <div className="tm-auth-body">
        <ProgressHeader stepNo={model.stepNo} total={model.totalSteps} />
        <h1 className="tm-text-heading tm-auth-heading">{model.title}</h1>
        <p className="tm-text-body tm-auth-sub">{model.sub}</p>
        {model.step === 'sport' ? <SportGrid options={model.options} /> : null}
        {model.step === 'level' ? <LevelList options={model.options} /> : null}
        {model.step === 'region' ? <RegionList options={model.options} /> : null}
        {model.step === 'resume' ? <ResumeList options={model.options} /> : null}
        {model.summary ? <SummaryList items={model.summary} /> : null}
        {model.notice ? <NoticeCard {...model.notice} /> : null}
      </div>
    </AuthFrame>
  );
}

function AuthFrame({ children, topTitle, backHref, skipHref, fixedAction }: { children: ReactNode; topTitle?: string; backHref?: string; skipHref?: string; fixedAction?: ReactNode }) {
  return (
    <div className="tm-auth-frame">
      {topTitle || backHref || skipHref ? (
        <header className="tm-auth-topbar">
          <div className="tm-auth-topbar-left">
            {backHref ? (
              <Link className="tm-btn tm-btn-icon tm-btn-ghost" href={backHref} aria-label="뒤로가기">
                <ChevronLeftIcon size={22} strokeWidth={2.2} />
              </Link>
            ) : null}
            {topTitle ? <div className="tm-text-body-lg">{topTitle}</div> : null}
          </div>
          {skipHref ? <Link className="tm-btn tm-btn-sm tm-btn-ghost" href={skipHref}>건너뛰기</Link> : null}
        </header>
      ) : null}
      <main className={`tm-auth-scroll ${fixedAction ? 'tm-auth-scroll-with-cta' : ''} ${topTitle || backHref || skipHref ? '' : 'tm-auth-scroll-full'}`}>
        {children}
      </main>
      {fixedAction ? <div className="tm-auth-fixed-cta">{fixedAction}</div> : null}
    </div>
  );
}

function AuthActionButton({ action }: { action: AuthAction }) {
  const className = `tm-btn tm-btn-lg ${action.disabled ? 'tm-btn-neutral' : action.tone === 'danger' ? 'tm-btn-danger' : action.tone === 'neutral' ? 'tm-btn-neutral' : 'tm-btn-primary'} tm-btn-block`;
  return action.href && !action.disabled ? <Link className={className} href={action.href}>{action.label}</Link> : <button className={className} type="button" disabled={action.disabled}>{action.label}</button>;
}

function SignupActions({ primary, secondary }: { primary: AuthAction; secondary: AuthAction }) {
  return (
    <>
      <AuthActionButton action={primary} />
      <div style={{ height: 8 }} />
      <AuthActionButton action={secondary} />
    </>
  );
}

function OnboardingActions({ primary, secondary }: { primary: AuthAction; secondary?: AuthAction }) {
  return (
    <>
      <AuthActionButton action={primary} />
      {secondary ? <><div style={{ height: 8 }} /><AuthActionButton action={secondary} /></> : null}
    </>
  );
}

function AuthDivider() {
  return <div className="tm-auth-divider"><span /><em className="tm-text-caption">또는</em><span /></div>;
}

function CheckMark({ checked }: { checked?: boolean }) {
  return <span className={`tm-auth-check ${checked ? 'tm-auth-check-on' : ''}`}>✓</span>;
}

function ProgressHeader({ stepNo, total }: { stepNo: number; total: number }) {
  return (
    <div className="tm-auth-progress">
      <span className="tm-text-micro">{stepNo > 0 ? `STEP ${stepNo} / ${total}` : 'RESUME'}</span>
      <div className="tm-auth-progress-bars">
        {Array.from({ length: total }).map((_, index) => <span key={index} data-active={stepNo > 0 && index < stepNo} />)}
      </div>
    </div>
  );
}

function SportGrid({ options }: { options: OnboardingOption[] }) {
  return <div className="tm-auth-sport-grid">{options.map((option) => <OptionCard key={option.label} option={option} />)}</div>;
}

function LevelList({ options }: { options: OnboardingOption[] }) {
  return <div className="tm-auth-stack">{options.map((option) => <OptionRow key={option.label} option={option} trailing="A B C D" />)}</div>;
}

function RegionList({ options }: { options: OnboardingOption[] }) {
  return (
    <>
      <button className="tm-btn tm-btn-md tm-btn-neutral tm-btn-block" type="button">현재 위치로 찾기</button>
      <div className="tm-auth-chip-wrap">{options.map((option) => <span key={option.label} className={`tm-chip ${option.selected ? 'tm-chip-active' : ''}`}>{option.label}</span>)}</div>
    </>
  );
}

function ResumeList({ options }: { options: OnboardingOption[] }) {
  return <div className="tm-auth-stack">{options.map((option) => <OptionRow key={option.label} option={option} />)}</div>;
}

function SummaryList({ items }: { items: Array<{ label: string; value: string }> }) {
  return <div className="tm-auth-stack">{items.map((item) => <Card key={item.label} pad={15}><div className="tm-text-label">{item.label}</div><div className="tm-text-caption" style={{ marginTop: 4 }}>{item.value}</div></Card>)}</div>;
}

function OptionCard({ option }: { option: OnboardingOption }) {
  return <Card pad={16} className={`tm-auth-option-card ${option.selected ? 'tm-auth-option-selected' : ''}`}><div className="tm-text-body-lg">{option.label}</div>{option.meta ? <div className="tm-text-caption">{option.meta}</div> : null}</Card>;
}

function OptionRow({ option, trailing }: { option: OnboardingOption; trailing?: string }) {
  return <Card pad={15} className="tm-auth-option-row"><CheckMark checked={option.selected} /><div><div className="tm-text-body-lg">{option.label}</div>{option.meta ? <div className="tm-text-caption">{option.meta}</div> : null}</div>{trailing ? <span className="tm-text-caption tab-num">{trailing}</span> : null}</Card>;
}

function NoticeCard({ title, body, tone = 'blue' }: { title: string; body: string; tone?: 'blue' | 'orange' | 'green' }) {
  return <Card pad={14} className={`tm-auth-notice tm-auth-notice-${tone}`}><div className="tm-text-label">{title}</div><div className="tm-text-caption">{body}</div></Card>;
}
