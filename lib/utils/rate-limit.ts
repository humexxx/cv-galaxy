import { NextRequest, NextResponse } from "next/server";

interface Bucket {
  count: number;
  resetAt: number;
}

// Per-instance only. On serverless this means the effective limit scales with
// the number of warm lambdas — enough to stop casual abuse, not a hard quota.
const buckets = new Map<string, Bucket>();

function clientKey(request: NextRequest, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]!.trim()
    : request.headers.get("x-real-ip") ?? "unknown";
  return `${scope}:${ip}`;
}

export function rateLimit(
  request: NextRequest,
  { scope, limit, windowMs }: { scope: string; limit: number; windowMs: number }
): NextResponse | null {
  const now = Date.now();
  const key = clientKey(request, scope);

  for (const [k, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(k);
  }

  const existing = buckets.get(key);
  const bucket =
    existing && existing.resetAt > now
      ? existing
      : { count: 0, resetAt: now + windowMs };

  bucket.count += 1;
  buckets.set(key, bucket);

  if (bucket.count > limit) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "RateLimit-Limit": String(limit),
          "RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}
