import Link from 'next/link';
import { ChevronRightIcon } from '@/components/v1-ui/icons';
import { AppChrome } from '@/components/v1-ui/shell';
import { Card, KPIStat, ListItem } from '@/components/v1-ui/primitives';
import type {
  MyHomeViewModel,
  MyMatch,
  MyMatchesViewModel,
  MyMenuItem,
  MyTeam,
  MyTeamDetailViewModel,
  MyTeamMembersViewModel,
  MyTeamsViewModel,
  NotificationSettingsViewModel,
  ProfileEditViewModel,
  SettingsViewModel,
} from './my.types';

export function MyHomePageView({ model }: { model: MyHomeViewModel }) {
  return (
    <AppChrome title="마이" activeTab="my" hasNewNotification>
      <div className="tm-my-shell">
        <section className="tm-my-profile-head">
          <div className="tm-my-avatar">{model.user.initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tm-text-heading">{model.user.name}</div>
            <div className="tm-text-caption" style={{ marginTop: 4 }}>{model.user.handle} · {model.user.region}</div>
            <div className="tm-my-chip-row">{model.user.sports.map((sport) => <span key={sport} className="tm-badge tm-badge-grey">{sport}</span>)}</div>
          </div>
          <Link className="tm-btn tm-btn-sm tm-btn-neutral" href="/my/profile/edit">수정</Link>
        </section>
        <div className="tm-my-stat-grid">{model.user.stats.map((stat) => <Card key={stat.label} pad={14}><KPIStat {...stat} /></Card>)}</div>
        <Card pad={16}>
          <div className="tm-text-body-lg">이번 달 활동</div>
          <div className="tm-my-monthly">{model.user.monthly.map((stat) => <KPIStat key={stat.label} {...stat} />)}</div>
        </Card>
        {model.sections.map((section) => <MenuSection key={section.title} section={section} />)}
      </div>
    </AppChrome>
  );
}

export function MyMatchesPageView({ model }: { model: MyMatchesViewModel }) {
  return (
    <AppChrome title={model.title} activeTab="my" bottomNav={false}>
      <div className="tm-my-shell">
        <div className="tm-my-stat-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          {model.summary.map((stat) => <Card key={stat.label} pad={12}><KPIStat {...stat} /></Card>)}
        </div>
        <div className="tm-my-list-stack">
          {model.matches.map((match) => <MyMatchCard key={match.id} match={match} manage={model.mode === 'created'} />)}
        </div>
      </div>
    </AppChrome>
  );
}

export function MyTeamsPageView({ model }: { model: MyTeamsViewModel }) {
  return (
    <AppChrome title="내 팀" activeTab="my" bottomNav={false}>
      <div className="tm-my-shell">
        <div className="tm-my-stat-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          {model.summary.map((stat) => <Card key={stat.label} pad={12}><KPIStat {...stat} /></Card>)}
        </div>
        <div className="tm-my-list-stack">
          {model.teams.map((team) => <MyTeamCard key={team.id} team={team} />)}
        </div>
      </div>
    </AppChrome>
  );
}

export function MyTeamDetailPageView({ model }: { model: MyTeamDetailViewModel }) {
  return (
    <AppChrome title="팀 관리" activeTab="my" bottomNav={false}>
      <div className="tm-my-shell">
        <section className="tm-my-team-hero">
          <div className="tm-team-logo tm-team-logo-large">{model.team.logo}</div>
          <div>
            <h1 className="tm-text-heading">{model.team.name}</h1>
            <div className="tm-text-caption" style={{ marginTop: 4 }}>{model.team.sport} · {model.team.region} · {model.team.roleLabel}</div>
          </div>
          <p className="tm-text-body" style={{ margin: 0, lineHeight: 1.55 }}>{model.team.description}</p>
        </section>
        <Card pad={16}>
          <InfoRow label="멤버" value={`${model.team.members}명`} />
          <InfoRow label="매너" value={model.team.manner} />
          <InfoRow label="다음 일정" value={model.team.next} />
        </Card>
        <MenuSection section={{ title: '운영 메뉴', items: model.actions }} />
        <div className="tm-my-section-label">최근 팀 매치</div>
        <div className="tm-my-list-stack">{model.recentMatches.map((match) => <MyMatchCard key={match.id} match={match} manage />)}</div>
      </div>
      <div className="tm-fixed-cta"><Link className="tm-btn tm-btn-lg tm-btn-primary tm-btn-block" href="/chat/room-1">팀 채팅 열기</Link></div>
    </AppChrome>
  );
}

export function MyTeamMembersPageView({ model }: { model: MyTeamMembersViewModel }) {
  return (
    <AppChrome title="멤버 관리" activeTab="my" bottomNav={false}>
      <div className="tm-my-shell">
        <h1 className="tm-text-heading">{model.teamName}</h1>
        <div className="tm-my-stat-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          {model.summary.map((stat) => <Card key={stat.label} pad={12}><KPIStat {...stat} /></Card>)}
        </div>
        <MemberGroup title="멤버" members={model.members} />
        <MemberGroup title="가입 요청" members={model.requests} review />
      </div>
    </AppChrome>
  );
}

export function ProfileEditPageView({ model }: { model: ProfileEditViewModel }) {
  return (
    <AppChrome title="프로필 수정" activeTab="my" bottomNav={false}>
      <div className="tm-create-shell">
        <section className="tm-my-profile-head">
          <div className="tm-my-avatar">{model.user.initials}</div>
          <div>
            <div className="tm-text-body-lg">프로필 사진</div>
            <div className="tm-text-caption" style={{ marginTop: 4 }}>목록과 신청 화면에 함께 표시됩니다.</div>
          </div>
        </section>
        {model.fields.map((field) => <CreateField key={field.label} {...field} />)}
      </div>
      <div className="tm-fixed-cta"><button className="tm-btn tm-btn-lg tm-btn-primary tm-btn-block" type="button">저장하기</button></div>
    </AppChrome>
  );
}

export function SettingsPageView({ model }: { model: SettingsViewModel }) {
  return (
    <AppChrome title={model.title} activeTab="my" bottomNav={false}>
      <div className="tm-my-shell">
        {model.groups.map((section) => <MenuSection key={section.title} section={section} />)}
        <button className="tm-btn tm-btn-lg tm-btn-neutral tm-btn-block" type="button">로그아웃</button>
      </div>
    </AppChrome>
  );
}

export function NotificationSettingsPageView({ model }: { model: NotificationSettingsViewModel }) {
  return (
    <AppChrome title="알림 설정" activeTab="my" bottomNav={false}>
      <div className="tm-my-shell">
        {model.settings.map((setting) => (
          <Card key={setting.label} pad={16}>
            <div className="tm-my-toggle-row">
              <div>
                <div className="tm-text-body-lg">{setting.label}</div>
                <div className="tm-text-caption" style={{ marginTop: 4 }}>{setting.sub}</div>
              </div>
              <span className={`tm-toggle ${setting.enabled ? 'tm-toggle-on' : ''}`} aria-hidden="true" />
            </div>
          </Card>
        ))}
      </div>
    </AppChrome>
  );
}

export function LegalPageView({ model }: { model: SettingsViewModel }) {
  return (
    <AppChrome title="약관 및 정책" activeTab="my" bottomNav={false}>
      <div className="tm-my-shell">
        <Card pad={16}>
          <ListItem title="이용약관" sub="서비스 이용에 필요한 기본 약관" trailing="2026.05" chev />
          <ListItem title="개인정보 처리방침" sub="개인정보 수집과 보관 기준" trailing="2026.05" chev />
          <ListItem title="위치기반 서비스 약관" sub="장소 추천과 거리 계산 기준" trailing="선택" chev />
        </Card>
        <MenuSection section={model.groups[0]} />
      </div>
    </AppChrome>
  );
}

export function WithdrawalPageView() {
  return (
    <AppChrome title="회원 탈퇴" activeTab="my" bottomNav={false}>
      <div className="tm-my-shell">
        <section className="tm-danger-panel">
          <div className="tm-text-heading">탈퇴 전 확인해 주세요</div>
          <p className="tm-text-body" style={{ margin: '10px 0 0', lineHeight: 1.6 }}>진행 중인 매치, 팀 운영 권한, 정산 내역이 남아 있으면 탈퇴가 제한될 수 있습니다.</p>
        </section>
        <Card pad={16}>
          <ListItem title="참여 예정 매치" sub="2건이 남아 있어요" trailing="정리 필요" />
          <ListItem title="팀장 권한" sub="FC 발빠른놈들" trailing="위임 필요" />
          <ListItem title="보관 데이터" sub="법적 보관 기간 이후 삭제됩니다" trailing="필수" />
        </Card>
      </div>
      <div className="tm-fixed-cta"><button className="tm-btn tm-btn-lg tm-btn-danger tm-btn-block" type="button">탈퇴 요청하기</button></div>
    </AppChrome>
  );
}

function MenuSection({ section }: { section: { title: string; items: MyMenuItem[] } }) {
  return (
    <section>
      <div className="tm-my-section-label">{section.title}</div>
      <Card pad={0}>
        {section.items.map((item) => (
          <Link key={item.label} className="tm-my-menu-row" href={item.href}>
            <span className="tm-my-menu-icon">{item.icon}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="tm-text-body" style={{ color: 'var(--text-strong)', display: 'block' }}>{item.label}</span>
              <span className="tm-text-caption" style={{ marginTop: 2, display: 'block' }}>{item.sub}</span>
            </span>
            <ChevronRightIcon size={17} stroke="var(--text-caption)" strokeWidth={2} />
          </Link>
        ))}
      </Card>
    </section>
  );
}

function MyMatchCard({ match, manage }: { match: MyMatch; manage?: boolean }) {
  return (
    <Card pad={16}>
      <div className="tm-my-card-head">
        <div>
          <div className="tm-text-body-lg">{match.title}</div>
          <div className="tm-text-caption" style={{ marginTop: 4 }}>{match.meta}</div>
        </div>
        <span className={`tm-badge ${match.status === 'pending' ? 'tm-badge-orange' : match.status === 'ended' ? 'tm-badge-grey' : 'tm-badge-blue'}`}>{match.statusLabel}</span>
      </div>
      <p className="tm-text-caption" style={{ margin: '10px 0 0', lineHeight: 1.5 }}>{match.note}</p>
      <div className="tm-my-card-actions">
        <Link className="tm-btn tm-btn-sm tm-btn-neutral" href={match.href}>상세</Link>
        {manage ? <button className="tm-btn tm-btn-sm tm-btn-primary" type="button">관리</button> : <button className="tm-btn tm-btn-sm tm-btn-neutral" type="button">리뷰</button>}
      </div>
    </Card>
  );
}

function MyTeamCard({ team }: { team: MyTeam }) {
  return (
    <Link className="tm-my-team-card tm-pressable" href={`/my/teams/${team.id}`}>
      <div className="tm-team-logo">{team.logo}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="tm-my-card-head">
          <div className="tm-text-body-lg">{team.name}</div>
          <span className="tm-badge tm-badge-blue">{team.roleLabel}</span>
        </div>
        <div className="tm-text-caption" style={{ marginTop: 4 }}>{team.sport} · {team.region} · {team.members}명</div>
        <div className="tm-text-caption" style={{ marginTop: 8 }}>{team.next}</div>
      </div>
      <ChevronRightIcon size={17} stroke="var(--text-caption)" strokeWidth={2} />
    </Link>
  );
}

function MemberGroup({ title, members, review }: { title: string; members: Array<{ name: string; role: string; meta: string; status: string }>; review?: boolean }) {
  return (
    <section>
      <div className="tm-my-section-label">{title}</div>
      <div className="tm-my-list-stack">
        {members.map((member) => (
          <Card key={member.name} pad={14}>
            <div className="tm-my-card-head">
              <ListItem title={member.name} sub={`${member.role} · ${member.meta}`} trailing={member.status} />
              {review ? <button className="tm-btn tm-btn-sm tm-btn-primary" type="button">승인</button> : null}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return <div className="tm-info-row"><div className="tm-text-caption">{label}</div><div className="tm-text-label" style={{ textAlign: 'right', flex: 1 }}>{value}</div></div>;
}

function CreateField({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return <div className="tm-create-field"><div className="tm-text-label">{label}</div><div className={`tm-create-input ${multiline ? 'tm-create-input-multiline' : ''}`}><span className="tm-text-body" style={{ color: 'var(--text-strong)' }}>{value}</span></div></div>;
}
