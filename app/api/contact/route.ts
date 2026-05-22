import { NextRequest, NextResponse } from "next/server";
import { createContactMessage } from "../../../server/db/queries";
import {
  sendAdminNotificationEmail,
  sendContactConfirmationEmail,
} from "../../../server/email";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !isValidEmail(email) || !message) {
      return NextResponse.json(
        {
          error:
            "Invalid contact submission. Name, email, and message are required.",
        },
        { status: 400 },
      );
    }

    const contact = await createContactMessage({
      name,
      email,
      message,
    });

    await Promise.all([
      sendContactConfirmationEmail(name, email),
      sendAdminNotificationEmail(name, email, message, email),
    ]);

    return NextResponse.json(
      { success: true, contactId: contact.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact API error", error);
    return NextResponse.json(
      { error: "Unable to process your request at this time." },
      { status: 500 },
    );
  }
}
