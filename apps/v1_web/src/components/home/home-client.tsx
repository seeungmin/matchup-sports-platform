'use client';

import { useV1Home } from '@/hooks/use-v1-api';
import type { V1Home, V1HomeRecommendation, V1Match, V1Notice } from '@/types/api';
import { HomePageView } from './home-page';
import type { HomeMatchCard, HomeNotice, HomeViewModel } from './home.types';
import { getHomeViewModel } from './home.view-model';

export function HomePageClient() {
  const query = useV1Home();
  const fallback = getHomeViewModel();

  if (query.isError) {
    return <HomePageView model={{ ...fallback, network: true, hasNewNotification: false, chatUnreadCount: 0 }} />;
  }

  return <HomePageView model={query.data ? toHomeModel(query.data, fallback) : fallback} />;
}

function toHomeModel(home: V1Home, fallback: HomeViewModel): HomeViewModel {
  const recommendedMatches = normalizeMatches(home, fallback);
  const notices = normalizeNotices(home, fallback);
  const unreadCount = home.notifications?.unreadCount ?? 0;
  const viewerName = home.viewer?.authenticated ? home.viewer.displayName : null;

  return {
    ...fallback,
    viewerName,
    signedOut: !home.viewer?.authenticated,
    network: false,
    hasNewNotification: unreadCount > 0,
    chatUnreadCount: unreadCount,
    featuredMatch: recommendedMatches[0] ?? fallback.featuredMatch,
    recommendedMatches,
    notices,
  };
}

function normalizeMatches(home: V1Home, fallback: HomeViewModel) {
  const legacyMatches = Array.isArray(home.recommendedMatches) ? home.recommendedMatches : [];
  if (legacyMatches.length) {
    return legacyMatches.map((match, index) => toHomeMatch(match, fallback.recommendedMatches[index] ?? fallback.featuredMatch));
  }

  const recommendations = Array.isArray(home.recommendations) ? home.recommendations : [];
  return recommendations.length
    ? recommendations.map((match, index) => toHomeRecommendation(match, fallback.recommendedMatches[index] ?? fallback.featuredMatch))
    : fallback.recommendedMatches;
}

function normalizeNotices(home: V1Home, fallback: HomeViewModel) {
  const notices = Array.isArray(home.notices) ? home.notices : [];
  if (notices.length) return notices.map(toHomeNotice);
  if (home.notice) {
    return [
      {
        id: home.notice.noticeId,
        title: home.notice.title,
        summary: home.notice.pinned ? 'Pinned notice' : 'Notice',
        trailing: 'Notice',
      },
    ];
  }

  return fallback.notices;
}

function toHomeRecommendation(match: V1HomeRecommendation, fallback: HomeMatchCard): HomeMatchCard {
  return {
    ...fallback,
    id: match.matchId,
    sportLabel: match.sportName,
    title: match.title,
    venue: match.regionName ?? fallback.venue,
    date: formatDate(match.startsAt),
    time: formatTime(match.startsAt),
    currentParticipants: match.participantCount ?? fallback.currentParticipants,
    maxParticipants: match.capacity ?? fallback.maxParticipants,
  };
}

function toHomeMatch(match: V1Match, fallback: HomeMatchCard): HomeMatchCard {
  const capacity = parseCapacity(match.capacityText);

  return {
    ...fallback,
    id: match.id,
    sportLabel: match.sportName,
    title: match.title,
    venue: match.placeName,
    date: formatDate(match.startsAt),
    time: formatTime(match.startsAt),
    currentParticipants: capacity.current,
    maxParticipants: capacity.capacity,
  };
}

function toHomeNotice(notice: V1Notice): HomeNotice {
  return {
    id: notice.id,
    title: notice.title,
    summary: notice.body ?? notice.category,
    trailing: formatDate(notice.publishedAt),
  };
}

function parseCapacity(text: string) {
  const [current, capacity] = text.match(/\d+/g)?.map(Number) ?? [];
  return {
    current: current ?? 0,
    capacity: capacity ?? Math.max(current ?? 0, 1),
  };
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
