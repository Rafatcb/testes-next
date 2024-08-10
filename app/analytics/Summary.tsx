import { VisitorsSummary } from '@/lib/tinybird';
import { Table } from '../components/Table';

import styles from './page.module.css';

type SummaryTable = { value: string; unique_visitors: number; views: number };

type Props = {
  property: 'unique_visitors' | 'views';
  summary: { data: VisitorsSummary[]; error?: unknown };
};

export function Summary({ property, summary }: Props) {
  if ('error' in summary) {
    return <p>Erro na requisição: {JSON.stringify(summary)}</p>;
  }

  const dataPerCategory: { [key in VisitorsSummary['dimension']]: SummaryTable[] } = {
    browser: [],
    country: [],
    day: [],
    os: [],
    referrer: [],
    request_path: []
  };

  for (const item of summary.data) {
    dataPerCategory[item.dimension].push({
      unique_visitors: item.unique_visitors,
      value: item.value,
      views: item.views
    });
  }

  const label = property === 'views' ? 'Visualizações' : 'Visitantes';

  return (
    <div>
      <div className={styles.firstRow}>
        <Table
          className={`${styles.card} ${styles.table}`}
          columns={[
            { displayName: 'Páginas', property: 'value' },
            { displayName: label, property }
          ]}
          data={dataPerCategory.request_path}
          dataKey='value'
        />
        <Table
          className={`${styles.card} ${styles.table}`}
          columns={[
            { displayName: 'Referrers', property: 'value' },
            { displayName: label, property }
          ]}
          data={dataPerCategory.referrer}
          dataKey='value'
        />
      </div>
      <div className={styles.secondRow}>
        <Table
          className={`${styles.card} ${styles.table}`}
          columns={[
            { displayName: 'Países', property: 'value' },
            { displayName: label, property }
          ]}
          data={dataPerCategory.country}
          dataKey='value'
        />
        <Table
          className={`${styles.card} ${styles.table}`}
          columns={[
            { displayName: 'Sistemas Operacionais', property: 'value' },
            { displayName: label, property }
          ]}
          data={dataPerCategory.os}
          dataKey='value'
        />
        <Table
          className={`${styles.card} ${styles.table}`}
          columns={[
            { displayName: 'Navegadores', property: 'value' },
            { displayName: label, property }
          ]}
          data={dataPerCategory.browser}
          dataKey='value'
        />
      </div>
    </div>
  );
}
