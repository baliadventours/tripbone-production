# 🎬 Tripbone: 3-Minute Video Pitch Script
**Target Duration:** 2:55 (Max 3:00)  
**Style:** Straight to the point, feature-first, no marketing fluff.  
**Stack Highlight:** Google Cloud Run, Firebase Firestore, Google Gemini API, Google Maps Platform.

---

## ⏱️ Timeline Overview

| Time | Section | On-Screen Feature |
| :--- | :--- | :--- |
| **0:00 - 0:20** | **Introduction** | The Problem: Manual WhatsApp Bookings & 20-25% OTA Fees |
| **0:20 - 0:45** | **Feature 1** | AI Tour Builder & OTA Importer (Gemini API) |
| **0:45 - 1:15** | **Feature 2** | AI Trip Planner with Direct Tour Booking (Gemini + Maps) |
| **1:15 - 1:40** | **Feature 3** | 24/7 AI Sales Chatbot & Group Pricing Tiers |
| **1:40 - 2:05** | **Feature 4** | AI Email Booking Extractor & QR Check-in Vouchers |
| **2:05 - 2:25** | **Feature 5** | Universal BYOPG Payments (Stripe, QRIS, PayPal) |
| **2:25 - 2:55** | **Architecture & Outro** | Google Cloud Native Stack & Closing |

---

## 🎬 Scene-by-Scene Script

### 1. Introduction (0:00 – 0:20)
* **Screen:** Split-screen showing chaotic WhatsApp messages with manual quotes, next to an OTA invoice showing a 20–25% commission deduction. Then transition to the clean Tripbone storefront.
* **Lower-Third Tag:** `TRIPBONE • DIRECT BOOKING & OPERATIONS PLATFORM`
* **Voiceover:**
  > "Most independent tour operators still take bookings manually through WhatsApp and spreadsheets, or lose 20 to 25% of every sale to OTAs like Viator. Tripbone is an all-in-one direct booking and operating platform built on Google Cloud. Here is how it works."

---

### 2. AI Tour Builder & OTA Importer (0:20 – 0:45)
* **Screen:** 
  1. In Admin, click **"AI Tour Magic"**. Type: *"Full-day Nusa Penida speedboat tour with Manta Bay snorkeling and Kelingking Cliff"*. Click Generate. Gemini generates the title, description, schedule, inclusions, and FAQs in 2 seconds.
  2. Switch to **Tour Importer**. Paste a Viator product link. In one click, the tour is imported and published directly to the site.
* **Lower-Third Tag:** `AI TOUR BUILDER • POWERED BY GEMINI`
* **Voiceover:**
  > "First, creating tours. Instead of writing copy manually, operators enter a short prompt. Powered by Google Gemini, Tripbone writes the description, creates the schedule, and adds inclusions and FAQs in two seconds. If you already have tours on Viator or GetYourGuide, paste the link into the AI Importer to import your entire catalog with zero retyping."

---

### 3. AI Trip Planner with Embedded Tours (0:45 – 1:15)
* **Screen:** 
  1. Navigate to `/planner`. Traveler types: *"3 days in Bali for a couple, budget $600, loves waterfalls and sunrises"*.
  2. Gemini streams back a custom day-by-day plan with interactive Google Maps routes.
  3. Inside Day 2, show the planner recommending the operator's actual bookable tour card with a **"Book Now"** button. Click it to open the date and guest picker.
* **Lower-Third Tag:** `AI TRIP PLANNER • DIRECT CATALOG INTEGRATION`
* **Voiceover:**
  > "For travelers, Tripbone includes an AI Trip Planner. A guest enters their travel dates, budget, and interests. Gemini generates a personalized day-by-day itinerary with Google Maps routing. Directly inside the plan, the AI recommends your real tours with a direct 'Book Now' button, allowing travelers to reserve instantly."

---

### 4. 24/7 AI Sales Chatbot & Group Pricing (1:15 – 1:40)
* **Screen:** 
  1. Open the website chat widget. Traveler asks: *"Do you offer hotel pickup in Seminyak, and do you have child seats?"* The chatbot answers accurately in under two seconds and shares a direct checkout link.
  2. On the tour page, change guest count from 2 to 6. Show the dynamic group pricing automatically calculate volume discounts.
* **Lower-Third Tag:** `24/7 AI CONCIERGE & DYNAMIC GROUP PRICING`
* **Voiceover:**
  > "For customer inquiries, our 24/7 AI Chatbot answers questions about hotel pickup zones, inclusions, and equipment using your tour information. It handles late-night international questions and sends direct booking links. At checkout, our dynamic pricing engine automatically applies tiered group discounts as group size increases."

---

### 5. AI Email Booking Extractor & QR Vouchers (1:40 – 2:05)
* **Screen:** 
  1. In Admin, open **"AI Email Extractor"**. Paste an unformatted email from a hotel concierge: *"Booking 4 pax for Mount Batur Sunrise on Oct 18, cash collected"*.
  2. Click **Extract with AI**. The booking form auto-fills name, date, pax, and total amount.
  3. Click Save. An automated digital voucher appears with a scannable QR check-in code.
* **Lower-Third Tag:** `AI EMAIL EXTRACTOR • DIGITAL QR CHECK-IN`
* **Voiceover:**
  > "For partner bookings from hotels or travel agents, paste any raw inquiry email into the AI Email Extractor. Gemini extracts the guest name, party size, date, and tour name automatically. It creates the booking record and generates a digital voucher with a scannable QR check-in code for drivers and guides."

---

### 6. Universal Payment Gateways (BYOPG) (2:05 – 2:25)
* **Screen:** 
  1. Open Payment Settings. Show enabled gateways: Stripe, Midtrans QRIS, and PayPal.
  2. Complete a test booking via QRIS or Credit Card. Show that funds go straight into the operator's account.
* **Lower-Third Tag:** `UNIVERSAL BYOPG • 0% COMMISSION`
* **Voiceover:**
  > "Tripbone uses a Bring-Your-Own-Payment-Gateway model. Operators connect their own Stripe, PayPal, or Midtrans QRIS accounts. All customer payments go directly to the operator's bank account, with zero percent platform commission taken by Tripbone."

---

### 7. Google Cloud Architecture & Conclusion (2:25 – 2:55)
* **Screen:** Clean architecture diagram showing:
  * **Compute:** Google Cloud Run (Node API backend)
  * **Database & Auth:** Firebase Firestore (Multi-tenant data isolation) & Firebase Auth
  * **AI:** Google Gemini API (Planner, tour generator, email extractor)
  * **Mapping:** Google Maps Platform (Routes and location markers)
  * Final screen: Tripbone logo, live demo URL, and *"Google Cloud AI Builder Cup 2026"*.
* **Lower-Third Tag:** `BUILT ON GOOGLE CLOUD`
* **Voiceover:**
  > "Tripbone is built entirely on Google Cloud. We use Google Cloud Run for containerized backend scaling, Firebase Firestore for real-time multi-tenant data, Google Maps Platform for route mapping, and the Gemini API for generative AI. Tripbone gives independent tour operators the tools to run their entire business online. Thank you."
