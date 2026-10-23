---
name: tripbone_saas_architecture
description: Deep architecture, complete file & route map, multi-tenant rules, Car Rental & Tour modules, BYOPG payment gateway integration, Firestore data sanitization, cross-tenant GTM/GA scoping, and anti-regression standards for the Tripbone SaaS platform.
---

# Tripbone SaaS Architecture & Permanent Engineering Memory

This skill serves as the authoritative technical blueprint for the Tripbone SaaS codebase. Read this file whenever working on multi-file features, routing, database schemas, or tenant settings.

---

## 0. Surgical Edit & Anti-Regression Contract
1. **Never Replace Unrelated Code**: Always inspect the target file with `view_file` first and apply minimal, targeted edits with `replace_file_content` or `multi_replace_file_content`.
2. **Preserve Existing Features**: Do not remove existing buttons (e.g., Export JSON, Import JSON, Import from OTA, AI Tour Magic), sidebar navigation items, or Firestore fields unless explicitly instructed by the user.
3. **Dual-Mode Awareness (`src/App.tsx`)**:
   - **Master SaaS Context (`isMaster === true`)**: Serves the Tripbone B2B SaaS marketing site (`SaaSMarketing.tsx`), tenant onboarding/login (`SaaSHome.tsx`), SuperAdmin console (`SaaSSuperAdmin.tsx`), AppSumo redemption (`AppSumoRedeem.tsx`), and documentation (`DocsPage.tsx`, `PresentationSlidesPage.tsx`, `StoryboardPage.tsx`).
   - **Tenant Storefront Context (`isMaster === false`)**: Serves the individual tour/car-rental operator's website (`Home.tsx`, `Tours.tsx`, `TourDetail.tsx`, `CarRentals.tsx`, `Checkout.tsx`, `AIPlanner.tsx`, `BookingTracker.tsx`, `WaiverSigningPage.tsx`) and their Operator Admin Console (`Admin.tsx`).

---

## 1. Complete Codebase & Module Directory Map

### A. Public & Tenant Storefront Pages (`src/pages/`)
- `Home.tsx`: Tenant storefront homepage (supports multiple design presets including `default`, `joytime-special`, `luxury`, etc.).
- `Tours.tsx` & `TourDetail.tsx`: Tour catalog grid/filters and individual tour booking page with dynamic group pricing tiers, packages, add-ons, and date/time selectors.
- `CarRentals.tsx`: Private car rental & chauffeur storefront (`/rentals` and `/car-rental`), supporting `self_drive` vs `with_driver` pricing, delivery zones, and add-ons.
- `Checkout.tsx`: Unified checkout for both Tours and Car Rentals, supporting Universal BYOPG gateways, promo coupons, deposit vs. full payment, and multi-currency conversion.
- `BookingSuccess.tsx` & `BookingTracker.tsx`: Digital booking confirmation with scannable QR check-in voucher (`/booking-success/:id` and `/track-booking`).
- `AIPlanner.tsx`: Split-screen Gemini AI Trip Planner (`/planner`) with Google Maps routing and embedded live bookable tours from the tenant's catalog.
- `WaiverSigningPage.tsx`: Digital liability waiver signing (`/waiver/:bookingId` and `/sign-waiver/:templateId`).
- `ProposalView.tsx`: Interactive VIP custom itinerary quote viewer (`/proposal/:id`).

### B. Tenant Admin Console (`src/pages/Admin.tsx` & `src/components/Admin/`)
- **Overview**: `AdminDashboardOverview.tsx`, `SimpleAnalyticsDashboard.tsx`, `AnalyticsManager.tsx`.
- **Tour Management**:
  - `TourListing.tsx`: Grid/list view, single & bulk JSON Export (`handleExportSingleTour`, `handleExportAllTours`), JSON Import (`handleImportTours`), and TinyFish OTA Importer (`Modals/TinyFishTourImportModal.tsx`).
  - `TourEditorForm.tsx`: Multi-tab tour editor (General, Pricing & Packages, Itinerary, Media Gallery, Important Info, SEO).
  - `Modals/AdminAiModal.tsx`: AI Tour Magic generator.
  - `Modals/CopyTourModal.tsx`: Selective tour cloning.
- **Car Rental Module (`src/components/Admin/CarRental/`)**:
  - `CarRentalBookingManager.tsx`: Car rental reservation pipeline & status management.
  - `FleetManager.tsx`: Vehicle catalog management (`rental_vehicles` collection) with passenger/luggage specs, transmission, fuel type, daily/tiered rates, and driver options.
  - `RentalAutomations.tsx`: Automated WhatsApp/email reminders for vehicle pickup/return.
  - `RentalModuleSettings.tsx`: Delivery zones, security deposits, and rental terms.
- **Booking & Dispatch Operations**:
  - `BookingManager.tsx`, `BookingDetailModal.tsx`, `CreateManualBookingModal.tsx`, `BookingReports.tsx`.
  - `ImportBooking.tsx`: AI Email Booking Extractor (parses unstructured partner/OTA emails into verified bookings).
  - `Modals/AssignGuideModal.tsx`: Driver/Guide assignment and one-click WhatsApp dispatch.
