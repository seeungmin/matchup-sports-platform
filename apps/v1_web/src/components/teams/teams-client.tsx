'use client';

import { useV1Team, useV1Teams } from '@/hooks/use-v1-api';
import type { V1Team } from '@/types/api';
import { TeamDetailPageView, TeamListPageView, TeamStatePageView } from './teams-page';
import type { TeamDetailViewModel, TeamListViewModel, TeamModel } from './teams.types';
import { getTeamDetailViewModel, getTeamListViewModel, getTeamStateViewModel } from './teams.view-model';

export function TeamListPageClient() {
  const query = useV1Teams();

  if (query.isError) return <TeamStatePageView model={getTeamStateViewModel('error')} />;

  const base = getTeamListViewModel();
  const items = query.data?.items;
  const model: TeamListViewModel = items
    ? {
        ...base,
        teams: items.map((item, index) => toTeam(item, base.teams[index] ?? base.teams[0])),
        summary: {
          ...base.summary,
          total: items.length,
          recruiting: items.filter((item) => item.joinPolicy === 'approval_required').length,
        },
      }
    : base;

  if (items && items.length === 0) return <TeamStatePageView model={getTeamStateViewModel('empty')} />;

  return <TeamListPageView model={model} />;
}

export function TeamDetailPageClient({ teamId }: { teamId: string }) {
  const query = useV1Team(teamId);
  const fallback = getTeamDetailViewModel();

  if (query.isError) return <TeamStatePageView model={getTeamStateViewModel('error')} />;

  const model: TeamDetailViewModel = query.data
    ? {
        ...fallback,
        team: {
          ...fallback.team,
          ...toTeam(query.data, fallback.team),
          description: fallback.team.description,
          activity: fallback.team.activity,
          condition: fallback.team.condition,
          trustNote: `${query.data.trustState} · API 신뢰 상태`,
          schedule: fallback.team.schedule,
          city: fallback.team.city,
          county: query.data.regionName,
          level: fallback.team.level,
          contact: fallback.team.contact,
          links: fallback.team.links,
          images: fallback.team.images,
          membersList: fallback.team.membersList,
        },
        mode: query.data.joinPolicy === 'closed' ? 'closed' : 'default',
      }
    : fallback;

  return <TeamDetailPageView model={model} />;
}

function toTeam(team: V1Team, fallback: TeamModel): TeamModel {
  return {
    ...fallback,
    id: team.id,
    name: team.name,
    logo: team.name.slice(0, 1),
    sport: team.sportName,
    sports: [team.sportName],
    region: team.regionName,
    members: team.memberCount,
    status: team.joinPolicy === 'closed' ? 'closed' : 'open',
    statusLabel: team.joinPolicy === 'closed' ? '마감' : '모집중',
    trust: team.trustState,
    intro: `${team.regionName}에서 활동하는 ${team.sportName} 팀입니다. 가입은 팀 운영 정책에 따라 처리됩니다.`,
  };
}
