import Link from 'next/link';
import { AppChrome } from '@/components/v1-ui/shell';
import { Card, EmptyState, KPIStat, ListItem } from '@/components/v1-ui/primitives';
import { SearchIcon } from '@/components/v1-ui/icons';
import type { TeamDetailViewModel, TeamFormViewModel, TeamListViewModel, TeamMembersViewModel, TeamModel } from './teams.types';

export function TeamListPageView({ model }: { model: TeamListViewModel }) {
  return (
    <AppChrome title="팀" activeTab="teams" hasNewNotification>
      <div className="tm-team-list">
        <div className="tm-team-searchbar">
          <div className="tm-team-search-input"><SearchIcon size={18} /><span>{model.query}</span></div>
          <button className="tm-btn tm-btn-icon tm-btn-ghost" type="button" aria-label="팀 목록 필터">☰</button>
        </div>
        <div className="tm-sport-chip-row">{model.chips.map((chip) => <button key={chip.label} className={`tm-chip ${chip.active ? 'tm-chip-active' : ''}`} type="button">{chip.label}</button>)}</div>
        <div className="tm-team-stat-grid">
          <Card pad={14}><KPIStat label="모집중" value={model.summary.recruiting} unit="팀" /></Card>
          <Card pad={14}><KPIStat label="내 프로필 매칭" value={model.summary.matched} unit="팀" /></Card>
        </div>
        <div className="tm-team-card-stack">{model.teams.map((team, index) => <TeamCard key={team.id} team={team} selected={index === 0} />)}</div>
      </div>
      <Link className="tm-floating-fab" href="/teams/new" aria-label="팀 만들기">+</Link>
    </AppChrome>
  );
}

export function TeamDetailPageView({ model }: { model: TeamDetailViewModel }) {
  const { team, mode } = model;
  const locked = mode === 'pending' || mode === 'closed';
  const cta = mode === 'mine' ? '팀 관리' : mode === 'pending' ? '신청 상태 보기' : mode === 'closed' ? '모집 알림 받기' : '가입 가능 여부 확인';
  return (
    <AppChrome title="" activeTab="teams" bottomNav={false} topBar={false}>
      <article className="tm-team-detail">
        <section className="tm-team-hero">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link className="tm-btn tm-btn-icon tm-btn-ghost tm-hero-button" href="/teams" aria-label="뒤로가기">‹</Link>
            <Link className="tm-btn tm-btn-sm tm-btn-neutral" href="/teams/team-1/members">멤버</Link>
          </div>
          <TeamLogo team={team} large />
          <h1 className="tm-text-heading" style={{ color: 'var(--static-white)', marginTop: 14 }}>{team.name}</h1>
          <div className="tm-text-caption" style={{ color: 'rgba(255,255,255,.72)', marginTop: 4 }}>{team.sport} · {team.region} · 매너 {team.manner}</div>
        </section>
        <div className="tm-team-detail-body">
          <p className="tm-text-body" style={{ lineHeight: 1.6 }}>{team.description}</p>
          <Card pad={16} style={{ marginTop: 16 }}>
            <InfoRow label="활동 방식" value={team.activity} />
            <InfoRow label="신뢰 신호" value={team.trustNote} />
            <InfoRow label="가입 조건" value={team.condition} />
            <InfoRow label="정기 일정" value={team.schedule} />
          </Card>
          <Card pad={16} style={{ marginTop: 12 }}><div className="tm-text-body-lg">주요 멤버</div><div style={{ display: 'grid', gap: 8, marginTop: 12 }}>{team.membersList.map((member) => <ListItem key={member.name} title={member.name} sub={`${member.role} · ${member.meta}`} trailing={member.status} />)}</div></Card>
        </div>
      </article>
      <div className="tm-fixed-cta"><div className="tm-text-caption" style={{ marginBottom: 8 }}>{locked ? '상태를 확인한 뒤 다음 행동을 선택합니다.' : '신청 전 팀 정보와 내 프로필 공개 범위를 확인합니다.'}</div><button className={`tm-btn tm-btn-lg ${locked ? 'tm-btn-neutral' : 'tm-btn-primary'} tm-btn-block`} type="button">{cta}</button></div>
    </AppChrome>
  );
}

