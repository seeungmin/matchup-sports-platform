import type { ReactNode } from 'react';

type BadgeTone = 'blue' | 'green' | 'orange' | 'red' | 'grey';

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, tone = 'grey' }: BadgeProps) {
  const className = tone === 'grey' ? 'v1-badge' : `v1-badge v1-badge-${tone}`;

  return <span className={className}>{children}</span>;
}
