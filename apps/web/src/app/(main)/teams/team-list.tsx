'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTeams, useMyTeams } from '@/hooks/use-api';
import { useAuthStore } from '@/stores/auth-store';
import { useDebounce } from '@/hooks/use-debounce';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { TeamCard } from '@/components/teams/team-card';
import { Search, Users as UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { sportLabel } from '@/lib/constants';
import type { SportTeam, MyTeam } from '@/types/api';
import type { SportType } from '@/types/enums.generated';

const sportFilters: Array<{ key: SportType | ''; label: string }> = [
  { key: '', label: '전체' },
  ...Object.entries(sportLabel).map(([key, label]) => ({ key: key as SportType, label })),
];

const genderFilters = [
  { key: '', label: '전체' },
  { key: 'any', label: '성별무관' },
  { key: 'male', label: '남자' },
  { key: 'female', label: '여자' },
] as const;

const sortFilters = [
  { key: 'recommended', label: '추천순' },
  { key: 'deadline', label: '마감임박' },
  { key: 'latest', label: '최신순' },
] as const;

type GenderFilter = (typeof genderFilters)[number]['key'];
type SortFilter = (typeof sortFilters)[number]['key'];

export function TeamList() {
  const te = useTranslations('empty');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading, error, refetch } = useTeams();
  const { data: myTeams } = useMyTeams();

  const rawSport = searchParams.get('sport');
  const activeSport: SportType | '' = rawSport && sportFilters.some(f => f.key === rawSport) ? rawSport as SportType : '';
  const [searchInput, setSearchInput] = useState('');
  const [activeGender, setActiveGender] = useState<GenderFilter>('');
  const [activeSort, setActiveSort] = useState<SortFilter>('recommended');

  const updateSportFilter = useCallback((sport: SportType | '') => {
    const params = new URLSearchParams(searchParams.toString());
    if (!sport) params.delete('sport'); else params.set('sport', sport);
    const q = params.toString();
    router.replace(pathname + (q ? `?${q}` : ''), { scroll: false });
  }, [searchParams, router, pathname]);
  const debouncedSearch = useDebounce(searchInput, 300);

  const allTeams = data?.items ?? [];
  const myTeamList: MyTeam[] = myTeams ?? [];
  const myTeamIds = new Set(myTeamList.map((t) => t.id));

  const filteredTeams = useMemo(() => {
    let result = isAuthenticated ? allTeams.filter((t: SportTeam) => !myTeamIds.has(t.id)) : allTeams;
    if (activeSport) {
      result = result.filter((t: SportTeam) => {
        const types = t.sportTypes ?? [t.sportType];
        return types.includes(activeSport);
      });
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((t: SportTeam) =>
        t.name.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q),
      );
    }
    const toTime = (value?: string) => (value ? new Date(value).getTime() : 0);
    const sorted = [...result];

    if (activeSort === 'latest') {
      sorted.sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt));
    } else if (activeSort === 'deadline') {
      sorted.sort((a, b) => Number(b.isRecruiting) - Number(a.isRecruiting));
    } else {
      sorted.sort((a, b) => {
        const scoreDiff = (b.mannerScore ?? 0) - (a.mannerScore ?? 0);
        return scoreDiff || (b.memberCount ?? 0) - (a.memberCount ?? 0);
      });
    }

    return sorted;
  }, [allTeams, isAuthenticated, myTeamIds, activeSport, debouncedSearch, activeGender, activeSort]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 @3xl:grid @3xl:grid-cols-2">
        {[1, 2, 3].map(i => <div key={i} className="h-[120px] rounded-xl bg-gray-50 dark:bg-gray-800 skeleton-shimmer" />)}
      </div>
    );
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} aria-hidden="true" />
        <label htmlFor="team-search" className="sr-only">팀 검색</label>
        <Input
          id="team-search"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="팀 이름으로 검색"
          className="pl-10"
        />
      </div>

      {/* Sport filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {sportFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => updateSportFilter(filter.key)}
            aria-pressed={activeSport === filter.key}
            className={`shrink-0 min-h-[44px] rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSport === filter.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {sortFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveSort(filter.key)}
            aria-pressed={activeSort === filter.key}
            className={`shrink-0 min-h-[44px] rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeSort === filter.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {genderFilters.map((filter) => (
          <button
            key={filter.key || 'all'}
            type="button"
            onClick={() => setActiveGender(filter.key)}
            aria-pressed={activeGender === filter.key}
            className={`shrink-0 min-h-[44px] rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              activeGender === filter.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* My teams */}
      {isAuthenticated && (
        <div>
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-3">내 팀</h2>
          {myTeamList.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="소속 팀이 없어요"
              description="팀을 만들거나 가입해보세요"
              size="sm"
              action={{ label: '팀 만들기', href: '/teams/new' }}
            />
          ) : (
            <div className="flex flex-col gap-3 @3xl:grid @3xl:grid-cols-2">
              {myTeamList.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Other teams */}
      <div>
        {isAuthenticated && (
          <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white mb-3">다른 팀</h2>
        )}
        {!isLoading && filteredTeams.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{filteredTeams.length}개 팀</p>
        )}
        {filteredTeams.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title={debouncedSearch || activeSport ? '조건에 맞는 팀이 없어요' : te('noTeams')}
            description={debouncedSearch || activeSport ? '다른 조건으로 검색해보세요' : te('noTeamsDesc')}
            {...(!debouncedSearch && !activeSport && isAuthenticated && {
              action: { label: '팀 만들기', href: '/teams/new' },
            })}
            {...(activeSport && {
              secondaryAction: { label: '전체 보기', onClick: () => { updateSportFilter(''); setSearchInput(''); } },
            })}
          />
        ) : (
          <div className="flex flex-col gap-3 @3xl:grid @3xl:grid-cols-2 stagger-children">
            {filteredTeams.map((team: SportTeam) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
