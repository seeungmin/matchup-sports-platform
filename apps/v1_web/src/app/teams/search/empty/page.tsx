import { DesignFrame } from '@/components/design/design-frame';
import { SMRevisionTeamBrowseSearchMobileSM5 } from '@/design-source/sm-first-design';

export default function TeamSearchEmptyPage() {
  return (
    <DesignFrame title="09 팀 검색 결과 없음 · 1차 디자인 완료">
      <SMRevisionTeamBrowseSearchMobileSM5 state="empty" />
    </DesignFrame>
  );
}
