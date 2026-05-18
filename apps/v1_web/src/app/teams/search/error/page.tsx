import { DesignFrame } from '@/components/design/design-frame';
import { SMRevisionTeamBrowseSearchMobileSM5 } from '@/design-source/sm-first-design';

export default function TeamSearchErrorPage() {
  return (
    <DesignFrame title="09 팀 검색 오류 · 1차 디자인 완료">
      <SMRevisionTeamBrowseSearchMobileSM5 state="error" />
    </DesignFrame>
  );
}
