import { DesignFrame } from '@/components/design/design-frame';
import { SMRevisionMatchListMobileSM7 } from '@/design-source/sm-first-design';

export default function MatchesPage() {
  return (
    <DesignFrame title="03 개인 매치 · 1차 디자인 완료">
      <SMRevisionMatchListMobileSM7 mode="card" />
    </DesignFrame>
  );
}
