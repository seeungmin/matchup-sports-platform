export type MatchCard = {
  id: string;
  title: string;
  sport: string;
  level: string;
  place: string;
  schedule: string;
  capacity: string;
  status: 'open' | 'pending' | 'confirmed' | 'closed';
  tone: 'blue' | 'green' | 'orange' | 'red';
};

export type TeamCard = {
  id: string;
  name: string;
  sport: string;
  region: string;
  members: string;
  trust: string;
  joinStatus: 'approval_required' | 'closed';
};

export const personalMatches: MatchCard[] = [
  {
    id: 'match-1',
    title: '성수 저녁 풋살 5:5',
    sport: '풋살',
    level: '초급-중급',
    place: '성수 풋살파크',
    schedule: '오늘 20:00',
    capacity: '7/10명',
    status: 'open',
    tone: 'blue',
  },
  {
    id: 'match-2',
    title: '잠실 러닝 6km 페이스런',
    sport: '러닝',
    level: '입문',
    place: '잠실 한강공원',
    schedule: '내일 07:30',
    capacity: '4/8명',
    status: 'pending',
    tone: 'green',
  },
  {
    id: 'match-3',
    title: '노원 주말 농구 픽업',
    sport: '농구',
    level: '중급',
    place: '노원 실내체육관',
    schedule: '토 15:00',
    capacity: '10/10명',
    status: 'closed',
    tone: 'orange',
  },
];

export const teamMatches: MatchCard[] = [
  {
    id: 'team-match-1',
    title: '위너스 FC 상대팀 모집',
    sport: '축구',
    level: 'A-',
    place: '마포 월드컵 보조구장',
    schedule: '금 21:00',
    capacity: '상대 0/1팀',
    status: 'open',
    tone: 'blue',
  },
  {
    id: 'team-match-2',
    title: '루키즈 농구 정기전',
    sport: '농구',
    level: 'B',
    place: '서초 실내코트',
    schedule: '일 10:00',
    capacity: '승인 대기',
    status: 'pending',
    tone: 'green',
  },
];

export const teams: TeamCard[] = [
  {
    id: 'team-1',
    name: '성수 볼러스',
    sport: '풋살',
    region: '서울 성동',
    members: '18명',
    trust: 'verified',
    joinStatus: 'approval_required',
  },
  {
    id: 'team-2',
    name: '한강 러너스',
    sport: '러닝',
    region: '서울 송파',
    members: '42명',
    trust: 'estimated',
    joinStatus: 'approval_required',
  },
  {
    id: 'team-3',
    name: '노원 픽앤롤',
    sport: '농구',
    region: '서울 노원',
    members: '12명',
    trust: 'sample',
    joinStatus: 'closed',
  },
];

export const notices = [
  { id: 'notice-1', title: 'v1 베타 운영 기준 안내', date: '오늘' },
  { id: 'notice-2', title: '결제/환불 기능은 이번 v1 범위에서 제외됩니다', date: '어제' },
];

export const activityRows = [
  { label: '참가 대기', value: '2', caption: '호스트 승인 필요' },
  { label: '운영 중', value: '3', caption: '매치/팀매치 포함' },
  { label: '신뢰 상태', value: 'sample', caption: '실제 평판 아님' },
];
