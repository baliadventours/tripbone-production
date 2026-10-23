# AGENTS.md - Tripbone SaaS Permanent Memory & Architecture Guardrails

This file is automatically injected into the AI system prompt on **every turn** (`<RULE[AGENTS_md]>`). It serves as the permanent architectural memory and anti-regression contract for the Tripbone SaaS codebase. Detailed file maps and module workflows reside in `/.agents/skills/tripbone_saas_architecture/SKILL.md`.

---

## 0. CRITICAL ANTI-REGRESSION & SURGICAL EDIT PROTOCOL
1. **Surgical Edits Only**: When the user asks to change a specific feature, button, or section, modify **ONLY** the exact lines required using `replace_file_content` or `multi_replace_file_content`. **NEVER** rewrite entire files, remove existing features, alter unrelated UI styling, or delete routes/menus unless explicitly instructed.
2. **Always Read Before Editing**: Before modifying any file, always call `view_file` on the target line range to inspect the exact current state—never guess or rely on stale memory.
3. **Clarify Mode Context First (Master SaaS vs. Tenant Storefront)**:
   - **Master SaaS Mode (`isMaster = true`)**: Landing page (`SaaSMarketing.tsx`), signup/login (`SaaSHome.tsx`), SuperAdmin (`SaaSSuperAdmin.tsx`), SaaS feature pages (`SaaSFeatures/*`).
   - **Tenant Storefront Mode (`isMaster = false`)**: Operator storefront (`Home.tsx`, `Tours.tsx`, `TourDetail.tsx`, `CarRentals.tsx`, `Checkout.tsx`, `AIPlanner.tsx`) and Tenant Admin Console (`Admin.tsx` + `src/components/Admin/*`).
   - Never confuse Master SaaS pages with Tenant Storefront pages.

---

## 1. Multi-Tenant Architecture & Database Isolation
- **Single Firestore DB with Logical Isolation**: All tenants share the main Firestore database (`ai-studio-tripbonesaas-bc73f611-b9f1-4175-a949-14e52d815420`), isolated logically via the `tenantId` field (`getActiveTenantId()`).
- **Core Collections**: `tenants`, `tours`, `rental_vehicles`, `bookings`, `coupons`, `reviews`, `blog`, `inquiries`, `invoices`, `waiver_templates`, `signed_waivers`, `users`.
- **Dual Settings Paths**:
  - Payment settings: `paymentSettings/{tenantId}` AND legacy fallback `settings/payment_{tenantId}` (always sync both).
  - Site & Builder settings: `settings/{tenantId}` (`SiteSettings`).
- **Cross-Tenant JSON Import/Export (`TourListing.tsx` / `Admin.tsx`)**: Exporting a tour strips `id`; importing strips old `id` and `tenantId`, stamps the importing tenant's `activeTenantId`, generates a new unique `slug`, and creates a brand-new `tours` document owned 100% by the importing tenant.

---

## 2. Core Feature Modules & File Map (Do Not Break)
- **Tenant Admin Console (`src/pages/Admin.tsx` + `src/components/Admin/`)**:
  - **Tours**: `TourListing.tsx` (Catalog, JSON Export/Import, TinyFish OTA Import), `TourEditorForm.tsx`, `Modals/AdminAiModal.tsx` (AI Tour Magic).
  - **Car Rental Module**: `CarRental/CarRentalBookingManager.tsx` (Rentals ledger), `CarRental/FleetManager.tsx` (Car Management / `rental_vehicles` CRUD), `CarRental/RentalAutomations.tsx`, `CarRental/RentalModuleSettings.tsx`.
  - **Bookings & Dispatch**: `BookingManager.tsx`, `BookingDetailModal.tsx`, `CreateManualBookingModal.tsx`, `ImportBooking.tsx` (AI Email Booking Extractor), `BookingReports.tsx`.
  - **Invoices, Waivers & Proposals**: `Invoice/InvoiceManager.tsx`, `Waiver/WaiverManager.tsx` (public signing at `/waiver/:bookingId`), `ProposalGenerator.tsx` (public view at `/proposal/:id`).
  - **Storefront Design & Settings**: `WebsiteBuilder.tsx` (Presets: `default`, `joytime-special`, `luxury`, etc.), `LandingPageGenerator.tsx`, `GeneralSettings.tsx`, `CustomDomainSettings.tsx`, `BackupManager.tsx`.
- **AI & Backend (`server.ts`, `src/server/routes/gemini.ts`, `src/services/geminiService.ts`)**:
  - Powered by `@google/genai` (Gemini 2.5 / 3.8 Flash) for AI Tour Magic, Catalog-Grounded AI Trip Planner (`AIPlanner.tsx`), 24/7 AI Concierge (`Chatbot.tsx`, `SaaSChatbot.tsx`), and AI Email Booking Extractor.

---

## 3. Universal Payment Gateway (BYOPG) & Firestore Rules
- **Multi-Gateway Enablement**: Stripe, Midtrans, Xendit, Razorpay, Adyen, PayPal, Bank Transfer, and Pay on Arrival can be enabled simultaneously in `tenantSettings.providerConfigs[providerId]`.
- **Firestore Sanitization**: Always pass payloads through `sanitizeFirestoreData()` before `setDoc`/`updateDoc`/`addDoc`—never write `undefined` values to Firestore.

---

## 4. Analytics, GTM & Bundle Safety
- **Cross-Tenant Cookie Isolation**: Scope GA/GTM cookies to `window.location.hostname` (`cookie_flags: 'SameSite=None;Secure'`) and reset `window.dataLayer` on tenant context switches.
- **Vite & esbuild Rule**: Never mix `??` and `||` on the same line without explicit parentheses.
- **Vercel Node ESM Import Rule**: Because `package.json` uses `"type": "module"`, all relative runtime imports inside `server.ts`, `api/**`, `src/services/**`, and `src/server/**` MUST include the `.js` extension (e.g., `import { tenantLogger } from "../lib/tenantLogger.js"`). Omitting `.js` causes `ERR_MODULE_NOT_FOUND` on Vercel Serverless Functions.