export function TeamFormPageView({ model }: { model: TeamFormViewModel }) {
  const edit = model.mode === 'edit';
  const team = model.team;
  return (
    <AppChrome title={edit ? '팀 수정' : '팀 만들기'} activeTab="teams" bottomNav={false}>
      <div className="tm-create-shell">
        <h1 className="tm-text-heading">{edit ? '팀 정보를 수정해요' : '새 팀을 만들어요'}</h1>
        <p className="tm-text-body" style={{ marginTop: 8 }}>목록과 상세에 바로 연결될 수 있도록 저장 가능한 필드만 노출합니다.</p>
        <CreateField label="팀 이름" value={team.name} />
        <div className="tm-create-two-col"><CreateField label="종목" value={team.sport} /><CreateField label="지역" value={team.region} /></div>
        <CreateField label="팀 소개" value={team.description} multiline />
        <div className="tm-create-two-col"><CreateField label="레벨" value={team.level} /><CreateField label="정원" value={`${team.capacity}`} suffix="명" /></div>
        <CreateField label="활동 방식" value={team.activity} />
        <Card pad={14} style={{ marginTop: 14, background: edit ? 'var(--orange50)' : 'var(--blue50)' }}><div className="tm-text-label">{edit ? '변경사항 저장' : '생성 후 상태'}</div><div className="tm-text-caption" style={{ marginTop: 5 }}>{edit ? '팀장 또는 운영진 권한 확인 후 저장됩니다.' : '생성 직후 팀장은 관리자 권한을 갖고 멤버 초대를 시작합니다.'}</div></Card>
      </div>
      <div className="tm-fixed-cta"><div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}><Link className="tm-btn tm-btn-lg tm-btn-neutral" href={edit ? '/teams/team-1' : '/teams'}>{edit ? '취소' : '이전'}</Link><button className="tm-btn tm-btn-lg tm-btn-primary" type="button">{edit ? '저장하기' : '팀 만들기'}</button></div></div>
    </AppChrome>
  );
}

export function TeamMembersPageView({ model }: { model: TeamMembersViewModel }) {
  return (
    <AppChrome title="멤버 관리" activeTab="teams" bottomNav={false}>
      <div className="tm-team-list">
        <h1 className="tm-text-heading">{model.teamName}</h1>
        <div className="tm-team-stat-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <Card pad={12}><KPIStat label="전체" value={model.summary.total} unit="명" /></Card>
          <Card pad={12}><KPIStat label="관리자" value={model.summary.managers} unit="명" /></Card>
          <Card pad={12}><KPIStat label="검토" value={model.summary.pending} unit="명" /></Card>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>{model.members.map((member) => <Card key={member.name} pad={14}><ListItem title={member.name} sub={`${member.role} · ${member.meta}`} trailing={member.status} /></Card>)}</div>
      </div>
    </AppChrome>
  );
}

function TeamCard({ team, selected }: { team: TeamModel; selected?: boolean }) {
  return (
    <Link className={`tm-team-card tm-pressable ${selected ? 'tm-team-card-selected' : ''}`} href={`/teams/${team.id}`}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <TeamLogo team={team} />
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div className="tm-text-body-lg line-clamp-2">{team.name}</div><span className={`tm-badge ${team.status === 'closed' ? 'tm-badge-grey' : team.status === 'reviewing' ? 'tm-badge-orange' : 'tm-badge-blue'}`}>{team.statusLabel}</span></div><div className="tm-text-caption" style={{ marginTop: 4 }}>{team.sport} · {team.region} · {team.members}명</div><div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>{team.tags.map((tag) => <span key={tag} className="tm-badge tm-badge-grey">{tag}</span>)}</div></div>
      </div>
      <div className="tm-team-inline-stats"><InlineStat label="추천 적합도" value={`${team.fit}%`} /><InlineStat label="매너" value={team.manner} /><InlineStat label="신뢰" value={team.trust} /></div>
      <div className="tm-team-card-footer"><span className="tm-text-caption">{team.next}</span><span className={`tm-btn tm-btn-sm ${team.status === 'closed' ? 'tm-btn-neutral' : 'tm-btn-primary'}`}>{team.status === 'closed' ? '알림받기' : '팀 보기'}</span></div>
    </Link>
  );
}

function TeamLogo({ team, large }: { team: Pick<TeamModel, 'logo'>; large?: boolean }) {
  return <div className={`tm-team-logo ${large ? 'tm-team-logo-large' : ''}`}>{team.logo}</div>;
}

function InlineStat({ label, value }: { label: string; value: string | number }) {
  return <div><div className="tm-text-micro">{label}</div><div className="tm-text-label tab-num" style={{ marginTop: 3 }}>{value}</div></div>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="tm-info-row"><div className="tm-text-caption">{label}</div><div className="tm-text-label" style={{ textAlign: 'right', flex: 1 }}>{value}</div></div>;
}

function CreateField({ label, value, suffix, multiline }: { label: string; value: string; suffix?: string; multiline?: boolean }) {
  return <div className="tm-create-field"><div className="tm-text-label">{label}</div><div className={`tm-create-input ${multiline ? 'tm-create-input-multiline' : ''}`}><span className="tm-text-body" style={{ color: 'var(--text-strong)' }}>{value}</span>{suffix ? <span className="tm-text-caption">{suffix}</span> : null}</div></div>;
}
