import Link from 'next/link';
import type { MatchCard as MatchCardType } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

const statusLabel = {
  open: '신청 가능',
  pending: '승인 대기',
  confirmed: '확정',
  closed: '마감',
};

export function MatchCard({ match, href = '#' }: { match: MatchCardType; href?: string }) {
  return (
    <Link href={href} className="v1-card v1-card-pad v1-card-link">
      <div className="v1-row">
        <div>
          <p className="v1-item-title">{match.title}</p>
          <p className="v1-caption" style={{ marginTop: 5 }}>
            {match.place} · {match.schedule}
          </p>
          <div className="v1-meta">
            <Badge tone="blue">{match.sport}</Badge>
            <Badge>{match.level}</Badge>
            <Badge tone={match.tone}>{statusLabel[match.status]}</Badge>
          </div>
        </div>
        <Badge tone={match.status === 'closed' ? 'orange' : 'green'}>{match.capacity}</Badge>
      </div>
    </Link>
  );
}
