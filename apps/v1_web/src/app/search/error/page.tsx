import { DesignFrame } from '@/components/design/design-frame';
import { SearchExperience } from '@/components/search/search-experience';

export default function SearchErrorPage() {
  return (
    <DesignFrame title="02 검색 오류 · 1차 디자인 완료">
      <SearchExperience state="error" />
    </DesignFrame>
  );
}
