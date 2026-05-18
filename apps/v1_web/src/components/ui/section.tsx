import type { ReactNode } from 'react';

type SectionProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function Section({ title, subtitle, action, children }: SectionProps) {
  return (
    <section className="v1-section">
      <div className="v1-section-head">
        <div>
          <h2 className="v1-section-title">{title}</h2>
          {subtitle ? <p className="v1-section-subtitle">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
