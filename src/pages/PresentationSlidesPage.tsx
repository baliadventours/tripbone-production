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
  const [deckMode, setDeckMode] = useState<'pitch' | 'hackathon'>('pitch');
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = deckMode === 'pitch' ? 12 : 16;
  const [copied, setCopied] = useState(false);

  const switchDeckMode = (mode: 'pitch' | 'hackathon') => {
    setDeckMode(mode);
    setCurrentSlide(1);
  };

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
  }, [currentSlide, totalSlides]);

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
        <title>{deckMode === 'pitch' ? 'Tripbone.com — Official Investor & Partner Pitch Deck' : 'Google Cloud AI Builder Cup 2026 — Tripbone Presentation'}</title>
      </Helmet>

      {/* Top Floating Control Bar */}
      <div className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-3 sm:px-6 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => switchDeckMode('pitch')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                deckMode === 'pitch'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tripbone Pitch Deck (12)
            </button>
            <button
              onClick={() => switchDeckMode('hackathon')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition ${
                deckMode === 'hackathon'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GCP Builder Cup (16)
            </button>
          </div>

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
          {deckMode === 'pitch' ? (
            <select
              value={currentSlide}
              onChange={(e) => setCurrentSlide(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value={1}>1. Cover — Tripbone.com</option>
              <option value={2}>2. The Problem</option>
              <option value={3}>3. The Solution (Tripbone OS)</option>
              <option value={4}>4. How It Works (15-Min Launch)</option>
              <option value={5}>5. AI Unfair Advantage</option>
              <option value={6}>6. 0% Commission BYOPG Model</option>
              <option value={7}>7. Unified Operations & Car Rentals</option>
              <option value={8}>8. Market Opportunity ($300B+)</option>
              <option value={9}>9. Business Model & Pricing</option>
              <option value={10}>10. Competitive Landscape</option>
              <option value={11}>11. Founder Story & Traction</option>
              <option value={12}>12. Vision & The Ask</option>
            </select>
          ) : (
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
          )}

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
          {deckMode === 'pitch' ? (
            <>
              <div className="flex items-center gap-3">
                <span className="font-black text-base tracking-tight text-orange-500">TRIPBONE.COM</span>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-bold text-slate-300">The AI-Native Operating System for Tour & Car Rental Operators</span>
              </div>
              <div className="text-[11px] font-bold px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300">
                0% Commission • Direct Booking SaaS
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Slide Body */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
          {deckMode === 'pitch' ? (
            <>
              {/* PITCH SLIDE 1: COVER */}
              {currentSlide === 1 && (
                <div className="flex-1 flex flex-col justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8 sm:p-12 rounded-2xl -m-2 sm:-m-4">
                  <div className="inline-flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-widest mb-3">
                    <Sparkles className="w-4 h-4" /> Seed & Strategic Partner Pitch Deck
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-4">
                    Tripbone.com
                  </h1>
                  <p className="text-lg sm:text-2xl text-slate-200 font-bold mb-4 max-w-3xl">
                    Shopify + AI Workforce for Tour, Activity & Car Rental Operators.
                  </p>
                  <p className="text-sm sm:text-base text-slate-400 max-w-2xl mb-8 leading-relaxed">
                    Launch a high-converting direct booking website in 15 minutes, connect your own payment gateway with <strong className="text-white">0% platform commission</strong>, and let AI write your tours, plan guest itineraries, and automate WhatsApp dispatch.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
                    <div>
                      <div className="text-slate-400 uppercase font-bold">Founder</div>
                      <div className="text-white font-black text-sm mt-0.5">I Kadek Didi Suprapta</div>
                    </div>
                    <div>
                      <div className="text-slate-400 uppercase font-bold">Headquarters</div>
                      <div className="text-white font-black text-sm mt-0.5">Bali, Indonesia (Global SaaS)</div>
                    </div>
                    <div>
                      <div className="text-slate-400 uppercase font-bold">Live Platform</div>
                      <div className="text-orange-400 font-black text-sm mt-0.5">https://tripbone.com</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 2: THE PROBLEM */}
              {currentSlide === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">The Problem</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Local Tour Operators Do All the Work—But Lose All the Margin</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Over 80% of independent tour, activity, and car charter operators are trapped between predatory OTAs and manual WhatsApp chaos.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-6 rounded-2xl bg-rose-50/70 border border-rose-200">
                      <div className="text-3xl font-black text-rose-600 mb-2">20% – 30%</div>
                      <div className="font-black text-slate-900 text-sm mb-2">Lost to OTA Commissions</div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Viator, GetYourGuide, and Klook take up to 30% of every booking while owning the customer relationship and delaying payouts for weeks.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <div className="text-3xl font-black text-amber-600 mb-2">$2,000 – $5,000</div>
                      <div className="font-black text-slate-900 text-sm mb-2">Clunky Agency Websites</div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Traditional WordPress travel sites cost thousands to build, break constantly, lack real-time tiered booking logic, and don't convert mobile travelers.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200">
                      <div className="text-3xl font-black text-slate-800 mb-2">30+ Hours/wk</div>
                      <div className="font-black text-slate-900 text-sm mb-2">Manual WhatsApp & Admin Chaos</div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Operators lose 35% of international inquiries overnight due to timezone lag, then spend hours copying OTA emails into spreadsheets and chasing drivers.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 3: THE SOLUTION */}
              {currentSlide === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">The Solution</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Meet Tripbone: The All-in-One AI Tour & Car Rental OS</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Everything a travel operator needs to launch their own direct-booking brand, keep 100% of their revenue, and automate operations.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <h3 className="font-black text-sm text-slate-900 mb-1.5">1. Instant Multi-Tenant Storefront & Builder</h3>
                      <p className="text-slate-600 leading-relaxed">
                        High-converting storefront (`slug.tripbone.com` or custom domain) with travel-optimized themes (*Default, Joytime, Luxury, Airbnb*), custom pages, and SEO schema out of the box.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200">
                      <h3 className="font-black text-sm text-orange-950 mb-1.5">2. Autonomous AI Workforce (Powered by Gemini)</h3>
                      <p className="text-slate-700 leading-relaxed">
                        AI writes SEO tour packages in 30 seconds, imports existing listings from OTAs, builds custom multi-day guest itineraries, and answers traveler questions 24/7.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <h3 className="font-black text-sm text-emerald-950 mb-1.5">3. 0% Commission Bring-Your-Own-Gateway (BYOPG)</h3>
                      <p className="text-slate-700 leading-relaxed">
                        Operators connect their own Stripe, Midtrans, Xendit, PayPal, Razorpay, or Bank Transfer. Money flows 100% directly from guest to operator.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200">
                      <h3 className="font-black text-sm text-sky-950 mb-1.5">4. Back-Office Dispatch, Fleet, Waivers & Invoices</h3>
                      <p className="text-slate-700 leading-relaxed">
                        Unified calendar for tours & car rentals, AI email booking extractor, digital waiver signing, automated invoicing, and 1-click WhatsApp driver dispatch.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 4: HOW IT WORKS */}
              {currentSlide === 4 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">Product Onboarding</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">From Zero to Live Direct Bookings in 15 Minutes</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-slate-900 text-white">
                      <div className="text-orange-400 font-black text-lg mb-2">Step 01</div>
                      <div className="font-bold text-sm mb-2">Create Workspace</div>
                      <p className="text-slate-300 leading-relaxed">Sign up at Tripbone.com, pick a workspace slug, and connect a custom domain in one click.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-orange-600 font-black text-lg mb-2">Step 02</div>
                      <div className="font-bold text-slate-900 text-sm mb-2">AI Catalog Setup</div>
                      <p className="text-slate-600 leading-relaxed">Use <strong>AI Tour Magic</strong> or paste a Viator/GetYourGuide URL to populate complete tours, pricing tiers, and photos.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-orange-600 font-black text-lg mb-2">Step 03</div>
                      <div className="font-bold text-slate-900 text-sm mb-2">Plug In Payments</div>
                      <p className="text-slate-600 leading-relaxed">Toggle on Stripe, Midtrans, Xendit, PayPal, or Pay-on-Arrival with your own merchant keys.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="text-emerald-600 font-black text-lg mb-2">Step 04</div>
                      <div className="font-bold text-emerald-950 text-sm mb-2">Accept Bookings 24/7</div>
                      <p className="text-slate-700 leading-relaxed">Travelers book directly; AI Concierge converts leads; WhatsApp & email vouchers fire automatically.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 5: AI UNFAIR ADVANTAGE */}
              {currentSlide === 5 && (
                <div className="space-y-5">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">AI Native Architecture</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Not a Wrapper—Deep Workflow AI Built for Travel</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-black text-slate-900 text-sm mb-1">✨ AI Tour Magic & OTA Importer</div>
                      <p className="text-slate-600 leading-relaxed">Turns a 5-word prompt or raw OTA webpage into structured multi-package tours, time-slotted itineraries, inclusions, exclusions, and SEO metadata.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-black text-slate-900 text-sm mb-1">🗺️ Catalog-Grounded AI Trip Planner</div>
                      <p className="text-slate-600 leading-relaxed">Travelers enter their dates, budget, and vibe. The AI builds a day-by-day itinerary strictly grounded in the operator's real bookable tours—with 1-click checkout.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-black text-slate-900 text-sm mb-1">🤖 24/7 Multilingual AI Sales Concierge</div>
                      <p className="text-slate-600 leading-relaxed">Answers specific questions about pickup rules, child pricing, and availability in any language while the operator sleeps.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="font-black text-slate-900 text-sm mb-1">📩 AI Email Booking Extractor & Proposal Builder</div>
                      <p className="text-slate-600 leading-relaxed">Reads unstructured OTA confirmation emails (Viator, Klook, GYG) and converts them into dispatch-ready bookings automatically.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 6: BYOPG 0% COMMISSION */}
              {currentSlide === 6 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Economic Sovereignty</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Why Operators Switch: 0% Commission + BYOPG</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Most booking engines punish operators as they grow by charging 2%–6% per booking on top of credit card fees. Tripbone charges a flat SaaS subscription and <strong>0% booking commission</strong>.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 text-xs">
                      <div className="text-orange-400 font-black uppercase tracking-wider">Example: Operator Doing $15,000/mo</div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-slate-300">On OTAs (25% Commission):</span>
                        <span className="font-black text-rose-400">-$3,750 / month lost</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-slate-300">Legacy Booking SaaS (3% Fee + $199):</span>
                        <span className="font-black text-amber-400">-$649 / month lost</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-white font-bold">On Tripbone Pro ($79/mo, 0% Fee):</span>
                        <span className="font-black text-emerald-400">Saves $44,000+ / year</span>
                      </div>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="font-black text-slate-900 text-sm">Supported Direct Gateways Out-of-the-Box:</div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold">💳 Stripe (Global Cards)</div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold">🇮🇩 Midtrans (QRIS / VA / Cards)</div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold">🌏 Xendit (SEA eWallets)</div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold">🌐 PayPal & Adyen</div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold">🇮🇳 Razorpay</div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-bold">🏦 Wise / Bank / Pay on Arrival</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 7: UNIFIED OPERATIONS & CAR RENTALS */}
              {currentSlide === 7 && (
                <div className="space-y-5">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">End-to-End Operations</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Tours + Car Rentals + Dispatch in One Workspace</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      In destinations like Bali, Phuket, and across Southeast Asia, 70% of tour operators also run private car charters and scooter/vehicle fleets.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <h3 className="font-black text-slate-900 text-sm mb-2">🚗 Dedicated Fleet & Car Rental Engine</h3>
                      <p className="text-slate-600 leading-relaxed">Supports both Self-Drive and With-Driver charters, multi-day rate calculation, transmission/luggage specs, and automated rental reminders.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <h3 className="font-black text-slate-900 text-sm mb-2">✍️ Digital Waivers & B2B Invoices</h3>
                      <p className="text-slate-600 leading-relaxed">Guests sign mobile e-signature liability waivers (`/waiver/:id`) before pickup. Generate branded PDF invoices & custom proposals (`/proposal/:id`) in seconds.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <h3 className="font-black text-slate-900 text-sm mb-2">📲 WhatsApp & Email Dispatch</h3>
                      <p className="text-slate-600 leading-relaxed">Assign guides and drivers to daily manifests and trigger instant WhatsApp (Whapi) notifications to both the guest and driver.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 8: MARKET OPPORTUNITY */}
              {currentSlide === 8 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">Market Size</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">The $300B+ Tours, Activities & Ground Transport Market</h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Experiences are the fastest-growing segment in global travel, yet the most underserved by modern AI-native software.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-6 rounded-2xl bg-slate-900 text-white">
                      <div className="text-xs font-bold text-orange-400 uppercase">TAM (Global)</div>
                      <div className="text-3xl font-black my-2">$300B+ GMV</div>
                      <p className="text-xs text-slate-300 leading-relaxed">1.2M+ independent tour, activity, and local car rental operators worldwide seeking direct booking independence.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200">
                      <div className="text-xs font-bold text-slate-500 uppercase">SAM (APAC & Emerging Hubs)</div>
                      <div className="text-3xl font-black text-slate-900 my-2">250,000+ SMEs</div>
                      <p className="text-xs text-slate-600 leading-relaxed">Tour & charter operators across Indonesia, Thailand, Vietnam, Philippines, Japan, Australia, and Europe.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-orange-50 border border-orange-200">
                      <div className="text-xs font-bold text-orange-700 uppercase">Beachhead Target (36 Months)</div>
                      <div className="text-3xl font-black text-orange-600 my-2">5,000 Operators</div>
                      <p className="text-xs text-slate-700 leading-relaxed">Capturing 5,000 active operators at an average $65/mo ARPU = <strong>$3.9M+ ARR</strong> with 85%+ SaaS gross margins.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 9: BUSINESS MODEL */}
              {currentSlide === 9 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Business Model</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Predictable Recurring SaaS + High-Margin Expansion</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="text-xs font-black uppercase text-slate-400">Starter Plan</div>
                      <div className="text-2xl font-black text-slate-900 my-1">$29 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
                      <p className="text-slate-600 mb-3">For solo drivers & boutique activity hosts.</p>
                      <ul className="space-y-1 text-slate-700 font-medium">
                        <li>• Up to 10 Active Tours / Vehicles</li>
                        <li>• 0% Booking Commission (BYOPG)</li>
                        <li>• Custom Domain & Storefront Themes</li>
                      </ul>
                    </div>
                    <div className="p-5 rounded-2xl bg-orange-50 border-2 border-orange-500 relative">
                      <div className="text-xs font-black uppercase text-orange-600">Pro Plan (Core Driver)</div>
                      <div className="text-2xl font-black text-slate-900 my-1">$79 <span className="text-xs font-normal text-slate-500">/ mo</span></div>
                      <p className="text-slate-700 mb-3">For growing tour agencies & rental fleets.</p>
                      <ul className="space-y-1 text-slate-800 font-semibold">
                        <li>• Unlimited Tours & Car Rental Fleet</li>
                        <li>• Full Gemini AI Suite & Trip Planner</li>
                        <li>• WhatsApp Dispatch, Waivers & Invoices</li>
                      </ul>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-900 text-white">
                      <div className="text-xs font-black uppercase text-orange-400">Enterprise / Agency</div>
                      <div className="text-2xl font-black my-1">$199+ <span className="text-xs font-normal text-slate-400">/ mo</span></div>
                      <p className="text-slate-300 mb-3">For DMCs & multi-branch operators.</p>
                      <ul className="space-y-1 text-slate-200 font-medium">
                        <li>• Multi-Staff, Supplier & Agent Portals</li>
                        <li>• Dedicated Onboarding & Custom SLA</li>
                        <li>• API & Channel Manager Sync</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 10: COMPETITIVE LANDSCAPE */}
              {currentSlide === 10 && (
                <div className="space-y-5">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">Why We Win</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Competitive Landscape</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="p-3 rounded-tl-xl">Capability</th>
                          <th className="p-3 text-orange-400 font-black">Tripbone.com</th>
                          <th className="p-3">FareHarbor / Bokun</th>
                          <th className="p-3">WordPress + Plugins</th>
                          <th className="p-3 rounded-tr-xl">OTAs (Viator / GYG)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr className="bg-orange-50/40">
                          <td className="p-3 font-bold">Platform Booking Fee</td>
                          <td className="p-3 font-black text-emerald-600">0% Commission</td>
                          <td className="p-3 text-slate-600">1.5% – 6% per booking</td>
                          <td className="p-3 text-slate-600">0% (but $2k+ dev cost)</td>
                          <td className="p-3 text-rose-600 font-bold">20% – 30% Commission</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold">Launch Time</td>
                          <td className="p-3 font-black text-slate-900">Under 15 Minutes</td>
                          <td className="p-3 text-slate-600">Days / Weeks</td>
                          <td className="p-3 text-slate-600">4 – 8 Weeks</td>
                          <td className="p-3 text-slate-600">Days (Approval queue)</td>
                        </tr>
                        <tr className="bg-orange-50/40">
                          <td className="p-3 font-bold">AI Tour Writer & AI Trip Planner</td>
                          <td className="p-3 font-black text-emerald-600">Built-In Native</td>
                          <td className="p-3 text-slate-400">None</td>
                          <td className="p-3 text-slate-400">None</td>
                          <td className="p-3 text-slate-400">None for operator site</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold">SEA Local Gateways (Midtrans/Xendit)</td>
                          <td className="p-3 font-black text-emerald-600">Native BYOPG</td>
                          <td className="p-3 text-slate-500">Limited / Western-only</td>
                          <td className="p-3 text-slate-500">Fragile plugins</td>
                          <td className="p-3 text-slate-500">OTA holds funds</td>
                        </tr>
                        <tr className="bg-orange-50/40">
                          <td className="p-3 font-bold">Tours + Car Rentals + Waivers</td>
                          <td className="p-3 font-black text-emerald-600">All-in-One</td>
                          <td className="p-3 text-slate-500">Tours only</td>
                          <td className="p-3 text-slate-500">Separate paid plugins</td>
                          <td className="p-3 text-slate-500">No back-office tools</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 11: FOUNDER STORY & TRACTION */}
              {currentSlide === 11 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">Founder-Market Fit & Traction</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Built by a Bali Tour Operator Who Lived the Problem</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <h3 className="font-black text-slate-900 text-base">Origin Story: Battle-Tested in Bali</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Founder <strong>I Kadek Didi Suprapta</strong> built and operated real tour operations in Bali (<em>Bali Adventours</em>). Experiencing firsthand the pain of 25% OTA commissions, expensive web agencies, and late-night WhatsApp dispatch, he engineered Tripbone from the ground up to solve every operational bottleneck local operators face.
                      </p>
                      <p className="text-slate-600 leading-relaxed">
                        Because we sit in Bali—one of the world's densest ecosystems of independent tour, activity, and car charter operators—we have direct, on-the-ground access to thousands of operators for rapid onboarding and word-of-mouth growth.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
                      <h3 className="font-black text-orange-400 text-base">Live Production Milestones</h3>
                      <ul className="space-y-2.5 text-slate-200">
                        <li>✅ <strong>Full Multi-Tenant Cloud Architecture Live:</strong> Subdomain & custom domain routing, isolated Firestore workspaces, and automated SSL.</li>
                        <li>✅ <strong>8 Production Gemini AI Workflows:</strong> AI Tour Magic, OTA URL Importer, Catalog-Grounded Trip Planner, 24/7 Concierge, Email Booking Extractor, AI Proposals, and Blog Writer.</li>
                        <li>✅ <strong>Universal BYOPG Checkout Live:</strong> Stripe, Midtrans, Xendit, PayPal, Razorpay, Adyen, Bank Transfer, and Pay on Arrival.</li>
                        <li>✅ <strong>Active Operator Storefronts:</strong> Powering live Bali tour & car rental brands (e.g. Bali Adventours, Explore Bali Tours).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* PITCH SLIDE 12: VISION & THE ASK */}
              {currentSlide === 12 && (
                <div className="flex-1 flex flex-col justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white p-8 sm:p-12 rounded-2xl -m-2 sm:-m-4">
                  <div className="text-xs font-black text-orange-400 uppercase tracking-widest mb-2">
                    The Vision & Next Chapter
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
                    Empowering 100,000 Local Travel Operators to Own Their Future.
                  </h2>
                  <p className="text-sm sm:text-base text-slate-300 max-w-2xl mb-8 leading-relaxed">
                    We are scaling Tripbone from Bali across Southeast Asia and globally—turning independent tour, activity, and car rental operators into AI-powered direct-booking brands.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-xs">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="font-black text-orange-400 mb-1">1. Scale Operator Acquisition</div>
                      <p className="text-slate-300">Onboard 1,000+ tour & car rental operators across Bali, Thailand, and Vietnam via ground partnerships & creator channels.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="font-black text-orange-400 mb-1">2. 2-Way OTA Channel Sync</div>
                      <p className="text-slate-300">Real-time calendar & allotment synchronization across direct website bookings, Viator, GetYourGuide, and Klook.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="font-black text-orange-400 mb-1">3. Autonomous WhatsApp Agent</div>
                      <p className="text-slate-300">End-to-end conversational booking and payment link generation directly inside the operator's WhatsApp Business number.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm">
                    <div><strong>Website:</strong> <a href="https://tripbone.com" className="text-orange-400 underline">https://tripbone.com</a></div>
                    <div><strong>Founder:</strong> I Kadek Didi Suprapta</div>
                    <div><strong>Contact:</strong> baliadventours@gmail.com</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
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
            </>
          )}

        </div>

        {/* Slide Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold text-slate-400 shrink-0">
          <span>Slide {currentSlide} of {totalSlides}</span>
          <span>{deckMode === 'pitch' ? 'Tripbone.com — Investor & Partner Pitch Deck' : 'Google Cloud AI Builder Cup 2026 Submission'}</span>
        </div>

      </div>

      {/* Direct link guidance */}
      <div className="mt-6 text-xs text-slate-400 text-center max-w-lg">
        Tip: You can use your keyboard <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">←</kbd> and <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono">→</kbd> arrow keys to switch slides, or click <button onClick={() => window.print()} className="underline text-sky-400 font-bold">Print to PDF</button> to export.
      </div>
    </div>
  );
}
