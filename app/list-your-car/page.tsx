"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AuthModal from "@/app/components/auth-modal";
import {
  User, Car, ClipboardList, Camera, FileText, Target,
  MapPin, Star, ChevronRight, ChevronLeft, Check, Upload,
  AlertCircle, CheckCircle2, Loader2, X, CreditCard, Building2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type UploadContext = {
  firstName: string;
  lastName: string;
  year: string;
  make: string;
  model: string;
};

type FormData = {
  // Step 1
  firstName: string; lastName: string; phone: string; email: string;
  city: string; state: string; zipCode: string; isRegisteredOwner: string;
  // Step 2
  year: string; make: string; model: string; trim: string;
  color: string; vin: string; licensePlate: string; mileage: string;
  // Step 3
  titleStatus: string; accidentHistory: string; vehicleCondition: string;
  hasMechanicalIssues: string; mechanicalIssuesDescription: string;
  // Step 4 — map of label → Cloudinary URL
  photoUrls: Record<string, string>;
  // Step 5 — map of label → Cloudinary URL
  documentUrls: Record<string, string>;
  // Step 6
  listingReason: string[]; usageFrequency: string; availableDaysPerMonth: string;
  // Step 7
  pickupLocationType: string; streetAddress: string; locationZip: string;
  // Step 8
  hasGps: boolean; hasCarplay: boolean; hasAndroidAuto: boolean;
  hasBackupCamera: boolean; hasLeatherSeats: boolean; hasSunroof: boolean;
  hasThirdRow: boolean; fleetInterest: string[];
  // Step 9
  paymentMethod: string;
  bankName: string;
  accountHolderName: string;
  routingNumber: string;
  accountNumber: string;
  accountType: string;
};

const initialForm: FormData = {
  firstName: "", lastName: "", phone: "", email: "",
  city: "", state: "", zipCode: "", isRegisteredOwner: "",
  year: "", make: "", model: "", trim: "",
  color: "", vin: "", licensePlate: "", mileage: "",
  titleStatus: "", accidentHistory: "", vehicleCondition: "",
  hasMechanicalIssues: "", mechanicalIssuesDescription: "",
  photoUrls: {}, documentUrls: {},
  listingReason: [], usageFrequency: "", availableDaysPerMonth: "",
  pickupLocationType: "", streetAddress: "", locationZip: "",
  hasGps: false, hasCarplay: false, hasAndroidAuto: false,
  hasBackupCamera: false, hasLeatherSeats: false, hasSunroof: false,
  hasThirdRow: false, fleetInterest: [],
  paymentMethod: "direct_deposit",
  bankName: "", accountHolderName: "", routingNumber: "",
  accountNumber: "", accountType: "",
};

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Owner", icon: User },
  { label: "Vehicle", icon: Car },
  { label: "Condition", icon: ClipboardList },
  { label: "Photos", icon: Camera },
  { label: "Documents", icon: FileText },
  { label: "Goals", icon: Target },
  { label: "Location", icon: MapPin },
  { label: "Features", icon: Star },
  { label: "Payment", icon: CreditCard },
];

// ─── Shared UI ────────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-400">
      {children}
    </label>
  );
}

function TextInput({
  label, placeholder, value, onChange, type = "text", required = true,
}: {
  label: string; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div>
      <FieldLabel>{label}{required && <span className="ml-1 text-red-500">*</span>}</FieldLabel>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
      />
    </div>
  );
}

function RadioCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
        selected
          ? "border-red-500 bg-red-500/10 text-white"
          : "border-white/10 bg-white/3 text-zinc-400 hover:border-white/20 hover:text-white"
      }`}
    >
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected ? "border-red-500 bg-red-500" : "border-zinc-600"}`}>
        {selected && <Check size={10} className="text-white" />}
      </span>
      {label}
    </button>
  );
}

function CheckCard({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
        checked
          ? "border-red-500 bg-red-500/10 text-white"
          : "border-white/10 bg-white/3 text-zinc-400 hover:border-white/20 hover:text-white"
      }`}
    >
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border ${checked ? "border-red-500 bg-red-500" : "border-zinc-600"}`}>
        {checked && <Check size={10} className="text-white" />}
      </span>
      {label}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-red-500">{children}</h3>;
}

// ─── File Upload Zone ─────────────────────────────────────────────────────────
// Uploads immediately to Cloudinary via /api/upload.
// public_id = toyou-listings/{first-last}/{year-make-model}/{label-slug}

