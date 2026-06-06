import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import { getProfitSplitConfig, upsertProfitSplitConfig } from "@/server/db/queries";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const config = await getProfitSplitConfig();
  return NextResponse.json(config);
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const host = Number(body.host_percentage);
  const platform = Number(body.platform_percentage);
  const delay = Number(body.payment_delay_days);

  if (
    isNaN(host) || isNaN(platform) || isNaN(delay) ||
    host < 0 || host > 100 ||
    platform < 0 || platform > 100 ||
    host + platform !== 100 ||
    delay < 0
  ) {
    return NextResponse.json(
      { error: "Invalid values. host + platform must equal 100." },
      { status: 400 }
    );
  }

  const updated = await upsertProfitSplitConfig({
    host_percentage: host,
    platform_percentage: platform,
    payment_delay_days: delay,
  });
  return NextResponse.json(updated);
}
