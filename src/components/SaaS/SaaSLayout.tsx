import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Compass, ChevronDown, Sparkles, LayoutTemplate, BriefcaseBusiness, 
  Navigation, ShieldCheck, X, Menu, BookOpen, Store, Building2, HelpCircle, ArrowRight, CheckCircle2
} from 'lucide-react';
import { useSettings } from '../../lib/SettingsContext';
import { useAuth } from '../../lib/AuthContext';
import TopAnnouncementBar from '../TopAnnouncementBar';
import CustomFooterEmbed from '../CustomFooterEmbed';
import {
  DEFAULT_SAAS_HEADER_MENU,
  DEFAULT_SAAS_FOOTER_COLUMNS,
  SaaSMenuItem,
  SaaSFooterColumn,
  SaaSCustomPage,
  renderMenuIcon,
  normalizeSaaSPath,
  FloatingSaaSVisualEditor
} from './SaaSSiteEditor';
import { 
  initPostHog, 
  trackPostHogPageView, 
  trackPostHogMarketingCTA, 
  trackPostHogCookieConsent 
} from '../../lib/posthog';

export default function SaaSLayout() {
  const { settings, globalBrand } = useSettings();
  const { user, profile } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const mainContentRef = useRef<HTMLElement | null>(null);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const headerMenu: SaaSMenuItem[] = (globalBrand?.headerMenu && Array.isArray(globalBrand.headerMenu) && globalBrand.headerMenu.length > 0)
    ? globalBrand.headerMenu
    : DEFAULT_SAAS_HEADER_MENU;

  const footerColumns: SaaSFooterColumn[] = (globalBrand?.footerColumns && Array.isArray(globalBrand.footerColumns) && globalBrand.footerColumns.length > 0)
    ? globalBrand.footerColumns
    : DEFAULT_SAAS_FOOTER_COLUMNS;

  const customPages: SaaSCustomPage[] = Array.isArray(globalBrand?.customPages) ? globalBrand.customPages : [];
  const normPath = normalizeSaaSPath(location.pathname);
  const matchedCustomPage = customPages.find(cp => normalizeSaaSPath(cp.slug) === normPath);

  const isSuperAdminUser = Boolean(
    profile?.role === 'superadmin' ||
    (user?.email && ['baliadventours@gmail.com', 'admin@tripbone.com', 'kuotabox@gmail.com'].includes(user.email.toLowerCase()))
  );

  // Initialize PostHog for Tripbone.com main site platform
  useEffect(() => {
    initPostHog(null);
  }, []);

  // Track pageviews whenever route changes on main site
  useEffect(() => {
    trackPostHogPageView(location.pathname + location.search, {
      site_section: isHome ? 'marketing_home' : location.pathname.replace('/', '') || 'root',
      platform_scope: 'tripbone_main_site'
    });
  }, [location.pathname, location.search, isHome]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('tripbone-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setShowCookieBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('tripbone-cookie-consent', 'accepted');
    setShowCookieBanner(false);
    trackPostHogCookieConsent({ decision: 'accepted' });
  };

  const handleDeclineCookies = () => {
    localStorage.setItem('tripbone-cookie-consent', 'declined');
    setShowCookieBanner(false);
    trackPostHogCookieConsent({ decision: 'declined' });
  };

  const brandColor = globalBrand?.brandColor || '#00aa13';
  const saasFooterEmbed = (
    (globalBrand?.footerEmbedEnabled !== false && globalBrand?.footerEmbedCode) ||
    (settings?.footerEmbedEnabled !== false && settings?.footerEmbedCode)
  )?.trim() || null;

  const handleLoginClick = () => {
    trackPostHogMarketingCTA({
      ctaName: 'Log in',
      location: 'navbar_top',
      destination: '/login',
      section: 'main_header'
    });
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const isAiStudioPlatform = 
      hostname.includes('run.app') || 
      hostname.includes('ai.studio') || 
      hostname.includes('aistudio.google.com') || 
      hostname.includes('vercel.app') || 
      hostname.includes('web.app') || 
      hostname.includes('firebaseapp.com');

    if (isAiStudioPlatform) {
      window.location.href = '/login';
    } else {
      window.location.href = hostname === 'localhost' 
        ? `http://app.localhost${port}/login` 
        : 'https://app.tripbone.com/login';
    }
  };

  const handleSignupClick = () => {
    trackPostHogMarketingCTA({
      ctaName: 'Start Free Trial',
      location: 'navbar_top',
      destination: '/signup',
      section: 'main_header'
    });
    const hostname = window.location.hostname;
    const port = window.location.port ? `:${window.location.port}` : '';
    const isAiStudioPlatform = 
      hostname.includes('run.app') || 
      hostname.includes('ai.studio') || 
      hostname.includes('aistudio.google.com') || 
      hostname.includes('vercel.app') || 
      hostname.includes('web.app') || 
      hostname.includes('firebaseapp.com');

    if (isAiStudioPlatform) {
      window.location.href = '/signup';
    } else {
      window.location.href = hostname === 'localhost' 
        ? `http://app.localhost${port}/signup` 
        : 'https://app.tripbone.com/signup';
    }
  };

  return (
    <div className="min-h-screen font-sans selection-brand-color bg-[#f6f8f6] text-[#1a1d1b] overflow-x-hidden relative flex flex-col">
      <style>{`
        .text-brand { color: ${brandColor} !important; }
        .bg-brand { background-color: ${brandColor} !important; }
        .hover\\:text-brand:hover { color: ${brandColor} !important; }
        .hover\\:bg-brand:hover { background-color: ${brandColor} !important; }
        .border-brand { border-color: ${brandColor} !important; }
        .group\\/item:hover .group-hover\\/item\\:text-brand { color: ${brandColor} !important; }
        .selection-brand-color::selection { background-color: ${brandColor} !important; color: white !important; }
      `}</style>
      
      {/* Top Fixed Header with Clean Glassmorphism */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopAnnouncementBar />
        <header className="w-full transition-all duration-300 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] text-slate-900">
          <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
            
            {/* Logo + Primary Navigation */}
            <div className="flex items-center space-x-10">
              <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
                {globalBrand?.logoUrl || settings?.logoURL ? (
                  <img src={globalBrand?.logoUrl || settings?.logoURL} alt={globalBrand?.platformName || settings?.siteName || "Tripbone"} className="h-8 max-w-[150px] object-contain" />
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                      <Compass className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-black tracking-tight text-slate-950 font-sans">
                        {globalBrand?.platformName || settings?.siteName || "Tripbone"}
                      </span>
                      <span className="text-[10px] tracking-wider font-semibold text-slate-400 uppercase -mt-1 font-mono">
                        Tour OS & Engine
                      </span>
                    </div>
                  </>
                )}
              </Link>

              <nav className="hidden lg:flex items-center space-x-2 text-sm font-medium text-slate-600">
                {headerMenu.filter(m => !m.hidden).map((menuItem) => {
                  if (menuItem.type === 'mega') {
                    const isOpen = openDropdownId === menuItem.id;
                    return (
                      <div
                        key={menuItem.id}
                        className="relative"
                        onMouseEnter={() => setOpenDropdownId(menuItem.id)}
                        onMouseLeave={() => setOpenDropdownId(null)}
                      >
                        <button className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:text-slate-950 hover:bg-slate-100/80 text-slate-700">
                          <span className="font-semibold text-[13px]">{menuItem.label}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                        </button>

                        <div className={`absolute top-full left-0 w-[620px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-5 grid grid-cols-2 gap-3 transition-all duration-200 origin-top-left text-slate-900 ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                          {(menuItem.children || []).map((sub) => {
                            const colorCls =
                              sub.color === 'amber'
                                ? 'bg-amber-50 border-amber-100 group-hover/item:bg-amber-600 text-amber-700'
                                : sub.color === 'blue'
                                ? 'bg-blue-50 border-blue-100 group-hover/item:bg-blue-600 text-blue-700'
                                : sub.color === 'purple'
                                ? 'bg-purple-50 border-purple-100 group-hover/item:bg-purple-600 text-purple-600'
                                : sub.color === 'slate'
                                ? 'bg-slate-100 border-slate-200 group-hover/item:bg-slate-900 text-slate-700'
                                : 'bg-emerald-50 border-emerald-100 group-hover/item:bg-emerald-600 text-emerald-700';

                            return (
                              <Link
                                key={sub.id}
                                to={sub.href}
                                className={`group/item flex items-start space-x-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors ${sub.fullWidth ? 'col-span-2 border-t border-slate-100 mt-1 pt-3' : ''}`}
                              >
                                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 group-hover/item:text-white transition-colors ${colorCls}`}>
                                  {renderMenuIcon(sub.icon, 'w-4.5 h-4.5')}
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 text-xs mb-0.5 group-hover/item:text-emerald-700 transition-colors">{sub.label}</h4>
                                  {sub.description && (
                                    <p className="text-[11px] text-slate-500 leading-snug">{sub.description}</p>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  if (menuItem.type === 'dropdown') {
                    const isOpen = openDropdownId === menuItem.id;
                    return (
                      <div
                        key={menuItem.id}
                        className="relative"
                        onMouseEnter={() => setOpenDropdownId(menuItem.id)}
                        onMouseLeave={() => setOpenDropdownId(null)}
                      >
                        <button className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:text-slate-950 hover:bg-slate-100/80 text-slate-700">
                          <span className="font-semibold text-[13px]">{menuItem.label}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`} />
                        </button>

                        <div className={`absolute top-full left-0 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1 transition-all duration-200 origin-top-left text-slate-900 ${isOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                          {(menuItem.children || []).map((sub) => (
                            <Link
                              key={sub.id}
                              to={sub.href}
                              className="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-xs font-semibold text-slate-800 hover:text-emerald-700 transition-colors"
                            >
                              {renderMenuIcon(sub.icon, 'w-4 h-4 text-emerald-600')}
                              <span>{sub.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  const href = menuItem.href || '/';
                  const isExternal = /^https?:\/\//i.test(href);
                  return isExternal ? (
                    <a
                      key={menuItem.id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors hover:text-slate-950 hover:bg-slate-100/80"
                    >
                      {menuItem.label}
                    </a>
                  ) : (
                    <Link
                      key={menuItem.id}
                      to={href}
                      className="px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors hover:text-slate-950 hover:bg-slate-100/80"
                    >
                      {menuItem.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleLoginClick} 
                className="text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer text-slate-700 hover:text-slate-950 hover:bg-slate-100"
              >
                {user ? 'Go to Cockpit' : (globalBrand?.signInLabel || 'Sign In')}
              </button>

              {!user && (
                <button 
                  onClick={handleSignupClick} 
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4.5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer text-center"
                >
                  <span>{globalBrand?.ctaButtonLabel || 'Start Free Trial'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg transition-colors text-slate-700 hover:bg-slate-100 border border-slate-200"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile Drawer */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white text-slate-900 border-b border-[#dce1dc] px-6 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-xl max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                {headerMenu.filter(m => !m.hidden).map((menuItem) => {
                  if (menuItem.children && menuItem.children.length > 0) {
                    return (
                      <div key={menuItem.id} className="space-y-1 py-1">
                        <div className="px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                          {menuItem.label}
                        </div>
                        {menuItem.children.map((sub) => (
                          <Link
                            key={sub.id}
                            to={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-2 rounded-xl text-sm font-bold text-[#1a1d1b] hover:bg-[#f1f4f1]"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={menuItem.id}
                      to={menuItem.href || '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[#1a1d1b] hover:bg-[#f1f4f1]"
                    >
                      {menuItem.label}
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#dce1dc] flex flex-col gap-2">
                <button 
                  onClick={handleSignupClick}
                  className="btn-kelola-primary w-full py-3 rounded-full text-white text-xs font-bold text-center"
                >
                  {globalBrand?.ctaButtonLabel || 'Start 7-Day Free Trial'}
                </button>
              </div>
            </div>
          )}

        </header>
      </div>

      {/* Main Content Area */}
      <main ref={mainContentRef} id="tripbone-saas-main" className="flex-1 w-full relative">
        {matchedCustomPage ? (
          <div className="pt-20 bg-white">
            <section className="py-24 px-6 relative overflow-hidden bg-slate-950 text-white text-center">
              <div className="max-w-7xl mx-auto relative z-10">
                {matchedCustomPage.badge && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-emerald-300 mb-8">
                    <Sparkles className="w-4 h-4" />
                    <span>{matchedCustomPage.badge}</span>
                  </div>
                )}
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                  {matchedCustomPage.title}
                </h1>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12">
                  {matchedCustomPage.subtitle}
                </p>
                {matchedCustomPage.heroImage && (
                  <img
                    src={matchedCustomPage.heroImage}
                    alt={matchedCustomPage.title}
                    className="rounded-[2rem] border border-white/10 shadow-2xl mx-auto max-w-5xl w-full object-cover"
                  />
                )}
              </div>
            </section>

            {(matchedCustomPage.sections || []).map((sec, idx) => (
              <section key={sec.id || idx} className={`py-24 px-6 border-b border-slate-100 ${idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    {sec.badge && (
                      <div className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">
                        {sec.badge}
                      </div>
                    )}
                    <h2 className="text-4xl font-bold mb-6 text-slate-900">{sec.heading}</h2>
                    <p className="text-lg text-slate-600 mb-8">{sec.body}</p>
                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="space-y-4">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-3 text-slate-700 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {sec.imageUrl && (
                    <div className="relative">
                      <img src={sec.imageUrl} alt={sec.heading} className="rounded-[2rem] shadow-2xl border-[8px] border-white w-full" />
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <Outlet />
        )}
      </main>

      {/* Live Visual Editor & DOM Page Override Engine */}
      <FloatingSaaSVisualEditor
        globalBrand={globalBrand}
        pathname={location.pathname}
        mainRef={mainContentRef}
        isSuperAdminUser={isSuperAdminUser}
      />

      {/* Footer - Sleek Light Modern SaaS (Kelola style) */}
      <footer className="bg-[#e7ebe7] pt-16 pb-12 text-[#4b4f4c] border-t border-[#dce1dc] mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            
            {/* Column 1: Brand Info */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2.5 mb-5">
                {globalBrand?.logoUrl || settings?.logoURL ? (
                  <img src={globalBrand?.logoUrl || settings?.logoURL} alt={globalBrand?.platformName || settings?.siteName || "Tripbone"} className="h-8 max-w-[140px] object-contain" />
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-[#00aa13] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,170,19,0.3)]">
                      <Compass className="h-4.5 w-4.5 text-white" />
                    </div>
                    <span className="text-xl font-extrabold tracking-tight text-[#1a1d1b]">
                      {globalBrand?.platformName || settings?.siteName || "Tripbone"}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed mb-5 text-[#6f746f]">
                {globalBrand?.footerDescription || "Your own booking website. Not a widget. Not complicated. Drive direct sales, automate WhatsApp dispatches, and eliminate booking commissions."}
              </p>
              <div className="text-xs text-[#4b4f4c] space-y-1.5">
                <p className="flex items-center gap-2">
                  <span className="font-bold text-[#1a1d1b]">Support:</span>
                  <a href={`mailto:${globalBrand?.supportEmail || 'support@tripbone.com'}`} className="text-[#00790d] hover:underline">
                    {globalBrand?.supportEmail || 'support@tripbone.com'}
                  </a>
                </p>
              </div>
            </div>
            
            {/* Dynamic Footer Columns */}
            {footerColumns.map((col) => (
              <div key={col.id}>
                <h4 className="text-[#1a1d1b] font-bold text-xs mb-4 tracking-wider uppercase">{col.title}</h4>
                <ul className="space-y-2.5 text-xs text-[#4b4f4c]">
                  {(col.links || []).map((lnk) => (
                    <li key={lnk.id}>
                      {/^https?:\/\//i.test(lnk.href) ? (
                        <a href={lnk.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#00790d] transition-colors">
                          {lnk.label}
                        </a>
                      ) : (
                        <Link to={lnk.href} className="hover:text-[#00790d] transition-colors">
                          {lnk.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {saasFooterEmbed && (
            <div className="border-t border-[#dce1dc] pt-6 pb-2 flex justify-center items-center">
              <CustomFooterEmbed html={saasFooterEmbed} />
            </div>
          )}
          
          <div className="border-t border-[#dce1dc] pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#6f746f]">
            <p>&copy; {new Date().getFullYear()} {globalBrand?.platformName || "Tripbone"}. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {globalBrand?.twitterUrl && (
                <a href={globalBrand.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1d1b] transition-colors">Twitter</a>
              )}
              {globalBrand?.linkedinUrl && (
                <a href={globalBrand.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1d1b] transition-colors">LinkedIn</a>
              )}
              {globalBrand?.facebookUrl && (
                <a href={globalBrand.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1d1b] transition-colors">Facebook</a>
              )}
              {globalBrand?.instagramUrl && (
                <a href={globalBrand.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1d1b] transition-colors">Instagram</a>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md bg-white border border-[#dce1dc] p-5 rounded-3xl shadow-[0_18px_44px_rgba(6,30,10,0.12)] z-[9999]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#1a1d1b] mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00aa13]"></span>
                Cookie Preference
              </h3>
              <p className="text-xs text-[#4b4f4c] leading-relaxed">
                We use cookies to optimize your platform experience, analyze traffic, and support personalized marketing for your tour business. Refer to our <Link to="/cookies" className="underline text-[#00790d] hover:text-[#00aa13]">Cookie Policy</Link>.
              </p>
            </div>
            <button onClick={() => setShowCookieBanner(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2.5 mt-4 justify-end">
            <button 
              onClick={handleDeclineCookies}
              className="px-3.5 py-1.5 text-xs font-bold text-[#6f746f] hover:text-[#1a1d1b] hover:bg-[#f1f4f1] rounded-full transition-all"
            >
              Decline
            </button>
            <button 
              onClick={handleAcceptCookies}
              className="btn-kelola-primary px-4 py-2 text-xs font-bold text-white rounded-full cursor-pointer"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
