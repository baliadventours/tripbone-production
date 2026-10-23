# Product Add-Ons: Global + Tour-Specific Direct Add-Ons Plan

## 1. Safety & Compatibility Assessment
Implementing **Tour-Specific (Direct) Add-Ons** alongside your existing **General (Global) Add-Ons** is **100% safe and non-breaking**:
- **How it works today**: Each `Tour` document stores `addOnIds: string[]` (referencing the `globalAddOns` collection from the **Tours → Add Ons** submenu) and a hydrated `addOns: AddOn[]` array snapshot that `Checkout.tsx` reads to render and calculate extras.
- **Why it won't break existing tours**: By introducing an optional `customAddOns?: AddOn[]` list on the tour editor and merging `[...selectedGlobalAddOns, ...customAddOns]` into `tour.addOns` whenever a tour is saved (plus runtime fallback resolution), all existing tours, bookings, invoices, manifests, and JSON Tour Exports/Imports remain 100% compatible.

---

## 2. Proposed Changes

### A. Data Model (`src/types.ts`)
- Extend the `Tour` interface with an optional `customAddOns?: AddOn[]` field so tour-specific add-ons are explicitly distinguished from global `addOnIds` when editing a tour, while `tour.addOns` continues to store the combined list of active add-ons (General + Tour-Specific) for the storefront and checkout.

### B. Tour Creation & Editor Page (`src/components/Admin/TourEditorForm.tsx` & `src/pages/Admin.tsx`)
1. **Enhanced "Add-ons" Tab in Tour Editor (`TourEditorForm.tsx`)**:
   - **Section 1 — General / Global Add-Ons**: Keep the existing one-click toggle grid for Global Add-ons created in the `Tours → Add Ons` submenu.
   - **Section 2 — Tour-Specific Direct Add-Ons**: Add a clean inline builder right below Global Add-ons where you can click **"+ Add Custom Tour Add-On"** and enter:
     - **Add-on Name** (e.g., *GoPro Underwater Camera*, *Private Drone Footage*, *Floating Breakfast Upgrade*)
     - **Price ($)** (numeric input)
     - **Pricing Unit** (`per person` or `per booking`)
     - **Description (Optional)** (short note explaining what is included in the extra)
   - **Quick-Access Shortcut in "Pricing & Pkgs" Tab**: Also include a compact link/section at the bottom of the **Pricing & Pkgs** tab so operators editing prices can add or review Tour-Specific Add-ons without having to switch tabs.
2. **Non-Destructive Save, Edit & Copy Logic (`Admin.tsx`)**:
   - **`handleSubmit`**: Hydrate selected `globalAddOns` from `formData.addOnIds`, sanitize `formData.customAddOns`, and save both `customAddOns` and the combined `addOns: [...selectedGlobalAddOns, ...validCustomAddOns]` array onto the `tours` document.
   - **`handleEdit`**: Load `tour.customAddOns` into the editor state. If a legacy/imported tour has items in `tour.addOns` that aren't in `globalAddOns`, automatically preserve them in `customAddOns` so they are never lost when updating the tour.
   - **`handleFastCopyContent`**: Allow copying add-ons (`addOnIds` and `customAddOns`) when duplicating content from another tour.

### C. Tour Detail Page & Booking Flow (`src/components/TourDetails/TourInfo.tsx`, `src/components/TourDetails/BookingForm.tsx`, `src/components/TourDetails/PriceSummaryModal.tsx`, `src/pages/TourDetail.tsx`, `src/pages/Checkout.tsx`)
1. **Optional Add-Ons Showcase on Tour Detail Page (`TourInfo.tsx` & Mobile `TourDetail.tsx`)**:
   - Display an **"Optional Add-Ons & Upgrades"** section on the Tour Detail page (when the tour has active General or Tour-Specific add-ons) showing each add-on's name, description, price, and unit (`per person` / `per booking`) so travelers see available upgrades while reading the tour details.
2. **Interactive Add-On Pre-Selection in Booking Widget & Price Summary (`BookingForm.tsx` & `PriceSummaryModal.tsx`)**:
   - Allow travelers to optionally toggle add-ons directly in the Booking Card / Price Summary Modal on the Tour Detail page and see the live itemized add-on total before clicking **Check availability**.
   - Pass any pre-selected add-ons via URL query param (`&addons=id1:qty,id2:qty`) into `/checkout/:tourId` so their choices are automatically pre-populated on Step 1 of Checkout.
3. **Unified Add-Ons Resolution in Checkout & Manual Booking (`Checkout.tsx` & `CreateManualBookingModal.tsx`)**:
   - Ensure `Checkout.tsx` and `CreateManualBookingModal.tsx` seamlessly display both Global Add-ons and Tour-Specific `customAddOns` (deduplicated by `id`), and pre-select any add-ons chosen on the Tour Detail page.

---

## 3. Verification Plan
- Run `lint_applet` and `compile_applet` to verify zero TypeScript or build errors.
- Verify that creating/editing a tour with both Global Add-ons and Direct Tour-Specific Add-ons saves cleanly, displays on the Tour Detail page, pre-selects into Checkout, and calculates totals accurately.
