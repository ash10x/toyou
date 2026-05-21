import { NextResponse } from "next/server";
import { getFeaturedCars } from "../../../server/db/queries";

export async function GET() {
  try {
    const featured = await getFeaturedCars();
    return NextResponse.json({ featured });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
