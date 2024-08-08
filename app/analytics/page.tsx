import { countOnlineVisitors, getVisitorsSummary, VisitorsSummary, VisitorsSummaryQueryParams } from '@/lib/tinybird';
import styles from './page.module.css';
import { Table } from '../components/Table';

async function getOnlineVisitors() {
  const onlineVisitors = await countOnlineVisitors({ revalidate: 60 }); // 1 min
  return onlineVisitors;
}

async function getSummary(query: VisitorsSummaryQueryParams) {
  const visitorsSummary = await getVisitorsSummary(query, { revalidate: 60 });
  return visitorsSummary;
}

export default function Page() {
  return (
    <main className={styles.page}>
      <p>Os dados são cacheados por 1 minuto.</p>
      <OnlineVisitors />
      <Summary />
    </main>
  );
}

async function OnlineVisitors() {
  const onlineVisitors = await getOnlineVisitors();

  if (typeof onlineVisitors !== 'number') {
    return <p>Erro na requisição: {JSON.stringify(onlineVisitors)}</p>;
  }

  return (
    <p>
      {onlineVisitors} visitante{onlineVisitors > 1 ? 's' : ''} online
    </p>
  );
}

type SummaryTable = { value: string; unique_visitors: number; views: number };

async function Summary() {
  const summary = await getSummary({ days: 7, limit: 5 });

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

  for (const item of summary.data as VisitorsSummary[]) {
    dataPerCategory[item.dimension].push({
      unique_visitors: item.unique_visitors,
      value: item.value,
      views: item.views
    });
  }

  return (
    <div>
      <div className={styles.firstRow}>
        <Table
          className={`${styles.card} ${styles.table}`}
          columns={[
            { displayName: 'Páginas', property: 'value' },
            { displayName: 'Visitantes', property: 'unique_visitors' }
          ]}
          data={dataPerCategory.request_path}
          dataKey='value'
        />
        <Table
          className={`${styles.card} ${styles.table}`}
          columns={[
            { displayName: 'Referrers', property: 'value' },
            { displayName: 'Visitantes', property: 'unique_visitors' }
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
            { displayName: 'Visitantes', property: 'unique_visitors' }
          ]}
          data={dataPerCategory.country}
          dataKey='value'
        />
        <Table
          className={`${styles.card} ${styles.table}`}
          columns={[
            { displayName: 'Sistemas Operacionais', property: 'value' },
            { displayName: 'Visitantes', property: 'unique_visitors' }
          ]}
          data={dataPerCategory.os}
          dataKey='value'
        />
        <Table
          className={`${styles.card} ${styles.table}`}
          columns={[
            { displayName: 'Navegadores', property: 'value' },
            { displayName: 'Visitantes', property: 'unique_visitors' }
          ]}
          data={dataPerCategory.browser}
          dataKey='value'
        />
      </div>
    </div>
  );
}
