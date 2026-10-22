import { NextResponse } from 'next/server';

export async function GET() {
  const defaultFingerprint = '27:62:5E:71:2E:01:07:8D:A2:AF:E6:05:17:55:5C:DD:21:D4:D0:BA:2C:FE:2B:51:73:23:D2:04:71:94:A5:7B';
  
  // Support optional environment variable if extra fingerprints are added later
  const envFingerprints = process.env.TWA_SHA256_FINGERPRINTS
    ? process.env.TWA_SHA256_FINGERPRINTS.split(',').map((fp) => fp.trim())
    : [];

  const fingerprints = Array.from(new Set([defaultFingerprint, ...envFingerprints]));

  const assetlinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'app.vercel.portflio_akar_pro.twa',
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ];

  return NextResponse.json(assetlinks, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
