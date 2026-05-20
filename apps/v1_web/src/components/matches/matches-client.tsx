'use client';

import { useV1Match, useV1Matches } from '@/hooks/use-v1-api';
import type { V1Match } from '@/types/api';
import { MatchDetailPageView, MatchListPageView, MatchStatePageView } from './matches-page';
import type { MatchCardModel, MatchDetailViewModel, MatchListViewModel } from './matches.types';
import { getMatchDetailViewModel, getMatchListViewModel, getMatchStateViewModel } from './matches.view-model';

export function MatchListPageClient() {
  const query = useV1Matches();

  if (query.isError) return <MatchStatePageView model={getMatchStateViewModel('error')} />;

  const base = getMatchListViewModel();
  const items = query.data?.items;
  const model: MatchListViewModel = items
    ? {
        ...base,
        matches: items.map((item, index) => toMatchCard(item, base.matches[index] ?? base.matches[0])),
        summary: {
          ...base.summary,
          count: items.length,
          today: items.length,
        },
      }
    : base;

  if (items && items.length === 0) return <MatchStatePageView model={getMatchStateViewModel('empty')} />;

  return <MatchListPageView model={model} />;
}

export function MatchDetailPageClient({ matchId }: { matchId: string }) {
  const query = useV1Match(matchId);
  const fallback = getMatchDetailViewModel();

  if (query.isError) {
    return <MatchStatePageView model={getMatchStateViewModel('error')} />;
  }

  const model: MatchDetailViewModel = query.data
    ? {
        ...fallback,
        match: {
          ...fallback.match,
          ...toMatchCard(query.data, fallback.match),
          description: fallback.match.description,
          address: query.data.placeName,
          rules: fallback.match.rules,
          participants: fallback.match.participants,
        },
        mode: toDetailMode(query.data.status),
      }
    : fallback;

  return <MatchDetailPageView model={model} />;
}

function toMatchCard(match: V1Match, fallback: MatchCardModel): MatchCardModel {
  const capacity = parseCapacity(match.capacityText);

  return {
    ...fallback,
    id: match.id,
    title: match.title,
    sport: match.sportName,
    venue: match.placeName,
    date: formatDate(match.startsAt),
    time: formatTime(match.startsAt),
    current: capacity.current,
    capacity: capacity.capacity,
    level: match.levelLabel,
    status: toCardStatus(match.status),
    deadline: match.status === 'open' ? '신청 가능' : fallback.deadline,
  };
}

function parseCapacity(text: string) {
  const [current, capacity] = text.match(/\d+/g)?.map(Number) ?? [];
  return {
    current: current ?? 0,
    capacity: capacity ?? Math.max(current ?? 0, 1),
  };
}

function toCardStatus(status: V1Match['status']): MatchCardModel['status'] {
  if (status === 'pending') return 'pending';
  if (status === 'confirmed') return 'approved';
  if (status === 'closed' || status === 'cancelled') return 'full';
  return 'open';
}

function toDetailMode(status: V1Match['status']): MatchDetailViewModel['mode'] {
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
