import { NextResponse } from "next/server";
import { getProfitSplitConfig } from "@/server/db/queries";

export async function GET() {
  const config = await getProfitSplitConfig();
  return NextResponse.json(config);
}
