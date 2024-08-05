import { z } from 'zod';

export type PageViewEventInput = typeof pageViewValidator._input;

const pageViewValidator = z.object({
  type: z.union([z.literal('page-view'), z.literal('page-return'), z.literal('page-leave')]).default('page-view'),
  request_path: z.string(),
  session_id: z.string(),
  timestamp_utc: z.string().datetime(),
  country: z.string().default('Unknown'),
  browser: z.string().default('Unknown'),
  browser_version: z.string().default('Unknown'),
  engine: z.string().default('Unknown'),
  engine_version: z.string().default('Unknown'),
  os: z.string().default('Unknown'),
  os_version: z.string().default('Unknown'),
  device: z.string().default('Desktop'),
  device_vendor: z.string().default('Unknown'),
  device_model: z.string().default('Unknown'),
  cpu_architecture: z.string().default('Unknown'),
  referrer: z.string().default('(direct)'),
  ip: z.string()
});

const url = 'https://api.us-east.aws.tinybird.co';
const pageViewEvent = 'page_views__v1';
const headers = {
  Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`
};

export async function publishPageView(pageView: PageViewEventInput) {
  if (!process.env.TINYBIRD_TOKEN) {
    throw Error('Variável de ambiente TINYBIRD_TOKEN não definida.');
  }

  const eventParseResult = pageViewValidator.safeParse(pageView);
  if (!eventParseResult.success) {
    throw Error(`Dados inválidos: ${eventParseResult.error.message}`);
  }

  const response = await fetch(`${url}/v0/events?name=${pageViewEvent}`, {
    method: 'POST',
    body: JSON.stringify(eventParseResult.data),
    headers
  });
  console.log('response.status', response.status);

  const responseBody =
    response.headers.get('Content-Type') === 'application/json' ? await response.json() : await response.text();
  console.log('responseBody', responseBody);
  return responseBody;
}
