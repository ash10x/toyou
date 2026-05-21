import { NextResponse } from "next/server";
import { getFaqs } from "../../../server/db/queries";

export async function GET() {
  try {
    const faqs = await getFaqs();
    return NextResponse.json({ faqs });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
