import { NextResponse } from "next/server";
import { getCars } from "../../../server/db/queries";

export async function GET() {
  try {
    const cars = await getCars();
    return NextResponse.json({ cars });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
