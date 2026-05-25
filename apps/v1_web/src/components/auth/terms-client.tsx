'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from '@/components/v1-ui/icons';
import { saveSignupTermsAccepted } from '@/lib/signup-terms-storage';
import { AuthFrame } from './auth-page';
import { getTermsViewModel } from './auth.view-model';

export function TermsClient() {
  const model = getTermsViewModel();
  const router = useRouter();
  const [checkedByTitle, setCheckedByTitle] = useState(() =>
    Object.fromEntries(model.agreements.map((agreement) => [agreement.title, false])),
  );
  const [openByTitle, setOpenByTitle] = useState<Record<string, boolean>>({});
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'allowed' | 'denied' | 'unsupported'>('idle');
  const [locationLabel, setLocationLabel] = useState<string | null>(null);

  const requiredAccepted = useMemo(
    () => model.agreements.every((agreement) => !agreement.required || checkedByTitle[agreement.title]),
    [checkedByTitle, model.agreements],
  );
  const requiredChecked = model.agreements.filter((agreement) => agreement.required).every((agreement) => checkedByTitle[agreement.title]);

  const setRequired = (checked: boolean) => {
    setCheckedByTitle((current) => ({
      ...current,
      ...Object.fromEntries(model.agreements.filter((agreement) => agreement.required).map((agreement) => [agreement.title, checked])),
    }));
  };

  const requestLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationStatus('unsupported');
      setLocationLabel(null);
      return;
    }

    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('allowed');
        setLocationLabel(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      },
      () => {
        setLocationStatus('denied');
        setLocationLabel(null);
      },
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 8000 },
    );
  };

  const toggleAgreement = (title: string, nextChecked: boolean, locationBased?: boolean) => {
    setCheckedByTitle((current) => ({ ...current, [title]: nextChecked }));

    if (locationBased && nextChecked) {
      requestLocation();
      setOpenByTitle((current) => ({ ...current, [title]: true }));
    }
  };

  const continueToSignup = () => {
    if (!requiredAccepted) {
      return;
    }

    saveSignupTermsAccepted(true);
    router.push('/signup');
  };

  return (
    <AuthFrame
      topTitle="약관 동의"
      backHref={model.backHref}
      fixedAction={
        <button className="tm-btn tm-btn-lg tm-btn-primary tm-btn-block" disabled={!requiredAccepted} onClick={continueToSignup} type="button">
          {requiredAccepted ? model.primary.label : '필수 약관 동의 후 가능'}
        </button>
      }
    >
      <div className="tm-auth-body">
        <h1 className="tm-text-heading tm-auth-heading">{model.title}</h1>
        <p className="tm-text-body tm-auth-sub">{model.sub}</p>
        <button className="tm-card tm-auth-agree-all tm-auth-agree-button tm-pressable" onClick={() => setRequired(!requiredChecked)} type="button">
          <TermsCheck checked={requiredChecked} />
          <span className="tm-text-body-lg">필수 약관 전체 동의</span>
        </button>
        <div className="tm-auth-stack">
          {model.agreements.map((item) => {
            const checked = checkedByTitle[item.title];
            const open = openByTitle[item.title] ?? false;

            return (
              <div key={item.title} className="tm-card tm-auth-agreement-card">
                <div className="tm-auth-agreement">
                  <button
                    aria-pressed={checked}
                    className="tm-auth-check-button tm-pressable"
                    onClick={() => toggleAgreement(item.title, !checked, item.locationBased)}
                    type="button"
                  >
                    <TermsCheck checked={checked} />
                  </button>
                  <button
                    className="tm-auth-agreement-main tm-pressable"
                    onClick={() => toggleAgreement(item.title, !checked, item.locationBased)}
                    type="button"
                  >
                    <span className="tm-text-body-lg">{item.title}</span>
                    <span className="tm-text-caption">{item.meta}</span>
                  </button>
                  <button
                    aria-expanded={open}
                    aria-label={`${item.title} 내용 보기`}
                    className="tm-auth-agreement-arrow tm-pressable"
                    onClick={() => setOpenByTitle((current) => ({ ...current, [item.title]: !open }))}
                    type="button"
                  >
                    <ChevronRightIcon size={16} strokeWidth={2} />
                  </button>
                </div>
                {open ? (
                  <div className="tm-auth-agreement-detail">
                    <div className="tm-text-caption">{item.detail}</div>
                    {item.locationBased ? <LocationConsentStatus status={locationStatus} label={locationLabel} checked={checked} /> : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </AuthFrame>
  );
}

function TermsCheck({ checked }: { checked: boolean }) {
  return <span className={`tm-auth-check ${checked ? 'tm-auth-check-on' : ''}`}>✓</span>;
}

function LocationConsentStatus({ status, label, checked }: { status: 'idle' | 'requesting' | 'allowed' | 'denied' | 'unsupported'; label: string | null; checked: boolean }) {
  if (!checked) {
    return null;
  }

  const text =
    status === 'requesting'
      ? '현재 위치 권한을 확인하는 중입니다.'
      : status === 'allowed'
        ? `위치 확인 완료${label ? ` · ${label}` : ''}`
        : status === 'denied'
          ? '위치 권한이 거부되었습니다. 지역 직접 선택으로 계속 이용할 수 있습니다.'
          : status === 'unsupported'
            ? '이 브라우저에서는 위치 확인을 지원하지 않습니다.'
            : '위치 기반 추천을 사용할 준비가 되었습니다.';

  return <div className={`tm-auth-location-status tm-auth-location-status-${status} tm-text-caption`}>{text}</div>;
}
