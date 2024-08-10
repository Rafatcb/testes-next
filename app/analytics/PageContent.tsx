'use client';

import styles from './page.module.css';
import { useState } from 'react';
import { OnlineVisitors } from './OnlineVisitors';
import { Summary } from './Summary';
import { VisitorsSummary } from '@/lib/tinybird';

type Props = {
  onlineVisitors: number | Record<string, unknown>;
  summary: { data: VisitorsSummary[]; error?: unknown }
};

export function PageContent({ onlineVisitors, summary }: Props) {
  const [filter, setFilter] = useState<'views' | 'unique_visitors'>('unique_visitors');

  return (
    <main className={styles.page}>
      <h1>Exibindo dados de {filter === 'views' ? 'visualizações' : 'visitantes únicos'}.</h1>
      <button onClick={() => setFilter(v => (v === 'views' ? 'unique_visitors' : 'views'))}>
        Mudar para {filter === 'views' ? 'visitantes únicos' : 'visualizações'}
      </button>
      <p>Os dados são cacheados por 1 minuto.</p>
      <OnlineVisitors count={onlineVisitors} />
      <Summary property={filter} summary={summary} />
    </main>
  );
}
