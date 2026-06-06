import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import { updateFaq, deleteFaqById } from "@/server/db/queries";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const updated = await updateFaq(Number(id), {
    question: body.question,
    answer: body.answer,
    category: body.category,
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteFaqById(Number(id));
  return NextResponse.json({ success: true });
}
