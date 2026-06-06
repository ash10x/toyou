import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import { getFaqs, createFaq } from "@/server/db/queries";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await getFaqs();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  if (!body.question || !body.answer || !body.category) {
    return NextResponse.json({ error: "question, answer, and category are required" }, { status: 400 });
  }
  const faq = await createFaq({ question: body.question, answer: body.answer, category: body.category });
  return NextResponse.json(faq, { status: 201 });
}
