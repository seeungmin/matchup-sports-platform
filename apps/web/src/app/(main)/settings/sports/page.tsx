'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Dumbbell, Info } from 'lucide-react';
import { MobileGlassHeader } from '@/components/layout/mobile-glass-header';
import { useToast } from '@/components/ui/toast';
import { useRequireAuth } from '@/hooks/use-require-auth';
import { useMe, useUpdateMySportProfiles } from '@/hooks/use-api';
import { useAuthStore } from '@/stores/auth-store';
import { SportIconMap } from '@/components/icons/sport-icons';
import { TEAM_SPORT_TYPES, levelLabel, sportLabel } from '@/lib/constants';
import type { SportType } from '@/types/enums.generated';
import type { SportProfile, UpdateSportProfileInput } from '@/types/api';

type SportFormItem = {
  sportType: SportType;
  level: number;
  preferredPositions: string;
};

function toFormItems(profiles: SportProfile[]): SportFormItem[] {
  return profiles.map((profile) => ({
    sportType: profile.sportType,
    level: profile.level,
    preferredPositions: profile.preferredPositions?.join(', ') ?? '',
  }));
}

function toPayload(items: SportFormItem[]): UpdateSportProfileInput[] {
  return items.map((item) => ({
    sportType: item.sportType,
    level: item.level,
    preferredPositions: item.preferredPositions
      .split(',')
      .map((position) => position.trim())
      .filter(Boolean),
  }));
}

export default function SportSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useRequireAuth();
  const { user, setUser } = useAuthStore();
  const { data: me } = useMe();
  const updateSportProfiles = useUpdateMySportProfiles();
  const [items, setItems] = useState<SportFormItem[]>([]);

  const sourceProfiles = useMemo(
    () => me?.sportProfiles ?? user?.sportProfiles ?? [],
    [me?.sportProfiles, user?.sportProfiles],
  );

  useEffect(() => {
    setItems(toFormItems(sourceProfiles));
  }, [sourceProfiles]);

  if (!isAuthenticated) {
    return null;
  }

  const selectedSportTypes = new Set(items.map((item) => item.sportType));
  const hasProfiles = sourceProfiles.length > 0;

  const toggleSport = (sportType: SportType) => {
    setItems((current) => {
      if (current.some((item) => item.sportType === sportType)) {
        return current.filter((item) => item.sportType !== sportType);
      }
      return [...current, { sportType, level: 3, preferredPositions: '' }];
    });
  };

  const updateItem = (sportType: SportType, patch: Partial<SportFormItem>) => {
    setItems((current) =>
      current.map((item) => (item.sportType === sportType ? { ...item, ...patch } : item)),
    );
  };

  const handleSave = async () => {
    if (items.length === 0) {
      toast('error', '운동정보를 1개 이상 선택해주세요');
      return;
    }

    try {
      const updated = await updateSportProfiles.mutateAsync(toPayload(items));
      setUser(updated as never);
      toast('success', '운동정보가 저장되었어요');
      router.push('/profile');
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast('error', message || '운동정보를 저장하지 못했어요. 잠시 후 다시 시도해주세요');
    }
  };

  return (
    <div className="animate-fade-in pt-[var(--safe-area-top)] @3xl:pt-0">
      <MobileGlassHeader title="운동정보" subtitle="종목과 실력 수준을 따로 관리하세요." showBack />

      <div className="hidden @3xl:flex items-center gap-3 mb-6 text-sm text-gray-500">
        <button
          aria-label="뒤로 가기"
          onClick={() => router.back()}
          className="flex min-h-[44px] min-w-11 items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">운동정보</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">종목, 실력 수준, 포지션을 관리하세요.</p>
        </div>
      </div>

      <div className="max-w-2xl px-5 pb-10 pt-4 @3xl:px-0 @3xl:pt-0">
        <section className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              <Info size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                {hasProfiles ? '등록된 운동정보를 수정합니다' : '운동정보를 새로 설정합니다'}
              </p>
              <p className="mt-1 text-sm leading-6 text-blue-800/90 dark:text-blue-100/80">
                ELO와 경기 전적은 경기 결과로 자동 갱신됩니다. 여기서는 종목, 레벨, 선호 포지션만 직접 수정해요.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Dumbbell size={18} className="text-gray-500 dark:text-gray-400" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">종목 선택</h2>
          </div>

          <div className="grid grid-cols-2 gap-2 @3xl:grid-cols-3">
            {TEAM_SPORT_TYPES.map((sportType) => {
              const selected = selectedSportTypes.has(sportType);
              const SportIcon = SportIconMap[sportType];
              return (
                <button
                  key={sportType}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleSport(sportType)}
                  className={`flex min-h-[72px] items-center gap-2 rounded-xl border px-3 text-left transition-colors ${
                    selected
                      ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-200'
                      : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 dark:border-gray-700 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {SportIcon ? <SportIcon size={20} className="shrink-0" aria-hidden="true" /> : null}
                  <span className="text-sm font-semibold">{sportLabel[sportType]}</span>
                </button>
              );
            })}
          </div>
        </section>

        {items.length > 0 ? (
          <section className="mt-5 space-y-3">
            {items.map((item) => {
              const SportIcon = SportIconMap[item.sportType];
              return (
                <div key={item.sportType} className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-3 flex items-center gap-2">
                    {SportIcon ? <SportIcon size={18} className="text-gray-500 dark:text-gray-400" aria-hidden="true" /> : null}
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{sportLabel[item.sportType]}</h3>
                  </div>

                  <label htmlFor={`sport-level-${item.sportType}`} className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    레벨
                  </label>
                  <select
                    id={`sport-level-${item.sportType}`}
                    value={item.level}
                    onChange={(event) => updateItem(item.sportType, { level: Number(event.target.value) })}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-medium text-gray-900 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option key={level} value={level}>{levelLabel[level]}</option>
                    ))}
                  </select>

                  <label htmlFor={`sport-position-${item.sportType}`} className="mt-3 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    선호 포지션
                  </label>
                  <input
                    id={`sport-position-${item.sportType}`}
                    value={item.preferredPositions}
                    onChange={(event) => updateItem(item.sportType, { preferredPositions: event.target.value })}
                    placeholder="예: FW, MF"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-900 outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              );
            })}
          </section>
        ) : (
          <section className="mt-5 rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">선택된 종목이 없어요</p>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">운동정보를 저장하려면 종목을 하나 이상 선택해주세요.</p>
          </section>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="min-h-[48px] flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={updateSportProfiles.isPending}
            className="min-h-[48px] flex-1 rounded-xl bg-blue-500 px-4 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
          >
            {updateSportProfiles.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}
