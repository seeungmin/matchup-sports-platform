import type { ReactNode } from 'react';
import { DesignInteractions } from '@/components/design/design-interactions';
import { TokensCSS } from '@/design-source/sm-first-design';

type DesignFrameProps = {
  children: ReactNode;
  title?: string;
};

export function DesignFrame({ children, title }: DesignFrameProps) {
  return (
    <main className="design-page">
      <TokensCSS />
      {title ? <h1 className="design-page-title">{title}</h1> : null}
      <div className="design-artboard">
        <DesignInteractions>{children}</DesignInteractions>
      </div>
    </main>
  );
}
