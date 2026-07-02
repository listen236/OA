import type { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <section className="page-container">
      <div className="page-title">{title}</div>
      {children}
    </section>
  );
}
