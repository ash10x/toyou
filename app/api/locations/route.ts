import { NextResponse } from "next/server";
import { getLocations } from "../../../server/db/queries";

export async function GET() {
  try {
    const locations = await getLocations();
    return NextResponse.json({ locations });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
