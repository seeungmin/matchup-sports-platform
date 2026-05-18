'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Bell, Home, Search, ShieldCheck, Trophy, Users, UserRound, Swords } from 'lucide-react';

const tabs = [
  { href: '/home', label: '홈', icon: Home },
  { href: '/matches', label: '매치', icon: Trophy },
  { href: '/team-matches', label: '팀매치', icon: Swords },
  { href: '/teams', label: '팀', icon: Users },
  { href: '/my', label: '마이', icon: UserRound },
];

const titleByPath = [
  { path: '/team-matches', title: '팀매치', eyebrow: '상대 팀 찾기' },
  { path: '/matches', title: '개인 매치', eyebrow: '함께 뛸 사람 찾기' },
  { path: '/teams', title: '팀 둘러보기', eyebrow: '가입 승인형 팀' },
  { path: '/my', title: '마이', eyebrow: '활동과 신뢰 상태' },
  { path: '/home', title: 'teameet', eyebrow: '1차 디자인 완료' },
];

function getHeader(pathname: string) {
  return titleByPath.find((item) => pathname.startsWith(item.path)) ?? titleByPath[4];
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const header = getHeader(pathname);

  return (
    <div className="v1-root">
      <div className="v1-frame">
        <header className="v1-header">
          <div className="v1-brand">
            <p className="v1-eyebrow">{header.eyebrow}</p>
            <h1 className="v1-title">{header.title}</h1>
          </div>
          <div className="v1-header-actions" aria-label="공통 동작">
            <Link className="v1-icon-button" href="/home" aria-label="검색">
              <Search size={21} />
            </Link>
            <Link className="v1-icon-button" href="/notifications" aria-label="알림">
              <Bell size={21} />
              <span className="v1-unread-dot" />
            </Link>
          </div>
        </header>
        {children}
        <nav className="v1-bottom-nav" aria-label="주요 메뉴">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active =
              tab.href === '/home' ? pathname === '/home' || pathname === '/' : pathname.startsWith(tab.href);

            return (
              <Link key={tab.href} href={tab.href} className={active ? 'v1-tab v1-tab-active' : 'v1-tab'}>
                {tab.href === '/my' ? <ShieldCheck size={22} /> : <Icon size={22} />}
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
