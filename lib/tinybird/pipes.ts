const url = 'https://api.us-east.aws.tinybird.co';
const countOnlineVisitorsPipe = 'count_online_visitors__v1';
const visitorsSummaryPipe = 'visitors_summary__v2';
const headers = {
  Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
  'Content-Type': 'application/json'
};

export async function countOnlineVisitors(nextOptions?: NextFetchRequestConfig) {
  const response = await fetch(`${url}/v0/sql?q=SELECT+*+FROM+${countOnlineVisitorsPipe}`, {
    method: 'GET',
    headers,
    next: nextOptions
  });

  return response.json();
}

export type VisitorsSummaryQueryParams = {
  days: number;
  limit: number;
};

export type VisitorsSummary = {
  dimension: 'country' | 'browser' | 'day' | 'os' | 'request_path' | 'referrer';
  value: string;
  unique_visitors: number;
  views: number;
};

export async function getVisitorsSummary(query: VisitorsSummaryQueryParams, nextOptions?: NextFetchRequestConfig) {
  const response = await fetch(`${url}/v0/sql`, {
    method: 'POST',
    headers,
    next: nextOptions,
    body: JSON.stringify({ ...query, q: `% SELECT * FROM ${visitorsSummaryPipe} FORMAT JSON` })
  });

  return response.json();
}