type UploadState = "idle" | "uploading" | "done" | "error";

function FileUploadZone({
  label, accept, required = true, uploadedUrl, onUpload, context,
}: {
  label: string;
  accept: string;
  required?: boolean;
  uploadedUrl: string;
  onUpload: (url: string) => void;
  context: UploadContext;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>(uploadedUrl ? "done" : "idle");
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setState("uploading");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("file", file);
    fd.append("firstName", context.firstName);
    fd.append("lastName", context.lastName);
    fd.append("year", context.year);
    fd.append("make", context.make);
    fd.append("model", context.model);
    fd.append("label", label);
    fd.append("index", "0");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onUpload(data.url);
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setState("error");
    }

    // reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleClear = () => {
    setState("idle");
    setFileName("");
    setErrorMsg("");
    onUpload("");
  };

  return (
    <div>
      <FieldLabel>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </FieldLabel>

      {state === "done" ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Check size={14} className="shrink-0 text-green-400" />
            <span className="truncate text-xs text-green-400">{fileName || "Uploaded"}</span>
          </div>
          <button type="button" onClick={handleClear} className="shrink-0 text-zinc-500 hover:text-white transition-colors">
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={state === "uploading"}
          className={`flex w-full flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-5 text-center transition-all ${
            state === "error"
              ? "border-red-500/40 bg-red-500/5"
              : "border-white/15 bg-white/2 hover:border-red-500/40 hover:bg-red-500/5"
          } disabled:pointer-events-none`}
        >
          {state === "uploading" ? (
            <>
              <Loader2 size={18} className="animate-spin text-zinc-400" />
              <span className="text-xs text-zinc-400">Uploading…</span>
            </>
          ) : state === "error" ? (
            <>
              <AlertCircle size={18} className="text-red-400" />
              <span className="text-xs text-red-400">{errorMsg}</span>
              <span className="text-[10px] text-zinc-500">Click to retry</span>
            </>
          ) : (
            <>
              <Upload size={18} className="text-zinc-500" />
              <span className="text-xs text-zinc-500">Click to select</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

// ─── Individual Steps ─────────────────────────────────────────────────────────

function Step1({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput label="First Name" value={form.firstName} onChange={(v) => set("firstName", v)} />
        <TextInput label="Last Name" value={form.lastName} onChange={(v) => set("lastName", v)} />
        <TextInput label="Phone Number" type="tel" value={form.phone} onChange={(v) => set("phone", v)} />
        <TextInput label="Email Address" type="email" value={form.email} onChange={(v) => set("email", v)} />
        <TextInput label="City" value={form.city} onChange={(v) => set("city", v)} />
        <TextInput label="State" value={form.state} onChange={(v) => set("state", v)} />
        <TextInput label="ZIP Code" value={form.zipCode} onChange={(v) => set("zipCode", v)} />
      </div>
      <div>
        <FieldLabel>Are you the registered owner?<span className="ml-1 text-red-500">*</span></FieldLabel>
        <div className="flex gap-3">
          <RadioCard label="Yes" selected={form.isRegisteredOwner === "yes"} onClick={() => set("isRegisteredOwner", "yes")} />
          <RadioCard label="No" selected={form.isRegisteredOwner === "no"} onClick={() => set("isRegisteredOwner", "no")} />
        </div>
        {form.isRegisteredOwner === "no" && (
          <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            An owner authorization form will be required during the review process. Our team will contact you.
          </div>
        )}
      </div>
    </div>
  );
}

function Step2({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const years = Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel>Year<span className="ml-1 text-red-500">*</span></FieldLabel>
          <select
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all"
          >
            <option value="">Select year</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <TextInput label="Make" placeholder="e.g. Toyota" value={form.make} onChange={(v) => set("make", v)} />
        <TextInput label="Model" placeholder="e.g. Camry" value={form.model} onChange={(v) => set("model", v)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput label="Trim" placeholder="e.g. SE, XLE" value={form.trim} onChange={(v) => set("trim", v)} required={false} />
        <TextInput label="Color" placeholder="e.g. Midnight Black" value={form.color} onChange={(v) => set("color", v)} />
      </div>
      <TextInput label="VIN Number" placeholder="17-character VIN" value={form.vin} onChange={(v) => set("vin", v)} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput label="License Plate Number" value={form.licensePlate} onChange={(v) => set("licensePlate", v)} />
        <TextInput label="Current Mileage" type="number" placeholder="e.g. 42000" value={form.mileage} onChange={(v) => set("mileage", v)} />
      </div>
    </div>
  );
}

function Step3({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Title Status</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["Clean Title", "Rebuilt", "Salvage", "Other"].map((opt) => (
            <RadioCard key={opt} label={opt} selected={form.titleStatus === opt} onClick={() => set("titleStatus", opt)} />
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Accident History</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["Never involved in accident", "Minor accident", "Major accident"].map((opt) => (
            <RadioCard key={opt} label={opt} selected={form.accidentHistory === opt} onClick={() => set("accidentHistory", opt)} />
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Vehicle Condition</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {["Excellent", "Good", "Fair"].map((opt) => (
            <RadioCard key={opt} label={opt} selected={form.vehicleCondition === opt} onClick={() => set("vehicleCondition", opt)} />
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>Current Mechanical Issues?</SectionTitle>
        <div className="flex gap-3">
          <RadioCard label="No" selected={form.hasMechanicalIssues === "no"} onClick={() => set("hasMechanicalIssues", "no")} />
          <RadioCard label="Yes" selected={form.hasMechanicalIssues === "yes"} onClick={() => set("hasMechanicalIssues", "yes")} />
        </div>
        {form.hasMechanicalIssues === "yes" && (
          <div className="mt-3">
            <FieldLabel>Please explain the issue(s)<span className="ml-1 text-red-500">*</span></FieldLabel>
            <textarea
              rows={3}
              value={form.mechanicalIssuesDescription}
              onChange={(e) => set("mechanicalIssuesDescription", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/4 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/10 transition-all resize-none"
              placeholder="Describe the current mechanical issues..."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Step4({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const ctx: UploadContext = {
    firstName: form.firstName, lastName: form.lastName,
    year: form.year, make: form.make, model: form.model,
  };

  const handleUpload = (label: string) => (url: string) => {
    set("photoUrls", { ...form.photoUrls, [label]: url });
  };

  const uploadedCount = Object.values(form.photoUrls).filter(Boolean).length;

  const photoSlot = (label: string) => (
    <FileUploadZone
      key={label}
      label={label}
      accept="image/*"
      uploadedUrl={form.photoUrls[label] || ""}
      onUpload={handleUpload(label)}
      context={ctx}
    />
  );

  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Exterior Photos</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["Front", "Rear", "Driver Side", "Passenger Side"].map(photoSlot)}
        </div>
      </div>
      <div>
        <SectionTitle>Interior Photos</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {["Dashboard", "Front Seats", "Rear Seats"].map(photoSlot)}
        </div>
      </div>
      <div>
        <SectionTitle>Additional Photos</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {["Wheels", "Trunk", "Engine Bay"].map(photoSlot)}
        </div>
      </div>
      <p className="text-xs text-zinc-500">
        We recommend at least 10 clear photos. Listings with more photos typically perform better.
      </p>
      {uploadedCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-xs text-green-400">
          <Check size={14} />
          {uploadedCount} of 10 photos uploaded to Cloudinary
        </div>
      )}
    </div>
  );
}

function Step5({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const ctx: UploadContext = {
    firstName: form.firstName, lastName: form.lastName,
    year: form.year, make: form.make, model: form.model,
  };

  const handleUpload = (label: string) => (url: string) => {
    set("documentUrls", { ...form.documentUrls, [label]: url });
  };

  const uploadedCount = Object.values(form.documentUrls).filter(Boolean).length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {["Vehicle Registration", "Insurance Card", "Driver's License"].map((label) => (
          <FileUploadZone
            key={label}
            label={label}
            accept=".pdf,.jpg,.jpeg,.png"
            uploadedUrl={form.documentUrls[label] || ""}
            onUpload={handleUpload(label)}
            context={ctx}
          />
        ))}
        <FileUploadZone
          label="Vehicle Title"
          accept=".pdf,.jpg,.jpeg,.png"
          required={false}
          uploadedUrl={form.documentUrls["Vehicle Title"] || ""}
          onUpload={handleUpload("Vehicle Title")}
          context={ctx}
        />
      </div>
      {uploadedCount > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-xs text-green-400">
          <Check size={14} />
          {uploadedCount} document{uploadedCount !== 1 ? "s" : ""} uploaded to Cloudinary
        </div>
      )}
    </div>
  );
}

function Step6({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const toggleReason = (reason: string) => {
    const current = form.listingReason;
    set("listingReason", current.includes(reason) ? current.filter((r) => r !== reason) : [...current, reason]);
  };
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Why are you listing your vehicle?</SectionTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {["Side income", "Extra cash flow", "Vehicle not being used", "Full-time rental income", "Business fleet"].map((reason) => (
            <CheckCard key={reason} label={reason} checked={form.listingReason.includes(reason)} onChange={() => toggleReason(reason)} />
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>How often do you currently use the vehicle?</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {["Daily", "Weekly", "Monthly", "Rarely", "Almost Never"].map((opt) => (
            <RadioCard key={opt} label={opt} selected={form.usageFrequency === opt} onClick={() => set("usageFrequency", opt)} />
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>How many days per month would you like it available?</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {["1–10 days", "11–20 days", "21–30 days"].map((opt) => (
            <RadioCard key={opt} label={opt} selected={form.availableDaysPerMonth === opt} onClick={() => set("availableDaysPerMonth", opt)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step7({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Pickup Location Type</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {["Home", "Business", "Airport Delivery Available", "Other"].map((opt) => (
            <RadioCard key={opt} label={opt} selected={form.pickupLocationType === opt} onClick={() => set("pickupLocationType", opt)} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput label="Street Address" value={form.streetAddress} onChange={(v) => set("streetAddress", v)} />
        <TextInput label="ZIP Code" value={form.locationZip} onChange={(v) => set("locationZip", v)} />
      </div>
    </div>
  );
}

function Step8({ form, set }: { form: FormData; set: (k: keyof FormData, v: unknown) => void }) {
  const toggleFleet = (opt: string) => {
    const current = form.fleetInterest;
    set("fleetInterest", current.includes(opt) ? current.filter((f) => f !== opt) : [...current, opt]);
  };
  const features: { label: string; key: keyof FormData }[] = [
    { label: "GPS Tracking", key: "hasGps" },
    { label: "Apple CarPlay", key: "hasCarplay" },
    { label: "Android Auto", key: "hasAndroidAuto" },
    { label: "Backup Camera", key: "hasBackupCamera" },
    { label: "Leather Seats", key: "hasLeatherSeats" },
    { label: "Sunroof", key: "hasSunroof" },
    { label: "Third Row Seating", key: "hasThirdRow" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <SectionTitle>Does your vehicle have?</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {features.map(({ label, key }) => (
            <CheckCard key={key} label={label} checked={form[key] as boolean} onChange={() => set(key, !form[key])} />
          ))}
        </div>
      </div>
      <div>
        <SectionTitle>How many vehicles are you interested in listing?</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {["Listing 1 vehicle", "Listing 2–5 vehicles", "Listing 6–10 vehicles", "Listing 10+ vehicles"].map((opt) => (
            <CheckCard key={opt} label={opt} checked={form.fleetInterest.includes(opt)} onChange={() => toggleFleet(opt)} />
          ))}
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Selecting multiple options helps us match you with the right fleet partnership program.
        </p>
      </div>
    </div>
  );
}

function Step9({
  form,
  set,
  hostPct,
  delayDays,
}: {
  form: FormData;
  set: (k: keyof FormData, v: unknown) => void;
  hostPct: number;
  delayDays: number;
}) {
  return (
    <div className="space-y-6">
      {/* Payout info banner */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4">
        <div className="flex items-start gap-3">
          <Building2 size={16} className="mt-0.5 shrink-0 text-red-400" />
          <div className="text-xs leading-relaxed text-red-300">
            <strong className="block mb-1 text-red-200">Payment Information</strong>
            You keep <strong>{hostPct}%</strong> of all rental revenue. Payments are issued via
            direct deposit <strong>{delayDays} day{delayDays !== 1 ? "s" : ""} after the rental vehicle is returned</strong> to the host.
          </div>
        </div>
      </div>

      {/* Payment method — currently only direct deposit */}
      <div>
        <SectionTitle>Payment Method</SectionTitle>
        <div className="flex gap-3">
          <RadioCard
            label="Direct Deposit (ACH)"
            selected={form.paymentMethod === "direct_deposit"}
            onClick={() => set("paymentMethod", "direct_deposit")}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-600">Additional payment methods coming soon.</p>
      </div>

      {/* Direct deposit fields */}
      {form.paymentMethod === "direct_deposit" && (
        <div className="space-y-4">
          <SectionTitle>Bank Account Details (US Only)</SectionTitle>

          <TextInput
            label="Account Holder Name"
            placeholder="Full legal name on the account"
            value={form.accountHolderName}
            onChange={(v) => set("accountHolderName", v)}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Bank Name"
              placeholder="e.g. Chase, Bank of America"
              value={form.bankName}
              onChange={(v) => set("bankName", v)}
            />
            <div>
              <FieldLabel>
                Account Type<span className="ml-1 text-red-500">*</span>
              </FieldLabel>
              <div className="flex gap-3">
                <RadioCard
                  label="Checking"
                  selected={form.accountType === "checking"}
                  onClick={() => set("accountType", "checking")}
                />
                <RadioCard
                  label="Savings"
                  selected={form.accountType === "savings"}
                  onClick={() => set("accountType", "savings")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Routing Number"
              placeholder="9-digit ABA routing number"
              value={form.routingNumber}
              onChange={(v) => set("routingNumber", v)}
            />
            <TextInput
              label="Account Number"
              placeholder="Your bank account number"
              value={form.accountNumber}
              onChange={(v) => set("accountNumber", v)}
            />
          </div>

          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertCircle size={13} className="mt-0.5 shrink-0 text-amber-400" />
              <p className="text-xs leading-relaxed text-amber-300">
                Your banking details are encrypted and stored securely. They are only used to
                process your rental earnings via ACH direct deposit.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step validation ──────────────────────────────────────────────────────────

function isStepValid(step: number, form: FormData): boolean {
  switch (step) {
    case 0: return !!(form.firstName && form.lastName && form.phone && form.email && form.city && form.state && form.zipCode && form.isRegisteredOwner);
    case 1: return !!(form.year && form.make && form.model && form.color && form.vin && form.licensePlate && form.mileage);
    case 2: return !!(form.titleStatus && form.accidentHistory && form.vehicleCondition && form.hasMechanicalIssues && (form.hasMechanicalIssues === "no" || form.mechanicalIssuesDescription));
    case 3: return true;
    case 4: return true;
    case 5: return !!(form.listingReason.length > 0 && form.usageFrequency && form.availableDaysPerMonth);
    case 6: return !!(form.pickupLocationType && form.streetAddress && form.locationZip);
    case 7: return true;
    case 8: return !!(
      form.paymentMethod &&
      form.accountHolderName &&
      form.bankName &&
      form.accountType &&
      form.routingNumber.length === 9 &&
      form.accountNumber
    );
    default: return true;
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function ListYourCarPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hostPct, setHostPct] = useState(80);
  const [delayDays, setDelayDays] = useState(3);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    fetch("/api/profit-split")
      .then((r) => r.json())
      .then((data) => {
        if (data?.host_percentage) setHostPct(data.host_percentage);
        if (data?.payment_delay_days) setDelayDays(data.payment_delay_days);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        const authenticated = r.ok;
        setIsAuthenticated(authenticated);
        if (!authenticated) setShowAuthModal(true);
      })
      .catch(() => { setIsAuthenticated(false); setShowAuthModal(true); });
  }, []);

  const setField = (key: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => { setDirection(1); setStep((s) => s + 1); };
  const goBack = () => { setDirection(-1); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Serialise Cloudinary URL maps → comma-separated strings for the API
      const photoFiles = Object.entries(form.photoUrls)
        .filter(([, url]) => url)
        .map(([label, url]) => `${label}: ${url}`)
        .join(", ");
      const documentFiles = Object.entries(form.documentUrls)
        .filter(([, url]) => url)
        .map(([label, url]) => `${label}: ${url}`)
        .join(", ");

      const res = await fetch("/api/vehicle-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName, lastName: form.lastName,
          phone: form.phone, email: form.email,
          city: form.city, state: form.state, zipCode: form.zipCode,
          isRegisteredOwner: form.isRegisteredOwner === "yes",
          year: form.year, make: form.make, model: form.model, trim: form.trim,
          color: form.color, vin: form.vin, licensePlate: form.licensePlate, mileage: form.mileage,
          titleStatus: form.titleStatus, accidentHistory: form.accidentHistory,
          vehicleCondition: form.vehicleCondition,
          hasMechanicalIssues: form.hasMechanicalIssues === "yes",
          mechanicalIssuesDescription: form.mechanicalIssuesDescription,
          photoFiles, documentFiles,
          listingReason: form.listingReason,
          usageFrequency: form.usageFrequency,
          availableDaysPerMonth: form.availableDaysPerMonth,
          pickupLocationType: form.pickupLocationType,
          streetAddress: form.streetAddress, locationZip: form.locationZip,
          hasGps: form.hasGps, hasCarplay: form.hasCarplay,
          hasAndroidAuto: form.hasAndroidAuto, hasBackupCamera: form.hasBackupCamera,
          hasLeatherSeats: form.hasLeatherSeats, hasSunroof: form.hasSunroof,
          hasThirdRow: form.hasThirdRow, fleetInterest: form.fleetInterest,
          paymentMethod: form.paymentMethod,
          bankName: form.bankName,
          accountHolderName: form.accountHolderName,
          routingNumber: form.routingNumber,
          accountNumber: form.accountNumber,
          accountType: form.accountType,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }
      const data = await res.json();
      setReferenceNumber(data.referenceNumber);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepProps = { form, set: setField };
  const stepContent = [
    <Step1 {...stepProps} />, <Step2 {...stepProps} />, <Step3 {...stepProps} />,
    <Step4 {...stepProps} />, <Step5 {...stepProps} />, <Step6 {...stepProps} />,
    <Step7 {...stepProps} />, <Step8 {...stepProps} />,
    <Step9 {...stepProps} hostPct={hostPct} delayDays={delayDays} />,
  ];

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-lg text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 size={40} className="text-green-400" />
          </div>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-white">Application Received!</h1>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400">
            Thank you for applying to become a ToYou host. A confirmation has been sent to{" "}
            <strong className="text-white">{form.email}</strong>. Our team will review your submission within 72 hours.
          </p>
          <div className="mb-8 rounded-2xl border border-white/8 bg-white/3 px-8 py-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">Reference Number</p>
            <p className="text-3xl font-black tracking-widest text-white">{referenceNumber}</p>
            <p className="mt-2 text-xs text-zinc-600">Save this number for any follow-up inquiries</p>
          </div>
          <div className="mb-8 rounded-xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-left text-xs leading-relaxed text-amber-300">
            <strong className="block mb-1">What happens next?</strong>
            Our team will review your vehicle details and may contact you within 72 hours for any additional information before approving your listing.
          </div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-100">
            Return to Home
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 pb-24 pt-32 text-white">
      <div className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-red-400">
            Become a ToYou Host
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">List Your Vehicle</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Earn passive income from your vehicle. Complete all steps and our team will review your application within 72 hours.
          </p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 backdrop-blur-sm">
            <span className="text-sm font-black text-red-400">{hostPct}:{100 - hostPct} Profit Split</span>
            <span className="text-zinc-600">—</span>
            <span className="text-sm text-zinc-400">
              You keep <strong className="text-white">{hostPct}%</strong> of all rental revenue
            </span>
          </div>
        </motion.div>

        {/* Step indicator */}
        <div className="mb-10 flex items-center justify-between gap-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-all ${done ? "bg-red-600 text-white" : active ? "border-2 border-red-500 bg-red-500/10 text-red-400" : "border border-white/10 bg-white/3 text-zinc-600"}`}>
                  {done ? <Check size={13} /> : <Icon size={13} />}
                </div>
                <span className={`hidden text-[9px] font-semibold uppercase tracking-wider sm:block ${active ? "text-red-400" : done ? "text-zinc-400" : "text-zinc-700"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mb-8 h-px w-full bg-white/6">
          <motion.div
            className="h-full bg-red-600"
            animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Form card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-zinc-900/50 p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            {(() => { const Icon = STEPS[step].icon; return <Icon size={18} className="text-red-500" />; })()}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">Step {step + 1} of {STEPS.length}</p>
              <h2 className="text-lg font-bold text-white">
                {["Owner Information","Vehicle Information","Vehicle Condition","Photo Uploads","Document Uploads","Owner Goals","Vehicle Location","Final Questions","Payment Details"][step]}
              </h2>
            </div>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle size={15} />
              {error}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-400 transition-all hover:border-white/20 hover:text-white disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft size={16} /> Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!isStepValid(step, form)}
              className="flex items-center gap-2 rounded-full bg-red-600 px-7 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)] disabled:pointer-events-none disabled:opacity-40"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-red-600 px-8 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 hover:shadow-[0_4px_20px_rgba(220,38,38,0.3)] disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Submitting…</> : <>Submit Application <ChevronRight size={16} /></>}
            </button>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        intent="list"
      />
    </main>
  );
}
