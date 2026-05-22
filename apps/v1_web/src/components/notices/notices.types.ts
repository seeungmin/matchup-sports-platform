export type NoticeModel = {
  id: string;
  tag: string;
  title: string;
  summary: string;
  date: string;
  pinned?: boolean;
  body: string[];
};

export type NoticeListViewModel = {
  filters: Array<{ label: string; active?: boolean; onSelect?: () => void }>;
  notices: NoticeModel[];
};

export type NoticeDetailViewModel = {
  notice: NoticeModel;
  relatedHref: string;
};
