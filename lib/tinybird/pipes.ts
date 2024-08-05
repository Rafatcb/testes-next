const url = 'https://api.us-east.aws.tinybird.co';
const countOnlineVisitorsPipe = 'count_online_visitors__v1';
const headers = {
  Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`
};

export async function countOnlineVisitors() {
  const response = await fetch(`${url}/v0/sql?q=SELECT+*+FROM+${countOnlineVisitorsPipe}`, {
    method: 'POST',
    headers
  });

  console.log(response);
  const responseBody = await response.json();
  console.log(responseBody);

  return responseBody;
}
