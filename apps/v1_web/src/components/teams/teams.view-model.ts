import type { TeamDetailViewModel, TeamFormViewModel, TeamListViewModel, TeamMembersViewModel } from './teams.types';

const teams = [
  {
    id: 'team-1',
    name: '성수 러너스 FC',
    logo: '성',
    sport: '풋살',
    region: '서울 성동',
    members: 18,
    status: 'open' as const,
    statusLabel: '모집중',
    tags: ['초중급', '주 1회', '친선'],
    fit: 94,
    manner: 4.9,
    trust: 'verified' as const,
    next: '오늘 21:00 정기전',
  },
  {
    id: 'team-2',
    name: '강동 위클리 풋살',
    logo: '강',
    sport: '풋살',
    region: '서울 강동',
    members: 22,
    status: 'reviewing' as const,
    statusLabel: '검토중',
    tags: ['중급', '평일 저녁', '리그 준비'],
    fit: 88,
    manner: 4.7,
    trust: 'estimated' as const,
    next: '가입 신청 검토 중',
  },
  {
    id: 'team-3',
    name: '마포 선데이 FC',
    logo: '마',
    sport: '축구',
    region: '서울 마포',
    members: 26,
    status: 'closed' as const,
    statusLabel: '마감',
    tags: ['11:11', '주말', 'A등급'],
    fit: 76,
    manner: 4.6,
    trust: 'sample' as const,
    next: '다음 모집 알림 가능',
  },
];

export function getTeamListViewModel(): TeamListViewModel {
  return {
    query: '풋살 강동',
    chips: ['전체 42', '모집중 18', '내 주변', '초중급', '주 1회'].map((label, index) => ({ label, active: index === 0 })),
    summary: { recruiting: 18, matched: 7 },
    teams,
  };
}

export function getTeamDetailViewModel(mode: TeamDetailViewModel['mode'] = 'default'): TeamDetailViewModel {
  return {
    mode,
    team: {
      ...teams[0],
      description: '성수와 광진권에서 풋살 정기전을 운영하는 팀입니다. 신규 멤버는 2주 체험 후 정식 가입으로 전환합니다.',
      activity: '주 1회 정기전 · 신규 멤버 3명 모집',
      condition: '풋살 초중급 · 성동/광진권 활동 가능',
      trustNote: 'verified · 최근 경기 12회 · 신고 0건',
      schedule: '매주 화 21:00 · 성수 풋살파크',
      membersList: [
        { name: '김도윤', role: '팀장', meta: 'FW · 매너 4.9', status: '관리자' },
        { name: '박서준', role: '운영진', meta: 'GK · 매너 4.8', status: '관리자' },
        { name: '이하늘', role: '멤버', meta: 'MF · 최근 4경기', status: '활동중' },
      ],
    },
  };
}

export function getTeamFormViewModel(mode: TeamFormViewModel['mode']): TeamFormViewModel {
  return {
    mode,
    team: {
      name: mode === 'edit' ? '성수 러너스 FC' : '새 풋살 팀',
      sport: '풋살',
      region: '서울 성동구',
      description: '주 1회 꾸준히 함께 경기할 멤버를 찾습니다.',
      level: '초중급',
      activity: '평일 저녁 · 주 1회',
      capacity: 24,
    },
  };
}

export function getTeamMembersViewModel(): TeamMembersViewModel {
  return {
    teamName: '성수 러너스 FC',
    summary: { total: 18, managers: 2, pending: 3 },
    members: [
      { name: '김도윤', role: '팀장', meta: 'FW · 가입 2024.03', status: '관리자' },
      { name: '박서준', role: '운영진', meta: 'GK · 가입 2024.05', status: '관리자' },
      { name: '이하늘', role: '멤버', meta: 'MF · 최근 4경기', status: '활동중' },
      { name: '정민호', role: '가입 신청', meta: '초중급 · 성동', status: '검토중' },
    ],
  };
}
