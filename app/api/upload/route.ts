import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const firstName = (formData.get("firstName") as string) || "unknown";
    const lastName = (formData.get("lastName") as string) || "user";
    const year = (formData.get("year") as string) || "";
    const make = (formData.get("make") as string) || "";
    const model = (formData.get("model") as string) || "";
    const label = (formData.get("label") as string) || "file";
    const index = (formData.get("index") as string) || "0";

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 500 });
    }

    // Build the public_id:  toyou-listings/{first-last}/{year-make-model}/{label}_{index}
    const ownerSlug = `${slugify(firstName)}-${slugify(lastName)}`;
    const vehicleSlug = [year, make, model].filter(Boolean).map(slugify).join("-");
    const labelSlug = slugify(label);
    const suffix = Number(index) > 0 ? `_${index}` : "";
    const publicId = `toyou-listings/${ownerSlug}/${vehicleSlug}/${labelSlug}${suffix}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              public_id: publicId,
              overwrite: true,
              resource_type: "auto",
              folder: undefined, // public_id already contains the folder path
            },
            (error, result) => {
              if (error || !result) reject(error ?? new Error("Upload failed"));
              else resolve(result as { secure_url: string; public_id: string });
            }
          )
          .end(buffer);
      }
    );

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
