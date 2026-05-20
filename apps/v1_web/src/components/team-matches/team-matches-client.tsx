'use client';

import { useV1TeamMatch, useV1TeamMatches } from '@/hooks/use-v1-api';
import type { V1TeamMatch } from '@/types/api';
import { TeamMatchDetailPageView, TeamMatchListPageView, TeamMatchStatePageView } from './team-matches-page';
import type { TeamMatchDetailViewModel, TeamMatchListViewModel, TeamMatchModel } from './team-matches.types';
import {
  getTeamMatchDetailViewModel,
  getTeamMatchListViewModel,
  getTeamMatchStateViewModel,
} from './team-matches.view-model';

export function TeamMatchListPageClient() {
  const query = useV1TeamMatches();

  if (query.isError) return <TeamMatchStatePageView model={getTeamMatchStateViewModel('error')} />;

  const base = getTeamMatchListViewModel();
  const items = query.data?.items;
  const model: TeamMatchListViewModel = items
    ? {
        ...base,
        matches: items.map((item, index) => toTeamMatch(item, base.matches[index] ?? base.matches[0])),
        summary: { ...base.summary, count: items.length, today: items.length },
      }
    : base;

  if (items && items.length === 0) return <TeamMatchStatePageView model={getTeamMatchStateViewModel('empty')} />;

  return <TeamMatchListPageView model={model} />;
}

export function TeamMatchDetailPageClient({ teamMatchId }: { teamMatchId: string }) {
  const query = useV1TeamMatch(teamMatchId);
  const fallback = getTeamMatchDetailViewModel();

  if (query.isError) return <TeamMatchStatePageView model={getTeamMatchStateViewModel('error')} />;

  const model: TeamMatchDetailViewModel = query.data
    ? {
        ...fallback,
        match: {
          ...fallback.match,
          ...toTeamMatch(query.data, fallback.match),
          description: fallback.match.description,
          address: query.data.placeName,
          applicantTeams: fallback.match.applicantTeams,
        },
        mode: toDetailMode(query.data.status),
      }
    : fallback;

  return <TeamMatchDetailPageView model={model} />;
}

function toTeamMatch(match: V1TeamMatch, fallback: TeamMatchModel): TeamMatchModel {
  return {
    ...fallback,
    id: match.id,
    title: match.title,
    sport: match.sportName,
    hostTeam: match.hostTeamName,
    venue: match.placeName,
    date: formatDate(match.startsAt),
    time: formatTime(match.startsAt),
    grade: match.levelLabel,
    status: toCardStatus(match.status),
  };
}

function toCardStatus(status: V1TeamMatch['status']): TeamMatchModel['status'] {
  if (status === 'pending') return 'pending';
  if (status === 'confirmed') return 'approved';
  return 'open';
}

function toDetailMode(status: V1TeamMatch['status']): TeamMatchDetailViewModel['mode'] {
  if (status === 'pending') return 'pending';
  if (status === 'confirmed') return 'approved';
  return 'default';
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}
