'use client';

import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useV1AuthMe } from '@/hooks/use-v1-api';

type SessionEntryGateProps = {
  mode: 'root' | 'login';
  children?: ReactNode;
};

const V1_USER_ID_KEY = 'teameet.v1.userId';
const V1_USER_EMAIL_KEY = 'teameet.v1.userEmail';

export function SessionEntryGate({ mode, children }: SessionEntryGateProps) {
  const router = useRouter();
  const [hasSessionHint, setHasSessionHint] = useState<boolean | null>(null);
  const authMe = useV1AuthMe({ enabled: hasSessionHint === true, retry: false });

  useEffect(() => {
    setHasSessionHint(hasStoredV1Session());
  }, []);

  useEffect(() => {
    if (hasSessionHint === null) return;

    if (!hasSessionHint) {
      if (mode === 'root') router.replace('/login');
      return;
    }

    if (authMe.isSuccess) {
      router.replace('/home');
      return;
    }

    if (authMe.isError) {
      clearStoredV1Session();
      if (mode === 'root') router.replace('/login');
    }
  }, [authMe.isError, authMe.isSuccess, hasSessionHint, mode, router]);

  if (mode === 'login' && (hasSessionHint === false || authMe.isError)) {
    return <>{children}</>;
  }

  return <SessionFallback />;
}

function hasStoredV1Session() {
  return Boolean(window.localStorage.getItem(V1_USER_ID_KEY) || window.localStorage.getItem(V1_USER_EMAIL_KEY));
}

function clearStoredV1Session() {
  window.localStorage.removeItem(V1_USER_ID_KEY);
  window.localStorage.removeItem(V1_USER_EMAIL_KEY);
}

function SessionFallback() {
  return (
    <main className="tm-auth-frame">
      <div className="tm-auth-scroll tm-auth-scroll-full">
        <div className="tm-auth-login">
          <div>
            <div className="tm-auth-logo">T</div>
            <h1 className="tm-text-heading tm-auth-title">Teameet</h1>
            <p className="tm-text-body tm-auth-sub">Checking your session.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
