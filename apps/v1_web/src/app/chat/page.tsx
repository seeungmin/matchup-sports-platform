import { ChatListPageView } from '@/components/community/community-page';
import { getChatListViewModel } from '@/components/community/community.view-model';

export default function ChatPage() {
  return <ChatListPageView model={getChatListViewModel()} />;
}
