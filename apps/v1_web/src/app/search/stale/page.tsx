import { DesignFrame } from '@/components/design/design-frame';
import { SearchExperience } from '@/components/search/search-experience';

export default function SearchStalePage() {
  return (
    <DesignFrame title="02 검색 최신화 · 1차 디자인 완료">
      <SearchExperience state="stale" />
    </DesignFrame>
  );
}
