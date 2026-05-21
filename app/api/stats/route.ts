import { NextResponse } from "next/server";
import { getStats } from "../../../server/db/queries";

export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json({ stats });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
