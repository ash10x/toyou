import { NextRequest, NextResponse } from "next/server";
import { createVehicleListing } from "@/server/db/queries";
import {
  sendListingConfirmationEmail,
  sendAdminListingNotificationEmail,
} from "@/server/email";
import { verifySessionToken as verifyPortalSession, PORTAL_COOKIE } from "@/server/portal-auth";

function generateReferenceNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TY-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const {
      firstName, lastName, phone, email, city, state, zipCode, isRegisteredOwner,
      year, make, model, trim, color, vin, licensePlate, mileage,
      seats, fuel, body, transmission,
      titleStatus, accidentHistory, vehicleCondition, hasMechanicalIssues, mechanicalIssuesDescription,
      photoFiles, documentFiles,
      listingReason, usageFrequency, availableDaysPerMonth,
      pickupLocationType, streetAddress, locationZip,
      hasGps, hasCarplay, hasAndroidAuto, hasBackupCamera, hasLeatherSeats, hasSunroof, hasThirdRow,
      fleetInterest,
      paymentMethod, bankName, accountHolderName, routingNumber, accountNumber, accountType,
    } = payload;

    const required = [
      firstName, lastName, phone, email, city, state, zipCode,
      year, make, model, color, vin, licensePlate,
      titleStatus, accidentHistory, vehicleCondition,
      listingReason, usageFrequency, availableDaysPerMonth,
      pickupLocationType, streetAddress, locationZip,
    ];

    if (required.some((v) => !v) || isRegisteredOwner === undefined || hasMechanicalIssues === undefined || !mileage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Attach portal user_id if logged in as hoster
    const portalToken = request.cookies.get(PORTAL_COOKIE)?.value ?? "";
    const portalSession = await verifyPortalSession(portalToken);
    const userId = portalSession?.role === "hoster" ? portalSession.userId : undefined;

    const referenceNumber = generateReferenceNumber();
    const reviewExpiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);

    const listing = await createVehicleListing({
      reference_number: referenceNumber,
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      city,
      state,
      zip_code: zipCode,
      is_registered_owner: isRegisteredOwner,
      year,
      make,
      model,
      trim: trim || undefined,
      color,
      vin,
      license_plate: licensePlate,
      mileage: Number(mileage),
      seats: seats != null ? Number(seats) : undefined,
      fuel: fuel || undefined,
      body: body || undefined,
      transmission: transmission || undefined,
      title_status: titleStatus,
      accident_history: accidentHistory,
      vehicle_condition: vehicleCondition,
      has_mechanical_issues: hasMechanicalIssues,
      mechanical_issues_description: mechanicalIssuesDescription || undefined,
      photo_files: photoFiles || "",
      document_files: documentFiles || "",
      listing_reason: Array.isArray(listingReason) ? listingReason.join(", ") : listingReason,
      usage_frequency: usageFrequency,
      available_days_per_month: availableDaysPerMonth,
      pickup_location_type: pickupLocationType,
      street_address: streetAddress,
      location_zip: locationZip,
      has_gps: !!hasGps,
      has_carplay: !!hasCarplay,
      has_android_auto: !!hasAndroidAuto,
      has_backup_camera: !!hasBackupCamera,
      has_leather_seats: !!hasLeatherSeats,
      has_sunroof: !!hasSunroof,
      has_third_row: !!hasThirdRow,
      fleet_interest: Array.isArray(fleetInterest) ? fleetInterest.join(", ") : (fleetInterest || undefined),
      payment_method: paymentMethod || "direct_deposit",
      bank_name: bankName || undefined,
      account_holder_name: accountHolderName || undefined,
      routing_number: routingNumber || undefined,
      account_number: accountNumber || undefined,
      account_type: accountType || undefined,
      user_id: userId,
      review_expires_at: reviewExpiresAt,
    });

    await Promise.all([
      sendListingConfirmationEmail(firstName, email, referenceNumber, year, make, model, reviewExpiresAt),
      sendAdminListingNotificationEmail(firstName, lastName, email, phone, referenceNumber, year, make, model, vin, city, state, vehicleCondition),
    ]);

    return NextResponse.json(
      { success: true, referenceNumber, listing },
      { status: 201 },
    );
  } catch (error) {
    console.error("Vehicle listing error:", error);
    return NextResponse.json({ error: "Failed to submit listing" }, { status: 500 });
  }
}
