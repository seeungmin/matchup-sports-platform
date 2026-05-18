import { DesignFrame } from '@/components/design/design-frame';
import { SMRevisionNotificationsMobileSM2 } from '@/design-source/sm-first-design';

export default function NotificationsReadPage() {
  return (
    <DesignFrame title="06 알림 읽음 처리 · 1차 디자인 완료">
      <SMRevisionNotificationsMobileSM2 readAll />
    </DesignFrame>
  );
}
