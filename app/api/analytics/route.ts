import { NextResponse } from 'next/server';
import UAParser from 'ua-parser-js';
import { z } from 'zod';
import { PageViewEventInput, publishPageView } from '@/lib/tinybird';
import ip from '@/models/ip';

const bodyValidation = z.object({
  type: z.union([z.literal('page-view'), z.literal('page-return'), z.literal('page-leave')]).default('page-view'),
  request_path: z.string(),
  session_id: z.string().transform(s => s.substring(0, 21)),
  referrer: z
    .string()
    .optional()
    .transform(r => r || undefined)
});

export async function POST(request: Request) {
  const unsafeBody = await request.json();
  const bodyParseResult = bodyValidation.safeParse(unsafeBody);

  if (!bodyParseResult.success) {
    return NextResponse.json({ message: `Body inválido: ${bodyParseResult.error.message}` }, { status: 400 });
  }

  const safeBody = bodyParseResult.data;
  const uaParser = new UAParser(request.headers.get('user-agent') ?? '');
  const { browser, cpu, device, engine, os } = uaParser.getResult();

  console.log(
    `safeBody.referrer: "${safeBody.referrer}"; request.referrer: "${
      request.referrer
    }"; request.headers.get("referrer"): "${request.headers.get('referrer')}"`
  );

  const pageViewObject: PageViewEventInput = {
    type: safeBody.type,
    request_path: safeBody.request_path,
    session_id: safeBody.session_id,
    timestamp_utc: new Date().toISOString(),
    country: request.headers.get('X-Vercel-IP-Country') ?? undefined,
    browser: browser.name,
    browser_version: browser.version,
    engine: engine.name,
    engine_version: engine.version,
    os: os.name,
    os_version: os.version,
    device: device.type,
    device_vendor: device.vendor,
    device_model: device.model,
    cpu_architecture: cpu.architecture,
    referrer: safeBody.referrer,
    ip: ip.extractFromRequest(request) as string
  };

  try {
    await publishPageView(pageViewObject);
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
