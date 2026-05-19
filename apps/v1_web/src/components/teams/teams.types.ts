export type TeamStatus = 'open' | 'reviewing' | 'closed' | 'mine';

export type TeamModel = {
  id: string;
  name: string;
  logo: string;
  sport: string;
  region: string;
  members: number;
  status: TeamStatus;
  statusLabel: string;
  tags: string[];
  fit: number;
  manner: number;
  trust: 'verified' | 'estimated' | 'sample';
  next: string;
};

export type TeamListViewModel = {
  query: string;
  chips: Array<{ label: string; active?: boolean }>;
  summary: { recruiting: number; matched: number };
  teams: TeamModel[];
};

export type TeamDetailViewModel = {
  team: TeamModel & {
    description: string;
    activity: string;
    condition: string;
    trustNote: string;
    schedule: string;
    membersList: Array<{ name: string; role: string; meta: string; status: string }>;
  };
  mode: 'default' | 'pending' | 'mine' | 'closed';
};

export type TeamFormMode = 'create' | 'edit';

export type TeamFormViewModel = {
  mode: TeamFormMode;
  team: {
    name: string;
    sport: string;
    region: string;
    description: string;
    level: string;
    activity: string;
    capacity: number;
  };
};

export type TeamMembersViewModel = {
  teamName: string;
  summary: { total: number; managers: number; pending: number };
  members: Array<{ name: string; role: string; meta: string; status: string }>;
};
