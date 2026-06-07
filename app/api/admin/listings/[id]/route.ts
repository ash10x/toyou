import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/server/admin-auth";
import {
  getListingById,
  updateListingStatus,
  deleteListingById,
  createCarFromListing,
  extractFirstPhotoUrl,
} from "@/server/db/queries";
import {
  sendListingApprovedEmail,
  sendListingRejectedEmail,
} from "@/server/email";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const listing = await getListingById(Number(id));
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(listing);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { status, dailyRate, rejectionReason } = body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const listing = await getListingById(Number(id));
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await updateListingStatus(Number(id), status);

  if (status === "approved") {
    const rate = Number(dailyRate) || 0;
    const vehicleName = `${listing.year} ${listing.make} ${listing.model}${listing.trim ? ` ${listing.trim}` : ""}`;
    const imageUrl = extractFirstPhotoUrl(listing.photo_files);

    // Await car creation so it completes before the response is sent
    await createCarFromListing({
      name: vehicleName,
      image: imageUrl,
      price: rate,
      seats: listing.seats,
      fuel: listing.fuel,
      body: listing.body,
      transmission: listing.transmission,
    });

    // Email is non-critical — fire-and-forget is fine
    sendListingApprovedEmail(
      listing.first_name,
      listing.email,
      listing.year,
      listing.make,
      listing.model,
      listing.reference_number,
      rate,
    ).catch(console.error);
  }

  if (status === "rejected") {
    sendListingRejectedEmail(
      listing.first_name,
      listing.email,
      listing.year,
      listing.make,
      listing.model,
      listing.reference_number,
      rejectionReason || undefined,
    ).catch(console.error);
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = request.cookies.get(SESSION_COOKIE)?.value ?? "";
  const valid = await verifySessionToken(token);
  if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteListingById(Number(id));
  return NextResponse.json({ success: true });
}
