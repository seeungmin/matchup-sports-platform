import { ChatRoomPageView } from '@/components/community/community-page';
import { getChatRoomViewModel } from '@/components/community/community.view-model';

export default function ChatRoomPage() {
  return <ChatRoomPageView model={getChatRoomViewModel()} />;
}
