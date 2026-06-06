import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/server/db/queries";
import {
  sendBookingConfirmationEmail,
  sendAdminBookingNotificationEmail,
} from "@/server/email";
import { getCars } from "@/server/db/queries";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      car_id,
      full_name,
      email,
      phone,
      pickup_location,
      dropoff_location,
      pickup_date,
      dropoff_date,
      total_price,
    } = body;

    // Validation
    if (
      !car_id ||
      !full_name ||
      !email ||
      !phone ||
      !pickup_location ||
      !dropoff_location ||
      !pickup_date ||
      !dropoff_date ||
      total_price === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get car details
    const cars = await getCars();
    const car = cars.find((c) => c.id === car_id);

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    // Create booking
    const booking = await createBooking({
      car_id,
      full_name,
      email,
      phone,
      pickup_location,
      dropoff_location,
      pickup_date,
      dropoff_date,
      total_price,
    });

    // Send confirmation emails (fire-and-forget — never block or fail the booking)
    Promise.all([
      sendBookingConfirmationEmail(
        full_name,
        email,
        car.name,
        pickup_date,
        dropoff_date,
        pickup_location,
        dropoff_location,
        total_price,
      ),
      sendAdminBookingNotificationEmail(
        full_name,
        email,
        phone,
        car.name,
        pickup_date,
        dropoff_date,
        pickup_location,
        dropoff_location,
        total_price,
      ),
    ]).catch((err) => console.error("Booking email error:", err));

    return NextResponse.json(
      {
        success: true,
        booking,
        message: "Booking confirmed! Check your email.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
