import { PageContent } from './PageContent';
import { countOnlineVisitors, getVisitorsSummary, VisitorsSummaryQueryParams } from '@/lib/tinybird';

async function getOnlineVisitors() {
  const onlineVisitors = await countOnlineVisitors({ revalidate: 60 }); // 1 min
  return onlineVisitors;
}

async function getSummary(query: VisitorsSummaryQueryParams) {
  const visitorsSummary = await getVisitorsSummary(query, { revalidate: 60 });
  return visitorsSummary;
}

export default async function Page() {
  const onlineVisitors = await getOnlineVisitors();
  const summary = await getSummary({ days: 7, limit: 5 });

  return <PageContent onlineVisitors={onlineVisitors} summary={summary} />;
}
