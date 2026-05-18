import { DesignFrame } from '@/components/design/design-frame';
import { SearchExperience } from '@/components/search/search-experience';

export default function SearchEmptyPage() {
  return (
    <DesignFrame title="02 검색 결과 없음 · 1차 디자인 완료">
      <SearchExperience state="empty" />
    </DesignFrame>
  );
}
