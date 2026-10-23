# Tripbone SaaS Memory & Architecture Guide

## 1. Project Overview & Architecture
Tripbone SaaS is an enterprise-grade multi-tenant travel SaaS platform and tour operator management system built with React, Vite, TypeScript, Tailwind CSS, and Firebase (Firestore & Auth).

### Core Architectural Contexts
1. **Main Tripbone Site (`/` or `saas/*`)**: Marketing pages, SaaS landing pages, pricing tiers, feature showcases, SaaS comparison guides, and the main site AI chatbot related to Tripbone.
2. **Tenant Tour Portals (`/:tenantId/*`)**: White-label booking portals for individual travel operators/tenants, scoped by `tenantId`. Features localized inventory, tours, multi-package options with expand/collapse list views, tiered group pricing, checkout with payment gateway integrations, and operator-specific branding.
3. **Admin & Super Admin Dashboards (`/admin`, `/super-admin`, `/dashboard`)**: Management portal for tour operators and platform super admins to configure tours, packages, inventory, bookings, multi-gateway payments (BYOPG), analytics, Docs Manager, and custom integrations.

---

## 2. Key Modules & Subsystems
- **Multi-Tenant Resolution (`tenantId`)**: Tenant settings and configurations are scoped per tenant (`paymentSettings/{tenantId}`, legacy fallback `settings/payment_{tenantId}`) with sanitization helpers to prevent undefined Firestore writes.
- **Universal Payment Gateway (BYOPG)**: Multi-gateway enablement supporting Stripe, Midtrans, Xendit, Razorpay, Adyen, PayPal, Bank Transfer, and Pay on Arrival simultaneously. Configs stored in `tenantSettings.providerConfigs[providerId]`.
- **Tour Packages & Tiered Pricing**: Support for multi-package tours with adult/child tiers, min/max participant ranges, inclusions/exclusions, and interactive expand/collapse card views on the frontend.
- **Chatbot & AI Integration**: Embedded conversational assistants on both the main Tripbone marketing site and individual tenant portals, capable of querying live tour details, pricing, and package options.
- **Docs Manager**: Integrated documentation and resource manager accessible from the dashboard for managing operator guides, booking policies, and operational documents.
- **Analytics & Google Tag Manager (GTM)**: Cross-tenant tracking isolation with `cookie_domain: window.location.hostname`, `SameSite=None;Secure` flags, and `window.dataLayer` resets on tenant switching.

---

## 3. Project Structure
- `/src/components/`: Modular UI components (`Admin/`, `CarRental/`, `Chatbot/`, `Docs/`, `TourDetails/`, `Header/`, `Footer/`, `SaaS/`, etc.)
- `/src/pages/`: Route pages (`MainHome`, `SaaSComparison`, `TenantHome`, `TourDetailPage`, `CheckoutPage`, `AdminDashboard`, etc.)
- `/src/services/`: Firebase data adapters, booking handlers, payment processors, and AI chatbot handlers
- `/src/hooks/`: Custom React hooks (`useTenantSEO`, auth hooks, window width, etc.)
- `/src/lib/`: Utilities (`planUtils`, currency formatters, Firestore sanitizers)
- `/src/server/`: Express server middleware and API endpoints (`server.ts`)

---

## 4. Production Readiness & Maintenance
- **File Organization**: Cluttered temporary scripts (`fix-*.cjs`, `test-*.js`, temporary `.html`/`.txt` files) have been removed from the root directory. Core configuration files (`package.json`, `vite.config.ts`, `server.ts`, `firestore.rules`, `firebase.json`, `tsconfig.json`) remain pristine.
- **Build & Quality Assurance**: Verified via TypeScript compilation (`tsc --noEmit`) and Vite production builds with zero errors.