- **Finance, Legal & CRM**:
  - `PaymentManager.tsx` & `PayoutManager.tsx`: Universal BYOPG configuration and supplier payouts.
  - `Invoice/InvoiceManager.tsx`: Custom B2B/VIP PDF invoice generator (`invoices` collection).
  - `Waiver/WaiverManager.tsx`: Digital waiver templates and signed waiver audit log (`waiver_templates`, `signed_waivers`).
- **Storefront Builder, Marketing & System**:
  - `WebsiteBuilder.tsx`: Theme presets, colors, typography, hero banners, and JoyTime preset customization.
  - `LandingPageGenerator.tsx` & `PageManager.tsx`: Custom CMS pages and AI landing pages.
  - `GeneralSettings.tsx`, `CustomDomainSettings.tsx`, `CommunicationManager.tsx`, `CouponManager.tsx`, `PopupManager.tsx`.
  - `BackupManager.tsx` & `DisasterRecoveryBackup.tsx`: Full and selective JSON/CSV database backup and restore.

---

## 2. Multi-Tenant Domain & Database Resolution

### Tenant Context Identification
- Every tenant operates on its own domain, custom domain, or preview subdomain (`?tenant=slug`).
- Identify active tenant context using `tenantId` from `useTenant()` or the fallback helper `getActiveTenantId()`.
- All Firestore documents in shared collections (`tours`, `rental_vehicles`, `bookings`, `coupons`, `reviews`, `blog`, `inquiries`, `invoices`, `waiver_templates`, `signed_waivers`) are logically isolated by the `tenantId` field.

### Dual-Document Firestore Storage Pattern for Payments
When reading or updating tenant payment configuration, always maintain dual-document backward compatibility:
- **Primary Document Path**: `paymentSettings/{tenantId}`
- **Legacy Fallback Path**: `settings/payment_{tenantId}`

```typescript
const activeId = tenantId || getActiveTenantId() || 'global';
let docSnap = await getDoc(doc(db, 'paymentSettings', activeId));
if (!docSnap.exists()) {
  docSnap = await getDoc(doc(db, 'settings', 'payment_' + activeId));
}
```

---

## 3. Universal BYOPG (Bring Your Own Payment Gateway) Architecture

### Multi-Gateway Enablement
Tripbone allows tenants to enable multiple payment gateways simultaneously:
- **Supported Gateways**: `stripe`, `midtrans`, `xendit`, `razorpay`, `adyen`, `paypal`, `bank_transfer`, `pay_on_arrival`.
- **Gateway Configuration Structure**:
  Stored in `tenantSettings.providerConfigs[providerId]` containing API keys, secret keys, webhook secrets, and `enabled` boolean state.

### Flat Boolean Flag Synchronization
To maintain backwards compatibility with legacy UI components, flat boolean flags must be derived and synchronized whenever settings are saved:

```typescript
const flatLegacyFields = {
  activeProviderId: updatedSettings.activeProviderId,
  providerConfigs: updatedSettings.providerConfigs,
  isStripeEnabled: updatedSettings.providerConfigs.stripe?.enabled ?? false,
  isMidtransEnabled: updatedSettings.providerConfigs.midtrans?.enabled ?? false,
  isXenditEnabled: updatedSettings.providerConfigs.xendit?.enabled ?? false,
  isRazorpayEnabled: updatedSettings.providerConfigs.razorpay?.enabled ?? false,
  isAdyenEnabled: updatedSettings.providerConfigs.adyen?.enabled ?? false,
  isPaypalEnabled: updatedSettings.providerConfigs.paypal?.enabled ?? false,
  creditCardEnabled: (updatedSettings.providerConfigs.paypal?.enabled || updatedSettings.providerConfigs.stripe?.enabled) ?? false,
  isBankTransferEnabled: updatedSettings.providerConfigs.bank_transfer?.enabled ?? true,
  isPayOnArrivalEnabled: updatedSettings.providerConfigs.pay_on_arrival?.enabled ?? true,
};
```

---

## 4. Firestore Data Sanitization (`sanitizeFirestoreData`)

Firestore strictly rejects documents containing `undefined` values (`FirebaseError: Function setDoc() called with invalid data. Unsupported field value: undefined`).
Always pass payloads through `sanitizeFirestoreData` before calling `setDoc`, `updateDoc`, or `addDoc`.

---

## 5. Analytics & Google Tag Manager (GTM) Cross-Tenant Isolation
1. **Domain Cookie Scoping**: Scope tracking cookies strictly to `window.location.hostname` with `cookie_flags: 'SameSite=None;Secure'`.
2. **DataLayer Cleansing**: Clear `window.dataLayer` when switching tenant contexts.

---

## 6. Vite & esbuild Syntax Compatibility Rules
Always use explicit parentheses when combining `??` and `||` operators on the same line.
