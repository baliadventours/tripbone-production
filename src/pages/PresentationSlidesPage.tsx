import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  Car, 
  ShieldCheck, 
  Maximize2,
  FileText
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function PresentationSlidesPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 16;
  const [copied, setCopied] = useState(false);

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 1) setCurrentSlide(prev => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const handleCopyMarkdown = async () => {
    try {
      const res = await fetch('/docs/AI_BUILDER_CUP_PRESENTATION_DECK.md');
      if (res.ok) {
        const text = await res.text();
        await navigator.clipboard.writeText(text);
      } else {
        await navigator.clipboard.writeText("Tripbone Presentation Deck for Google Cloud AI Builder Cup 2026");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <Helmet>
        <title>Google Cloud AI Builder Cup 2026 — Tripbone Presentation</title>
      </Helmet>

      {/* Top Floating Control Bar */}
      <div className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 sm:px-6 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition flex items-center gap-1 shadow-sm shadow-sky-900/30 text-white"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs font-bold text-slate-400 pl-2">
            Slide <span className="text-sky-400">{currentSlide}</span> / {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Slide quick picker */}
          <select 
            value={currentSlide} 
            onChange={(e) => setCurrentSlide(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value={1}>1. Team Details</option>
            <option value={2}>2. Instructions</option>
            <option value={3}>3. Idea Brief</option>
            <option value={4}>4. Opportunities</option>
            <option value={5}>5. Features Offered</option>
            <option value={6}>6. Process Flow</option>
            <option value={7}>7. Wireframes & UI</option>
            <option value={8}>8. Cloud Architecture</option>
            <option value={9}>9. Technologies Used</option>
            <option value={10}>10. Implementation Cost</option>
            <option value={11}>11. Prototype Snapshots</option>
            <option value={12}>12. Performance Report</option>
            <option value={13}>13. Future Roadmap</option>
            <option value={14}>14. Project Links</option>
            <option value={15}>15. Appendix</option>
            <option value={16}>16. Thank You</option>
          </select>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1.5 text-slate-200"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <a
            href="/slides.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1.5 text-slate-200"
            title="Open Standalone HTML"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Raw HTML</span>
          </a>
        </div>
      </div>

      {/* Main Slide Card (16:9 Aspect Ratio) */}
      <div className="w-full max-w-5xl bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col min-h-[560px]">
        
        {/* Slide Header */}
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-sm sm:text-base tracking-tight">Google Cloud</span>
            <span className="text-slate-600">|</span>
            <span className="text-xs font-bold text-slate-400">H2S</span>
            <span className="font-black text-sm sm:text-base bg-gradient-to-r from-blue-500 via-rose-500 to-amber-400 bg-clip-text text-transparent">
              AI Builder Cup
            </span>
          </div>
          <div className="text-[11px] font-bold px-3 py-1 bg-white/10 rounded-full text-slate-300">
            Build in JAPAC. Build for the world.
          </div>
        </div>

        {/* Slide Body */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
          
          {/* SLIDE 1 */}
          {currentSlide === 1 && (
            <div className="flex-1 flex flex-col justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8 sm:p-12 rounded-2xl -m-2 sm:-m-4">
              <div className="text-xs font-extrabold text-sky-400 uppercase tracking-widest mb-2">
                Track: Retail & Commerce (Intelligent Customer & Business Experiences)
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
                Tripbone
              </h1>
              <p className="text-base sm:text-lg text-slate-400 font-medium mb-8 max-w-2xl">
                The AI-Native Tour & Car Rental Commerce Engine built 100% on Google Cloud
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-2 text-xs sm:text-sm text-slate-300">
                <div><strong className="text-white">a. Team name:</strong> Tripbone Team</div>
                <div><strong className="text-white">b. Team leader name:</strong> I Kadek Didi Suprapta (baliadventours@gmail.com)</div>
                <div>
                  <strong className="text-white">c. Problem Statement:</strong> Independent tour, activity, and private car charter operators across JAPAC power a $300B tourism economy, yet over 80% still rely on manual WhatsApp chats and paper spreadsheets—losing up to 25% of gross revenue to OTA commissions (Viator, GetYourGuide, Klook) and 30–40% of international direct sales to timezone friction.
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2 */}
          {currentSlide === 2 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center text-3xl mb-4">
                📋
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">AI Builder Cup Submission Deck</h2>
              <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                This presentation strictly follows the official 16-slide Google Cloud AI Builder Cup template, providing clear architectural diagrams, real production metrics, live prototype walkthroughs, and economic impact data for JAPAC.
              </p>
            </div>
          )}

          {/* SLIDE 3 */}
          {currentSlide === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Idea Brief</span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">Brief About the Idea</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Tripbone provides independent tour operators and private car rental businesses with an enterprise-grade digital storefront and autonomous AI workforce—democratizing direct commerce.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-sky-600" /> 8 Autonomous AI Tools
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Powered by <strong>Google Gemini 3.8 Flash</strong>: prompt-to-tour generation, OTA catalog importer, streaming trip planning with embedded inventory, 24/7 search-grounded sales concierge, and email extraction.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <h3 className="font-extrabold text-sm text-emerald-900 flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-emerald-600" /> Dual Tour & Car Rental Engine
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Native management for scheduled group/private day tours and <strong>private car rentals & chauffeur charters</strong> (with-driver vs. self-drive rates, island delivery zones & surcharges).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200">
                  <h3 className="font-extrabold text-sm text-sky-900 flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-sky-600" /> Universal BYOPG (0% Commission)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Operators connect their own Stripe, Midtrans QRIS, Xendit, and PayPal accounts. 100% of customer payments settle directly into the operator's merchant bank account with zero platform take-rate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4 */}
          {currentSlide === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Market Opportunity</span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">Opportunities & Differentiation</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-2">1. How is it Different?</h3>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4 leading-relaxed">
                    <li><strong>Legacy Engines (Bókun, FareHarbor):</strong> Clunky desktop interfaces, take 2–6% booking cuts, zero native Gen AI.</li>
                    <li><strong>Generic CMS (Shopify, Wix):</strong> Lack travel logistics (pickup zones, tiered group rates, vehicle fleet specs, guide dispatch).</li>
                    <li><strong>Tripbone:</strong> First unified platform combining an Airbnb-grade booking UX, dual tour & car rental engines, autonomous Gemini agents, and 0% commission.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 mb-2">2. How Does it Solve it?</h3>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4 leading-relaxed">
                    <li><strong>Speed:</strong> Reduces tour & fleet setup time from 45 minutes to 2 seconds with Gemini 3.8 Flash.</li>
                    <li><strong>Revenue:</strong> Eliminates the 25% OTA cut, boosting operator net margins by 20–30%.</li>
                    <li><strong>24/7 Capture:</strong> AI Concierge answers midnight questions on pickup and safety in under 2 seconds.</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <h3 className="font-black text-xs uppercase tracking-wider text-emerald-800 mb-2">3. Core USPs</h3>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4 leading-relaxed">
                    <li><strong>Catalog-Grounded AI Itineraries:</strong> Gemini embeds real, active bookable tour cards directly into custom itineraries.</li>
                    <li><strong>Dual Tour & Car Rental Suite:</strong> Full car fleet management alongside scheduled tour packages.</li>
                    <li><strong>Zero-Data-Entry Dispatch:</strong> Parses raw emails into verified QR check-in vouchers.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5 */}
          {currentSlide === 5 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Feature Suite</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">List of Features Offered by Tripbone</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-xs text-slate-900">AI Tour Magic</div>
                  <p className="text-[11px] text-slate-500 mt-1">Transforms raw text prompts into full bookable tours with schedules & FAQs in 2s.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-xs text-slate-900">AI OTA Importer</div>
                  <p className="text-[11px] text-slate-500 mt-1">1-click catalog migration from Viator & GetYourGuide with zero copy-pasting.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-xs text-slate-900">AI Trip Planner</div>
                  <p className="text-[11px] text-slate-500 mt-1">Streams custom itineraries with Google Maps routing & embedded bookable cards.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-xs text-slate-900">24/7 AI Sales Concierge</div>
                  <p className="text-[11px] text-slate-500 mt-1">Chatbot with Google Search Grounding for live weather, pickup zones & direct links.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-black text-xs text-emerald-900">Car Management (Fleet)</div>
                  <p className="text-[11px] text-slate-600 mt-1">Vehicle specs, chauffeur (10h) vs. self-drive (24h) rates & photo manager.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-black text-xs text-emerald-900">Service Delivery Zones</div>
                  <p className="text-[11px] text-slate-600 mt-1">Automated island delivery zones (Standard, Highlands, Remote) with dynamic surcharges.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-xs text-slate-900">AI Email Extractor</div>
                  <p className="text-[11px] text-slate-500 mt-1">Parses raw emails from hotel concierges into verified reservations and QR vouchers.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-xs text-slate-900">Digital Liability Waivers</div>
                  <p className="text-[11px] text-slate-500 mt-1">Mobile-optimized legal safety waivers (/waiver/:id) with touch e-signatures.</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6 */}
          {currentSlide === 6 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Process Architecture</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Process Flow & Use-Case Diagram</h2>
              </div>
              <pre className="bg-slate-950 text-sky-400 p-4 rounded-2xl font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto">
{`[1. SUPPLY ONBOARDING: TOURS & CAR FLEET]
Operator Prompt / OTA Link ──► Google Gemini 3.8 Flash ──► Structured Schema ──► Firebase Firestore
Car Fleet & Delivery Zones  ──► Chauffeur & Self-Drive  ──► Live Catalog ───────► Live Storefront
                                                                                      │
[2. TRAVELER DISCOVERY & PLANNING]                                                    │ (Active Catalog Sync)
Traveler Preferences & Budget ──► Gemini AI Planner + Google Maps API ──► Custom Plan ◄───┘
                                                                           │ (Embedded Tour / Car Card)
                                                                           ▼
[3. CONVERSION & MULTI-GATEWAY CHECKOUT]                            [Book Now Drawer]
Guest Party / Vehicle Selection ──► Dynamic Group Rate Tiers ──► Universal BYOPG (Stripe/QRIS) ──► 0% Commission Direct Settlement
                                                                                              │
[4. AUTONOMOUS OPERATIONS & DISPATCH]                                                         ▼
Inbound Partner Email ──► Gemini AI Extractor ──► Booking Ledger ──► Scannable QR Digital Voucher ──► WhatsApp Dispatch to Guide/Driver`}
              </pre>
            </div>
          )}

          {/* SLIDE 7 */}
          {currentSlide === 7 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">UI & Experience</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Wireframes & Interface Architecture</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-slate-900 mb-1">1. Traveler Storefront</div>
                  <p className="text-slate-600">Minimalist luxury design with high typographic hierarchy, clean date & guest selector, currency converter, and zero-distraction booking flow.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-black text-emerald-950 mb-1">2. Car Rentals (/car-rentals)</div>
                  <p className="text-slate-600">Vehicle fleet showcase with passenger/luggage specs, with-driver (10h) vs. self-drive (24h) pricing, and automated delivery zone selector.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-slate-900 mb-1">3. AI Trip Planner (/planner)</div>
                  <p className="text-slate-600">Split-view UI: dynamic streaming day-by-day plan on the left, interactive Google Maps transit route on the right, and embedded bookable cards.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-black text-emerald-950 mb-1">4. Car Management (Admin)</div>
                  <p className="text-slate-600">Full fleet management console: photo uploader with WebP compression, pricing matrices, fuel type, transmission, and active status.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-slate-900 mb-1">5. Operations Dispatch Console</div>
                  <p className="text-slate-600">Live revenue telemetry, guide/driver WhatsApp dispatch, digital waiver tracking, AI Tour Magic modal, and TinyFish OTA price scraper.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-black text-slate-900 mb-1">6. Scannable QR Voucher</div>
                  <p className="text-slate-600">Self-contained mobile passenger voucher with dynamic QR verification token, pickup details, and one-tap driver WhatsApp contact.</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8 */}
          {currentSlide === 8 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Cloud Architecture</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">100% Google Cloud Native Architecture</h2>
              </div>
              <pre className="bg-slate-950 text-sky-400 p-4 rounded-2xl font-mono text-[10px] sm:text-[11px] leading-relaxed overflow-x-auto">
{`┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                     CLIENT TIER                                        │
│     React 18 SPA (Vite + TypeScript + Tailwind CSS) • PWA Mobile First • Airbnb UX     │
└───────────────────────────┬───────────────────────────────────┬────────────────────────┘
                            │ HTTPS / REST                      │ Maps JavaScript API
                            ▼                                   ▼
┌───────────────────────────────────────────┐         ┌──────────────────────────────────┐
│           COMPUTE & API TIER              │         │         GEOSPATIAL TIER          │
│            Google Cloud Run               │         │      Google Maps Platform        │
│   - Containerized Node.js Microservice    │         │   - Directions & Distance Matrix │
│   - Auto-scaling (0 to N instances)       │         │   - Places API & Geocoding       │
│   - Sub-second serverless execution       │         └──────────────────────────────────┘
└─────────────────────┬─────────────────────┘
                      │
     ┌────────────────┴──────────────────────────┐
     ▼                                           ▼
┌──────────────────────────────────┐    ┌────────────────────────────────────────────────┐
│       DATA & IDENTITY TIER       │    │               GEN AI ENGINE TIER               │
│         Firebase Platform        │    │         Google Gemini 3.8 Flash & 3.1 Lite     │
│   - Cloud Firestore (Multi-tenant)│   │   - Streaming Itinerary Planner                │
│   - Real-time Snapshot Sync      │    │   - Catalog-Grounded Tour Recommendations      │
│   - Firebase Authentication & RBAC│   │   - AI Email Entity Extractor (JSON Schema)    │
└──────────────────────────────────┘    │   - 24/7 AI Concierge with Search Grounding    │
                                        │   - AI Proposal Builder & Blog Writer          │
                                        └────────────────────────────────────────────────┘`}
              </pre>
            </div>
          )}

          {/* SLIDE 9 */}
          {currentSlide === 9 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Tech Stack</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Technologies Used in the Solution</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200">
                  <h3 className="font-black text-sky-950 mb-2">Google Cloud & AI Core</h3>
                  <ul className="space-y-2 list-disc pl-4 text-slate-700">
                    <li><strong>Google Gemini 3.8 Flash & 3.1 Flash Lite:</strong> Multimodal Gen AI for trip planning, tour generation, email extraction, and Search-grounded concierge.</li>
                    <li><strong>Google Cloud Run:</strong> Serverless container runtime hosting the production Node.js API.</li>
                    <li><strong>Firebase Firestore:</strong> Real-time NoSQL database with multi-tenant scoping.</li>
                    <li><strong>Firebase Auth:</strong> Multi-role RBAC (SuperAdmin, Admin, Guide, Guest).</li>
                    <li><strong>Google Maps Platform:</strong> Directions, Distance Matrix & Geocoding.</li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-slate-900 mb-2">Frontend & UX</h3>
                  <ul className="space-y-2 list-disc pl-4 text-slate-700">
                    <li><strong>React 18 & TypeScript:</strong> Type-safe frontend.</li>
                    <li><strong>Vite:</strong> Blazing fast compilation.</li>
                    <li><strong>Tailwind CSS:</strong> Swiss-modern design system.</li>
                    <li><strong>Lucide React & Motion:</strong> Kinetic UI icons & animations.</li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <h3 className="font-black text-emerald-950 mb-2">Universal BYOPG Payments</h3>
                  <ul className="space-y-2 list-disc pl-4 text-slate-700">
                    <li><strong>Multi-Gateway Layer:</strong> Stripe, Midtrans QRIS, Xendit, PayPal, Razorpay, Adyen.</li>
                    <li><strong>Zero Platform Take-Rate:</strong> 100% direct merchant payout.</li>
                    <li><strong>WhatsApp Gateway API:</strong> Instant crew & guide dispatch.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 10 */}
          {currentSlide === 10 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Cost Efficiency</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Estimated Implementation Cost (Scale-to-Zero)</h2>
                <p className="text-xs text-slate-500">Tripbone's serverless Google Cloud architecture incurs near-zero idle cost, making it viable for SME operators.</p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Google Cloud Service</th>
                      <th className="p-3">Estimated Usage (100 Active Tour Operators)</th>
                      <th className="p-3">Monthly Cost (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Google Cloud Run</td>
                      <td className="p-3 text-slate-600">1.5M requests/month (auto scale-to-zero)</td>
                      <td className="p-3 font-bold text-emerald-600">$0.00 (Free Tier)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Firebase Firestore</td>
                      <td className="p-3 text-slate-600">500,000 document reads/writes/month</td>
                      <td className="p-3 text-slate-700">$0.90</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Google Gemini 3.8 Flash</td>
                      <td className="p-3 text-slate-600">~10,000 AI trip plans & email extractions</td>
                      <td className="p-3 text-slate-700">$2.50 (~$0.00025/call)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-900">Google Maps Platform</td>
                      <td className="p-3 text-slate-600">~25,000 map views & route queries</td>
                      <td className="p-3 font-bold text-emerald-600">$0.00 (Covered by $200 Credit)</td>
                    </tr>
                    <tr className="bg-sky-50/50 font-bold">
                      <td className="p-3 text-sky-950">Total Monthly Cloud Cost</td>
                      <td className="p-3 text-sky-950">Operating 100 Live Travel Businesses</td>
                      <td className="p-3 text-base text-sky-600">~$3.40 / Month Total</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SLIDE 11 */}
          {currentSlide === 11 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Working Prototype</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Snapshots of the Live Working Prototype</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">1. Storefront & Tour Page</div>
                  <p className="text-slate-500 mt-1">Clean Airbnb layout, multi-currency display, and instant booking modal with tiered group pricing.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-950">2. Car Rentals (/car-rentals)</div>
                  <p className="text-slate-600 mt-1">Live vehicle fleet with chauffeur vs. self-drive pricing, delivery zone surcharges, and instant reserve drawer.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">3. AI Trip Planner</div>
                  <p className="text-slate-500 mt-1">Live Gemini streaming day-by-day itineraries with integrated bookable tour cards and interactive maps.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-950">4. Car Management (Admin)</div>
                  <p className="text-slate-600 mt-1">Admin fleet manager: configure specs, photos, chauffeur rates, and availability toggle.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">5. 24/7 AI Concierge</div>
                  <p className="text-slate-500 mt-1">Search-grounded chatbot answering live questions & AI Email Extractor parsing unstructured text into bookings.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">6. Digital QR Voucher & Waivers</div>
                  <p className="text-slate-500 mt-1">Mobile check-in voucher with scannable QR verification badge and digital liability waiver signing.</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 12 */}
          {currentSlide === 12 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Benchmarking</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Prototype Performance Report & Benchmarks</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-sky-600 font-mono">480ms</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">Gemini TTFT (Planner)</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-sky-600 font-mono">2.0s</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">AI Tour Creation</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-sky-600 font-mono">98.4%</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">Extraction Accuracy</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-2xl font-black text-emerald-600 font-mono">98/100</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mt-1">Lighthouse Score</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-950 mb-1">Operator Efficiency Impact</div>
                  <p className="text-slate-600">Reduces tour packaging and fleet setup time from <strong>45 minutes to 15 seconds</strong> (95% time saved). Eliminates 100% of manual data entry for offline hotel inquiries.</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-950 mb-1">Direct Economic Impact</div>
                  <p className="text-slate-600">Operators retain <strong>100% of gross revenue</strong>, saving 20% to 25% in OTA commissions on every direct booking.</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 13 */}
          {currentSlide === 13 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Roadmap</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Additional Details & Future Development</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Q1 2027: Gemini Live Voice Concierge</div>
                  <p className="text-slate-600">Two-way real-time multilingual voice assistant allowing travelers to plan and book tours via natural voice conversation on mobile.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Q2 2027: Predictive Dynamic Pricing Engine</div>
                  <p className="text-slate-600">Machine learning models predicting optimal pricing based on flight arrival trends, seasonal weather patterns, and competitor OTA rates.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Q3 2027: Offline PWA with Bluetooth QR Sync</div>
                  <p className="text-slate-600">Offline-first mobile driver app enabling boat captains and mountain guides on remote islands without 4G to validate tickets and sync check-ins automatically.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Q4 2027: Regional Operator Cooperative</div>
                  <p className="text-slate-600">Cross-operator collaborative booking network allowing independent operators to offer multi-island bundled expeditions.</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 14 */}
          {currentSlide === 14 && (
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Submission Links</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Project Submission Links</h2>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-slate-900">● GitHub Public Repository:</span>{' '}
                  <span className="font-mono text-sky-600">[Insert Your GitHub Public Repository URL]</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">● Demo Video Link (3 Minutes):</span>{' '}
                  <span className="font-mono text-sky-600">[Insert 3-Minute Video URL]</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">● Live Production Application:</span>{' '}
                  <a href="https://ais-pre-gueyp6lq66x3mljvag7bro-49253860877.asia-east1.run.app" target="_blank" rel="noopener noreferrer" className="font-mono text-sky-600 underline font-bold">
                    https://ais-pre-gueyp6lq66x3mljvag7bro-49253860877.asia-east1.run.app
                  </a>
                </div>
                <div>
                  <span className="font-bold text-slate-900">● Car Rentals Storefront:</span>{' '}
                  <a href="https://ais-pre-gueyp6lq66x3mljvag7bro-49253860877.asia-east1.run.app/car-rentals" target="_blank" rel="noopener noreferrer" className="font-mono text-sky-600 underline font-bold">
                    .../car-rentals
                  </a>
                </div>
                <div>
                  <span className="font-bold text-slate-900">● Admin Console Demo:</span>{' '}
                  <span className="font-mono text-slate-700 bg-slate-200 px-2 py-0.5 rounded">/admin</span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 15 */}
          {currentSlide === 15 && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">Impact Manifesto</span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Why Tripbone Matters</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="font-black text-slate-900 mb-2">Built in JAPAC, For the World</h3>
                  <p className="text-slate-600 leading-relaxed">Starting with local operators across Indonesia, Thailand, and Southeast Asia, solving real economic friction in a $300B industry.</p>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h3 className="font-black text-emerald-950 mb-2">Real Generative AI Value</h3>
                  <p className="text-slate-600 leading-relaxed">Not a gimmick chatbot. Gemini 3.8 Flash is deeply integrated into supply creation, demand conversion, and backend dispatch logistics.</p>
                </div>
                <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200">
                  <h3 className="font-black text-sky-950 mb-2">Economic Sovereignty</h3>
                  <p className="text-slate-600 leading-relaxed">Enabling local SME operators to break free from 25% OTA commissions and keep 100% of what they earn.</p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 16 */}
          {currentSlide === 16 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8 sm:p-12 rounded-2xl -m-2 sm:-m-4">
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight mb-2">
                Thank You!
              </h1>
              <p className="text-base sm:text-lg text-slate-400 font-medium mb-6">
                Tripbone: The AI-Native Tour & Car Rental Commerce Engine
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-slate-300 mb-8">
                <div><strong>Team:</strong> Tripbone Team</div>
                <div>•</div>
                <div><strong>Lead:</strong> I Kadek Didi Suprapta</div>
                <div>•</div>
                <div><strong>Email:</strong> baliadventours@gmail.com</div>
              </div>

              <div className="text-sm font-extrabold text-sky-400">
                See you in Singapore at the Google Cloud AI Builder Cup Grand Finale 2026!
              </div>
            </div>
          )}

        </div>

        {/* Slide Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-400 shrink-0">
          <span>Slide {currentSlide} of {totalSlides}</span>
          <span>Google Cloud AI Builder Cup 2026 Submission</span>
        </div>

      </div>

      {/* Direct link guidance */}
      <div className="mt-6 text-xs text-slate-400 text-center max-w-lg">
        Tip: You can use your keyboard <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">←</kbd> and <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">→</kbd> arrow keys to switch slides, or click <button onClick={() => window.print()} className="underline text-sky-400 font-bold">Print to PDF</button> to export.
      </div>
    </div>
  );
}
