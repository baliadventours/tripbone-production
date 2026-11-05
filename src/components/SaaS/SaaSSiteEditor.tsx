import React, { useState, useEffect } from 'react';
import {
  Edit, Image as ImageIcon, Type, Menu as MenuIcon, Plus, Trash2,
  ChevronUp, ChevronDown, Save, X, Upload, RotateCcw, ExternalLink,
  Check, Sparkles, Navigation, BriefcaseBusiness, LayoutTemplate,
  ShieldCheck, Store, BookOpen, HelpCircle, Globe, FileText, Eye, Layers
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadImage } from '../../lib/imgbb';
import { sanitizeFirestoreData } from '../../services/payment/PaymentService';

export interface SaaSMenuSubItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  icon?: string;
  color?: string;
  fullWidth?: boolean;
}

export interface SaaSMenuItem {
  id: string;
  label: string;
  href?: string;
  type: 'link' | 'mega' | 'dropdown';
  children?: SaaSMenuSubItem[];
  hidden?: boolean;
}

export interface SaaSFooterLink {
  id: string;
  label: string;
  href: string;
}

export interface SaaSFooterColumn {
  id: string;
  title: string;
  links: SaaSFooterLink[];
}

export interface SaaSCustomPageSection {
  id: string;
  badge?: string;
  heading: string;
  body: string;
  bullets?: string[];
  imageUrl?: string;
}

export interface SaaSCustomPage {
  slug: string; // e.g. "/partners"
  title: string;
  badge?: string;
  subtitle: string;
  heroImage?: string;
  sections: SaaSCustomPageSection[];
}

export interface PageOverrideData {
  texts?: Record<string, string>;
  images?: Record<string, string>;
}

export const DEFAULT_SAAS_HEADER_MENU: SaaSMenuItem[] = [
  {
    id: 'platform-features',
    label: 'Platform Features',
    type: 'mega',
    children: [
      {
        id: 'feat-ai',
        label: 'Gemini AI Tour Studio',
        href: '/features/ai',
        description: 'Auto-generate tour itineraries, SEO copy, and multi-language translations.',
        icon: 'Sparkles',
        color: 'emerald'
      },
      {
        id: 'feat-ops',
        label: 'WhatsApp & Driver Dispatch',
        href: '/features/operations',
        description: 'Automated passenger notifications, live pickup GPS pins, and manifests.',
        icon: 'Navigation',
        color: 'amber'
      },
      {
        id: 'feat-sales',
        label: 'BYOPG Payment Engine',
        href: '/features/sales',
        description: 'Stripe, Midtrans, Xendit, PayPal, & offline transfers direct to your account.',
        icon: 'BriefcaseBusiness',
        color: 'blue'
      },
      {
        id: 'feat-design',
        label: 'Mobile-First Storefronts',
        href: '/features/design',
        description: 'JoyTime & modern themes with custom domains and sub-second loading.',
        icon: 'LayoutTemplate',
        color: 'purple'
      },
      {
        id: 'feat-infra',
        label: 'Multi-Role Architecture & 0% Take Rate',
        href: '/features/infrastructure',
        description: 'Admin, Supplier, Agent, and Staff roles with automated settlement logs.',
        icon: 'ShieldCheck',
        color: 'slate',
        fullWidth: true
      }
    ]
  },
  {
    id: 'industries',
    label: 'Industries',
    type: 'link',
    href: '/industries'
  },
  {
    id: 'compare',
    label: 'Compare',
    type: 'link',
    href: '/compare'
  },
  {
    id: 'pricing',
    label: 'Pricing',
    type: 'link',
    href: '/pricing'
  },
  {
    id: 'academy',
    label: 'Academy',
    type: 'link',
    href: '/docs'
  },
  {
    id: 'resources',
    label: 'Resources',
    type: 'dropdown',
    children: [
      {
        id: 'res-directory',
        label: 'Live Client Showcases',
        href: '/directory',
        icon: 'Store'
      },
      {
        id: 'res-blog',
        label: 'Operator Playbook & Blog',
        href: '/blog',
        icon: 'BookOpen'
      },
      {
        id: 'res-storyboard',
        label: 'Pitch Storyboard & Vision',
        href: '/storyboard',
        icon: 'Sparkles'
      },
      {
        id: 'res-contact',
        label: 'Contact Support',
        href: '/contact',
        icon: 'HelpCircle'
      }
    ]
  }
];

export const DEFAULT_SAAS_FOOTER_COLUMNS: SaaSFooterColumn[] = [
  {
    id: 'col-industries',
    title: 'Industries',
    links: [
      { id: 'ind-1', label: 'Day Tour Operator', href: '/industries/day-tours' },
      { id: 'ind-2', label: 'ATV Operator', href: '/industries/atv-offroad' },
      { id: 'ind-3', label: 'Rafting Operator', href: '/industries/rafting-outdoor' },
      { id: 'ind-4', label: 'Boat Charters & Cruises', href: '/industries/boat-charters' },
      { id: 'ind-5', label: 'Food & Culinary Tours', href: '/industries/food-culinary' },
      { id: 'ind-6', label: 'Equipment Rentals', href: '/industries/rentals' }
    ]
  },
  {
    id: 'col-compare',
    title: 'Compare Us',
    links: [
      { id: 'cmp-1', label: 'Tripbone vs Bokun', href: '/compare/bokun' },
      { id: 'cmp-2', label: 'Tripbone vs FareHarbor', href: '/compare/fareharbor' },
      { id: 'cmp-3', label: 'Tripbone vs Rezdy', href: '/compare/rezdy' },
      { id: 'cmp-4', label: 'Tripbone vs Peek Pro', href: '/compare/peek-pro' },
      { id: 'cmp-5', label: 'Tripbone vs Regiondo', href: '/compare/regiondo' },
      { id: 'cmp-6', label: 'Tripbone vs Checkfront', href: '/compare/checkfront' }
    ]
  },
  {
    id: 'col-platform',
    title: 'Platform & Company',
    links: [
      { id: 'plt-1', label: 'Platform Features', href: '/features' },
      { id: 'plt-2', label: 'Pricing & Plans', href: '/pricing' },
      { id: 'plt-3', label: 'Live Store Demos', href: '/directory' },
      { id: 'plt-4', label: 'About Us', href: '/about' },
      { id: 'plt-5', label: 'Blog / Guides', href: '/blog' },
      { id: 'plt-6', label: 'Contact Support', href: '/contact' }
    ]
  },
  {
    id: 'col-legal',
    title: 'Legal',
    links: [
      { id: 'leg-1', label: 'Terms of Service', href: '/terms' },
      { id: 'leg-2', label: 'Privacy Policy', href: '/privacy' },
      { id: 'leg-3', label: 'Cookie Policy', href: '/cookies' }
    ]
  }
];

export const KNOWN_SAAS_PAGES = [
  { path: '/', label: 'Home Page (/)' },
  { path: '/features', label: 'All Features Overview (/features)' },
  { path: '/features/sales', label: 'Sales & Booking Engine (/features/sales)' },
  { path: '/features/ai', label: 'Gemini AI Tour Studio (/features/ai)' },
  { path: '/features/operations', label: 'Operations & WhatsApp Dispatch (/features/operations)' },
  { path: '/features/design', label: 'Mobile-First Storefronts (/features/design)' },
  { path: '/features/infrastructure', label: 'Multi-Role & Infrastructure (/features/infrastructure)' },
  { path: '/industries', label: 'Industries Hub (/industries)' },
  { path: '/compare', label: 'Compare Platforms (/compare)' },
  { path: '/pricing', label: 'Pricing & Plans (/pricing)' },
  { path: '/directory', label: 'Live Client Showcases (/directory)' },
  { path: '/about', label: 'About Us (/about)' },
  { path: '/contact', label: 'Contact Support (/contact)' },
  { path: '/terms', label: 'Terms of Service (/terms)' },
  { path: '/privacy', label: 'Privacy Policy (/privacy)' },
  { path: '/cookies', label: 'Cookie Policy (/cookies)' }
];

export function renderMenuIcon(iconName?: string, className = 'w-4 h-4') {
  switch (iconName) {
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Navigation': return <Navigation className={className} />;
    case 'BriefcaseBusiness': return <BriefcaseBusiness className={className} />;
    case 'LayoutTemplate': return <LayoutTemplate className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'Store': return <Store className={className} />;
    case 'BookOpen': return <BookOpen className={className} />;
    case 'HelpCircle': return <HelpCircle className={className} />;
    case 'FileText': return <FileText className={className} />;
    default: return <Globe className={className} />;
  }
}

/**
 * Helper to get and set pure text of an element while preserving any child SVG/icons.
 */
export function getElementDirectOrFullText(el: HTMLElement): string {
  if (el.dataset.cmsOrigText !== undefined) {
    return el.dataset.cmsOrigText;
  }
  const text = (el.innerText || el.textContent || '').trim();
  return text;
}

export function applyElementTextPreservingIcons(el: HTMLElement, newText: string) {
  // Check if element has only text nodes
  const hasElementChildren = Array.from(el.children).length > 0;
  if (!hasElementChildren) {
    el.textContent = newText;
    return;
  }
  // If element has a single span child alongside an svg icon (e.g., badge or button)
  const spans = Array.from(el.children).filter(c => c.tagName === 'SPAN') as HTMLElement[];
  const svgs = Array.from(el.children).filter(c => c.tagName.toLowerCase() === 'svg');
  if (spans.length === 1 && svgs.length >= 1 && el.children.length === spans.length + svgs.length) {
    spans[0].textContent = newText;
    return;
  }
  // If element has direct text nodes alongside an SVG icon (e.g., <li><svg /> Multi Package Options...</li>)
  const textNodes = Array.from(el.childNodes).filter(
    n => n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim().length > 0
  );
  if (textNodes.length > 0) {
    textNodes[textNodes.length - 1].textContent = ' ' + newText;
    for (let i = 0; i < textNodes.length - 1; i++) {
      textNodes[i].textContent = '';
    }
    return;
  }
  // Fallback if no non-empty text node found
  el.textContent = newText;
}

/**
 * Normalizes pathname so trailing slashes match consistently
 */
export function normalizeSaaSPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

/**
 * Saves updated globalBrand fields to Firestore settings/globalBrand
 */
export async function saveGlobalSiteCMS(updatedBrandPatch: Record<string, any>) {
  const sanitized = sanitizeFirestoreData({
    ...updatedBrandPatch,
    updatedAt: new Date().toISOString()
  });
  await setDoc(doc(db, 'settings', 'globalBrand'), sanitized, { merge: true });
}

interface FloatingVisualEditorProps {
  globalBrand: any;
  pathname: string;
  mainRef: React.RefObject<HTMLElement | null>;
  isSuperAdminUser: boolean;
}

export const FloatingSaaSVisualEditor: React.FC<FloatingVisualEditorProps> = ({
  globalBrand,
  pathname,
  mainRef,
  isSuperAdminUser
}) => {
  const normPath = normalizeSaaSPath(pathname);
  const [editMode, setEditMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('cms_edit') === '1';
    }
    return false;
  });

  const [activeModal, setActiveModal] = useState<
    | null
    | { type: 'text'; key: string; origText: string; currentText: string; el: HTMLElement }
    | { type: 'image'; key: string; origSrc: string; currentSrc: string; el: HTMLImageElement }
    | { type: 'menu' }
    | { type: 'page_scanner' }
  >(null);

  const [draftValue, setDraftValue] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Scanned elements for the Page Elements Drawer
  const [scannedTexts, setScannedTexts] = useState<Array<{ key: string; orig: string; current: string; tag: string; el: HTMLElement }>>([]);
  const [scannedImages, setScannedImages] = useState<Array<{ key: string; orig: string; current: string; alt: string; el: HTMLImageElement }>>([]);

  // Menu state for live menu editor modal
  const [menuDraft, setMenuDraft] = useState<SaaSMenuItem[]>([]);

  useEffect(() => {
    setMenuDraft(globalBrand?.headerMenu || DEFAULT_SAAS_HEADER_MENU);
  }, [globalBrand?.headerMenu]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Apply saved overrides whenever pathname, globalBrand.pageOverrides, or DOM changes
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const applyOverrides = () => {
      const pageData: PageOverrideData = globalBrand?.pageOverrides?.[normPath] || {};
      const textMap = pageData.texts || {};
      const imgMap = pageData.images || {};

      // 1. Tag and apply text overrides
      const textCandidateEls = container.querySelectorAll<HTMLElement>(
        'h1, h2, h3, h4, p, li, blockquote, .font-mono'
      );
      textCandidateEls.forEach((el, idx) => {
        // Skip elements that contain nested block candidates (e.g. a div that wraps multiple paragraphs)
        if (el.querySelector('h1, h2, h3, h4, p, li')) return;
        const rawText = (el.innerText || el.textContent || '').trim();
        if (!rawText && !el.dataset.cmsOrigText) return;

        if (!el.dataset.cmsOrigText) {
          el.dataset.cmsOrigText = rawText;
        }
        if (!el.dataset.cmsKey) {
          el.dataset.cmsKey = `txt_${idx}_${el.tagName.toLowerCase()}`;
        }

        const orig = el.dataset.cmsOrigText;
        const key = el.dataset.cmsKey;
        const overrideVal = textMap[key] ?? (orig ? textMap[orig] : undefined);
        if (overrideVal !== undefined) {
          applyElementTextPreservingIcons(el, overrideVal);
        } else if (orig && (el.innerText || '').trim() !== orig) {
          // Restore original if override was cleared
          applyElementTextPreservingIcons(el, orig);
        }
      });

      // 2. Tag and apply image overrides
      const imgEls = container.querySelectorAll<HTMLImageElement>('img');
      imgEls.forEach((img, idx) => {
        const rawSrc = img.getAttribute('src') || '';
        if (!rawSrc && !img.dataset.cmsOrigSrc) return;

        if (!img.dataset.cmsOrigSrc) {
          img.dataset.cmsOrigSrc = rawSrc;
        }
        if (!img.dataset.cmsImgKey) {
          img.dataset.cmsImgKey = `img_${idx}`;
        }

        const origSrc = img.dataset.cmsOrigSrc;
        const key = img.dataset.cmsImgKey;
        const overrideSrc = imgMap[key] ?? (origSrc ? imgMap[origSrc] : undefined);
        if (overrideSrc && img.src !== overrideSrc) {
          img.src = overrideSrc;
        } else if (!overrideSrc && origSrc && img.getAttribute('src') !== origSrc) {
          img.src = origSrc;
        }
      });
    };

    // Run immediately and after short delays for lazy-loaded / animated components
    applyOverrides();
    const t1 = setTimeout(applyOverrides, 180);
    const t2 = setTimeout(applyOverrides, 600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [normPath, globalBrand?.pageOverrides, mainRef]);

  // Attach interactive click-to-edit listeners when editMode is active
  useEffect(() => {
    const container = mainRef.current;
    if (!container || !editMode) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !container.contains(target)) return;

      const img = target.closest('img') as HTMLImageElement | null;
      if (img) {
        img.style.outline = '3px dashed #10b981';
        img.style.outlineOffset = '4px';
        img.style.cursor = 'pointer';
        return;
      }

      const txtEl = target.closest('h1, h2, h3, h4, p, li, blockquote, .font-mono') as HTMLElement | null;
      if (txtEl && !txtEl.querySelector('h1, h2, h3, h4, p, li')) {
        txtEl.style.outline = '2px dashed #10b981';
        txtEl.style.outlineOffset = '3px';
        txtEl.style.cursor = 'pointer';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !container.contains(target)) return;
      const img = target.closest('img') as HTMLImageElement | null;
      if (img) {
        img.style.outline = '';
        img.style.outlineOffset = '';
        img.style.cursor = '';
      }
      const txtEl = target.closest('h1, h2, h3, h4, p, li, blockquote, .font-mono') as HTMLElement | null;
      if (txtEl) {
        txtEl.style.outline = '';
        txtEl.style.outlineOffset = '';
        txtEl.style.cursor = '';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !container.contains(target)) return;

      const img = target.closest('img') as HTMLImageElement | null;
      if (img) {
        e.preventDefault();
        e.stopPropagation();
        const key = img.dataset.cmsImgKey || 'img_0';
        const origSrc = img.dataset.cmsOrigSrc || img.src;
        const currentSrc = img.src;
        setDraftValue(currentSrc);
        setActiveModal({
          type: 'image',
          key,
          origSrc,
          currentSrc,
          el: img
        });
        return;
      }

      const txtEl = target.closest('h1, h2, h3, h4, p, li, blockquote, .font-mono') as HTMLElement | null;
      if (txtEl && !txtEl.querySelector('h1, h2, h3, h4, p, li')) {
        e.preventDefault();
        e.stopPropagation();
        const key = txtEl.dataset.cmsKey || 'txt_0';
        const origText = txtEl.dataset.cmsOrigText || (txtEl.innerText || '').trim();
        const currentText = (txtEl.innerText || '').trim();
        setDraftValue(currentText);
        setActiveModal({
          type: 'text',
          key,
          origText,
          currentText,
          el: txtEl
        });
      }
    };

    container.addEventListener('mouseover', handleMouseOver, true);
    container.addEventListener('mouseout', handleMouseOut, true);
    container.addEventListener('click', handleClick, true);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver, true);
      container.removeEventListener('mouseout', handleMouseOut, true);
      container.removeEventListener('click', handleClick, true);
    };
  }, [editMode, mainRef, normPath]);

  const scanCurrentPageElements = () => {
    const container = mainRef.current;
    if (!container) return;

    const texts: Array<{ key: string; orig: string; current: string; tag: string; el: HTMLElement }> = [];
    const textEls = container.querySelectorAll<HTMLElement>('h1, h2, h3, h4, p, li, .font-mono');
    textEls.forEach((el, idx) => {
      if (el.querySelector('h1, h2, h3, h4, p, li')) return;
      const current = (el.innerText || '').trim();
      if (!current) return;
      const orig = el.dataset.cmsOrigText || current;
      const key = el.dataset.cmsKey || `txt_${idx}_${el.tagName.toLowerCase()}`;
      el.dataset.cmsOrigText = orig;
      el.dataset.cmsKey = key;
      texts.push({ key, orig, current, tag: el.tagName.toLowerCase(), el });
    });

    const imgs: Array<{ key: string; orig: string; current: string; alt: string; el: HTMLImageElement }> = [];
    const imgEls = container.querySelectorAll<HTMLImageElement>('img');
    imgEls.forEach((img, idx) => {
      const current = img.getAttribute('src') || '';
      if (!current) return;
      const orig = img.dataset.cmsOrigSrc || current;
      const key = img.dataset.cmsImgKey || `img_${idx}`;
      img.dataset.cmsOrigSrc = orig;
      img.dataset.cmsImgKey = key;
      imgs.push({ key, orig, current, alt: img.alt || `Image #${idx + 1}`, el: img });
    });

    setScannedTexts(texts);
    setScannedImages(imgs);
    setActiveModal({ type: 'page_scanner' });
  };

  const handleSaveTextOverride = async (key: string, origText: string, newText: string, el?: HTMLElement) => {
    setSaving(true);
    try {
      const existingOverrides = { ...(globalBrand?.pageOverrides || {}) };
      const pageEntry: PageOverrideData = {
        texts: { ...(existingOverrides[normPath]?.texts || {}) },
        images: { ...(existingOverrides[normPath]?.images || {}) }
      };

      if (newText.trim() === origText.trim()) {
        delete pageEntry.texts![key];
        delete pageEntry.texts![origText];
      } else {
        pageEntry.texts![key] = newText;
        pageEntry.texts![origText] = newText;
      }

      existingOverrides[normPath] = pageEntry;
      if (el) {
        applyElementTextPreservingIcons(el, newText);
      }
      await saveGlobalSiteCMS({ pageOverrides: existingOverrides });
      showToast('Text updated & saved to Tripbone live site!');
      setActiveModal(null);
    } catch (e: any) {
      alert('Failed to save text: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveImageOverride = async (key: string, origSrc: string, newSrc: string, el?: HTMLImageElement) => {
    setSaving(true);
    try {
      const existingOverrides = { ...(globalBrand?.pageOverrides || {}) };
      const pageEntry: PageOverrideData = {
        texts: { ...(existingOverrides[normPath]?.texts || {}) },
        images: { ...(existingOverrides[normPath]?.images || {}) }
      };

      if (newSrc.trim() === origSrc.trim()) {
        delete pageEntry.images![key];
        delete pageEntry.images![origSrc];
      } else {
        pageEntry.images![key] = newSrc;
        pageEntry.images![origSrc] = newSrc;
      }

      existingOverrides[normPath] = pageEntry;
      if (el) {
        el.src = newSrc;
      }
      await saveGlobalSiteCMS({ pageOverrides: existingOverrides });
      showToast('Image updated & saved to Tripbone live site!');
      setActiveModal(null);
    } catch (e: any) {
      alert('Failed to save image: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setDraftValue(uploadedUrl);
      showToast('Image uploaded! Click Save to publish.');
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingImg(false);
    }
  };

  const handleSaveMenuDraft = async () => {
    setSaving(true);
    try {
      await saveGlobalSiteCMS({ headerMenu: menuDraft });
      showToast('Main Navigation Menu saved!');
      setActiveModal(null);
    } catch (err: any) {
      alert('Failed to save menu: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Only show the floating editor bar if the logged-in user is a SuperAdmin (or if ?cms_edit=1 is active)
  if (!isSuperAdminUser && !editMode) {
    return null;
  }

  return (
    <>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-[10000] bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Floating SuperAdmin CMS Bar (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-[9998] flex flex-wrap items-center gap-2 bg-slate-950/95 text-white border border-slate-800 px-3.5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-black tracking-wide uppercase text-slate-200">Tripbone CMS</span>
        </div>

        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
            editMode
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
          <span>{editMode ? 'Click Any Text/Image (ON)' : 'Visual Edit Page'}</span>
        </button>

        <button
          onClick={scanCurrentPageElements}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
          title="List all texts & images on this page"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>All Page Content</span>
        </button>

        <button
          onClick={() => {
            setMenuDraft(globalBrand?.headerMenu || DEFAULT_SAAS_HEADER_MENU);
            setActiveModal({ type: 'menu' });
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <MenuIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>Customize Menu</span>
        </button>
      </div>

      {/* Modal 1: Edit Single Text Element */}
      {activeModal?.type === 'text' && (
        <div className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base flex items-center gap-2">
                <Type className="w-5 h-5 text-emerald-600" />
                <span>Edit Page Text ({normPath})</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Text Content</label>
              <textarea
                rows={4}
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                Original default: <span className="italic">{activeModal.origText.slice(0, 120)}</span>
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setDraftValue(activeModal.origText)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Original
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveTextOverride(activeModal.key, activeModal.origText, draftValue, activeModal.el)}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Text'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Change Single Image Element */}
      {activeModal?.type === 'image' && (
        <div className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                <span>Change Page Image ({normPath})</span>
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-100 p-3 border border-slate-200 flex items-center justify-center max-h-52 overflow-hidden">
              <img src={draftValue || activeModal.currentSrc} alt="Preview" className="max-h-44 object-contain rounded-xl" />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Upload New Image File</label>
                <label className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 text-xs font-bold cursor-pointer transition">
                  <Upload className="w-4 h-4" />
                  <span>{uploadingImg ? 'Uploading & Optimizing to WebP...' : 'Choose Image File to Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleUploadImageFile} className="hidden" disabled={uploadingImg} />
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Or Paste Image URL</label>
                <input
                  type="text"
                  value={draftValue}
                  onChange={(e) => setDraftValue(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setDraftValue(activeModal.origSrc)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Default Image
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving || uploadingImg}
                  onClick={() => handleSaveImageOverride(activeModal.key, activeModal.origSrc, draftValue, activeModal.el)}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Image'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: All Page Content Scanner Drawer (Edit any text or image on current page in a clean list) */}
      {activeModal?.type === 'page_scanner' && (
        <div className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-black text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>Edit All Content on Page: <code className="text-emerald-700 font-mono">{normPath}</code></span>
                </h3>
                <p className="text-xs text-slate-500">Edit any image or text block on this page directly below.</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl hover:bg-slate-200 text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Images Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Page Images ({scannedImages.length})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scannedImages.map((item) => (
                    <div key={item.key} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col gap-3">
                      <div className="h-36 bg-white rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden p-2">
                        <img src={item.current} alt={item.alt} className="max-h-32 object-contain rounded" />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-700 truncate">{item.alt}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setDraftValue(item.current);
                            setActiveModal({
                              type: 'image',
                              key: item.key,
                              origSrc: item.orig,
                              currentSrc: item.current,
                              el: item.el
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 cursor-pointer"
                        >
                          Change Image
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Texts Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-600" />
                  <span>Page Headings &amp; Text Blocks ({scannedTexts.length})</span>
                </h4>
                <div className="space-y-2.5">
                  {scannedTexts.map((item) => (
                    <div key={item.key} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <span className="inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700 mr-2">
                          {item.tag}
                        </span>
                        <span className="text-xs font-medium text-slate-800 break-words">{item.current}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDraftValue(item.current);
                          setActiveModal({
                            type: 'text',
                            key: item.key,
                            origText: item.orig,
                            currentText: item.current,
                            el: item.el
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 cursor-pointer"
                      >
                        Edit Text
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Customize Top Navigation Menu */}
      {activeModal?.type === 'menu' && (
        <div className="fixed inset-0 z-[10001] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-black text-base flex items-center gap-2">
                  <MenuIcon className="w-5 h-5 text-emerald-600" />
                  <span>Customize Tripbone.com Navigation Menu</span>
                </h3>
                <p className="text-xs text-slate-500">Add, rename, reorder, or customize top menu links and dropdown items.</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl hover:bg-slate-200 text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {menuDraft.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-black text-slate-400">#{idx + 1}</span>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => {
                        const next = [...menuDraft];
                        next[idx] = { ...item, label: e.target.value };
                        setMenuDraft(next);
                      }}
                      placeholder="Menu Label"
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900"
                    />
                    <select
                      value={item.type}
                      onChange={(e) => {
                        const nextType = e.target.value as 'link' | 'mega' | 'dropdown';
                        const next = [...menuDraft];
                        next[idx] = {
                          ...item,
                          type: nextType,
                          children: nextType === 'link' ? undefined : (item.children || []),
                          href: nextType === 'link' ? (item.href || '/') : undefined
                        };
                        setMenuDraft(next);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700"
                    >
                      <option value="link">Direct Link</option>
                      <option value="dropdown">Dropdown Menu</option>
                      <option value="mega">Mega Menu (2 Columns)</option>
                    </select>

                    {item.type === 'link' && (
                      <input
                        type="text"
                        value={item.href || ''}
                        onChange={(e) => {
                          const next = [...menuDraft];
                          next[idx] = { ...item, href: e.target.value };
                          setMenuDraft(next);
                        }}
                        placeholder="/pricing or https://..."
                        className="flex-1 min-w-[160px] px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono text-slate-800"
                      />
                    )}

                    <div className="ml-auto flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          const next = [...menuDraft];
                          [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                          setMenuDraft(next);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === menuDraft.length - 1}
                        onClick={() => {
                          const next = [...menuDraft];
                          [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                          setMenuDraft(next);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 disabled:opacity-30"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMenuDraft(menuDraft.filter((_, i) => i !== idx))}
                        className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600"
                        title="Delete Menu Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dropdown / Mega-menu Children */}
                  {(item.type === 'dropdown' || item.type === 'mega') && (
                    <div className="pl-6 border-l-2 border-emerald-200 space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">Dropdown Sub-Items</span>
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...menuDraft];
                            const children = [...(item.children || [])];
                            children.push({
                              id: `sub_${Date.now()}`,
                              label: 'New Sub-Link',
                              href: '/features',
                              description: 'Sub-item description',
                              icon: 'Sparkles'
                            });
                            next[idx] = { ...item, children };
                            setMenuDraft(next);
                          }}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Sub-Item
                        </button>
                      </div>

                      {(item.children || []).map((sub, sIdx) => (
                        <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 items-center">
                          <input
                            type="text"
                            value={sub.label}
                            onChange={(e) => {
                              const next = [...menuDraft];
                              const children = [...(item.children || [])];
                              children[sIdx] = { ...sub, label: e.target.value };
                              next[idx] = { ...item, children };
                              setMenuDraft(next);
                            }}
                            placeholder="Title"
                            className="sm:col-span-4 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold"
                          />
                          <input
                            type="text"
                            value={sub.href}
                            onChange={(e) => {
                              const next = [...menuDraft];
                              const children = [...(item.children || [])];
                              children[sIdx] = { ...sub, href: e.target.value };
                              next[idx] = { ...item, children };
                              setMenuDraft(next);
                            }}
                            placeholder="/path"
                            className="sm:col-span-3 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono"
                          />
                          <input
                            type="text"
                            value={sub.description || ''}
                            onChange={(e) => {
                              const next = [...menuDraft];
                              const children = [...(item.children || [])];
                              children[sIdx] = { ...sub, description: e.target.value };
                              next[idx] = { ...item, children };
                              setMenuDraft(next);
                            }}
                            placeholder="Description (optional)"
                            className="sm:col-span-4 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = [...menuDraft];
                              const children = (item.children || []).filter((_, i) => i !== sIdx);
                              next[idx] = { ...item, children };
                              setMenuDraft(next);
                            }}
                            className="sm:col-span-1 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg justify-self-end"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  setMenuDraft([
                    ...menuDraft,
                    {
                      id: `menu_${Date.now()}`,
                      label: 'New Menu Link',
                      type: 'link',
                      href: '/pricing'
                    }
                  ]);
                }}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Plus className="w-4 h-4" /> Add Top-Level Menu Item
              </button>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMenuDraft(DEFAULT_SAAS_HEADER_MENU)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset to Default Menu
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveMenuDraft}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Navigation Menu'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Full SuperAdmin Panel Component for managing all Tripbone.com pages, menus, footer links, and custom pages
 */
export const SaaSSiteCMSManager: React.FC<{
  globalBrand: any;
  setGlobalBrand: (val: any) => void;
  isDarkMode?: boolean;
}> = ({ globalBrand, setGlobalBrand, isDarkMode = false }) => {
  const [cmsSubTab, setCmsSubTab] = useState<'pages' | 'header_menu' | 'footer_menu' | 'custom_pages'>('pages');
  const [selectedPagePath, setSelectedPagePath] = useState<string>('/features/sales');
  const [menuList, setMenuList] = useState<SaaSMenuItem[]>(globalBrand?.headerMenu || DEFAULT_SAAS_HEADER_MENU);
  const [footerCols, setFooterCols] = useState<SaaSFooterColumn[]>(globalBrand?.footerColumns || DEFAULT_SAAS_FOOTER_COLUMNS);
  const [customPages, setCustomPages] = useState<SaaSCustomPage[]>(globalBrand?.customPages || []);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Quick manual override inputs for the selected existing page
  const [newOrigText, setNewOrigText] = useState('');
  const [newReplacementText, setNewReplacementText] = useState('');
  const [newOrigImg, setNewOrigImg] = useState('');
  const [newReplacementImg, setNewReplacementImg] = useState('');
  const [uploadingOverrideImg, setUploadingOverrideImg] = useState(false);

  useEffect(() => {
    if (globalBrand?.headerMenu) setMenuList(globalBrand.headerMenu);
    if (globalBrand?.footerColumns) setFooterCols(globalBrand.footerColumns);
    if (globalBrand?.customPages) setCustomPages(globalBrand.customPages);
  }, [globalBrand]);

  const notify = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleSaveAllCMS = async (patch: Record<string, any>) => {
    setSaving(true);
    try {
      const updated = { ...globalBrand, ...patch };
      setGlobalBrand(updated);
      await saveGlobalSiteCMS(patch);
      notify('✅ Changes saved live to Tripbone.com!');
    } catch (e: any) {
      alert('Failed to save CMS settings: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const currentPageOverrides: PageOverrideData = globalBrand?.pageOverrides?.[selectedPagePath] || { texts: {}, images: {} };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Tripbone.com Main Website &amp; Menu CMS
          </h2>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Edit any existing page (text &amp; images), customize header/footer menus, or create new pages on your main Tripbone SaaS website.
          </p>
        </div>

        {statusMsg && (
          <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm">
            {statusMsg}
          </div>
        )}
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setCmsSubTab('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
            cmsSubTab === 'pages'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDarkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Edit className="w-3.5 h-3.5" />
          <span>1. Edit Existing Pages (Text &amp; Images)</span>
        </button>

        <button
          type="button"
          onClick={() => setCmsSubTab('header_menu')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
            cmsSubTab === 'header_menu'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDarkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MenuIcon className="w-3.5 h-3.5" />
          <span>2. Top Navigation Menu &amp; Dropdowns</span>
        </button>

        <button
          type="button"
          onClick={() => setCmsSubTab('footer_menu')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
            cmsSubTab === 'footer_menu'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDarkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3. Footer Menus</span>
        </button>

        <button
          type="button"
          onClick={() => setCmsSubTab('custom_pages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
            cmsSubTab === 'custom_pages'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDarkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>4. Custom Pages ({customPages.length})</span>
        </button>
      </div>

      {/* TAB 1: EDIT EXISTING PAGES */}
      {cmsSubTab === 'pages' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111928] border-slate-800' : 'bg-white border-slate-200'} space-y-5`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <label className={`block text-xs font-bold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Select Main Site Page to Edit
                </label>
                <select
                  value={selectedPagePath}
                  onChange={(e) => setSelectedPagePath(e.target.value)}
                  className={`w-full max-w-md px-3.5 py-2.5 rounded-xl text-xs font-bold border ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {KNOWN_SAAS_PAGES.map((p) => (
                    <option key={p.path} value={p.path}>{p.label}</option>
                  ))}
                  {customPages.map((cp) => (
                    <option key={cp.slug} value={cp.slug}>Custom Page: {cp.title} ({cp.slug})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`${selectedPagePath}?cms_edit=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-md transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>Open Live Visual Editor on {selectedPagePath}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              isDarkMode ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <strong>💡 Tip — Point &amp; Click Visual Editing:</strong> Click <strong>"Open Live Visual Editor"</strong> above to open <code className="font-mono font-bold">{selectedPagePath}</code> with the interactive editor bar. You can click directly on any heading, paragraph, bullet point, or screenshot image on the page to edit text or upload a replacement image!
            </div>

            {/* Add Text Replacement Manual Rule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
              <div className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <Type className="w-4 h-4" /> Replace Text on {selectedPagePath}
                </h4>
                <input
                  type="text"
                  value={newOrigText}
                  onChange={(e) => setNewOrigText(e.target.value)}
                  placeholder="Exact current text on page (e.g. Maximize Conversion & Revenue.)"
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
                <textarea
                  rows={2}
                  value={newReplacementText}
                  onChange={(e) => setNewReplacementText(e.target.value)}
                  placeholder="New text to display instead..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
                <button
                  type="button"
                  disabled={!newOrigText.trim() || !newReplacementText.trim() || saving}
                  onClick={async () => {
                    const existingOverrides = { ...(globalBrand?.pageOverrides || {}) };
                    const pageEntry: PageOverrideData = {
                      texts: { ...(existingOverrides[selectedPagePath]?.texts || {}), [newOrigText.trim()]: newReplacementText },
                      images: { ...(existingOverrides[selectedPagePath]?.images || {}) }
                    };
                    existingOverrides[selectedPagePath] = pageEntry;
                    await handleSaveAllCMS({ pageOverrides: existingOverrides });
                    setNewOrigText('');
                    setNewReplacementText('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                >
                  Save Text Replacement
                </button>

                {/* Active Text Overrides List */}
                {Object.keys(currentPageOverrides.texts || {}).length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Text Edits on {selectedPagePath}</span>
                    {Object.entries(currentPageOverrides.texts || {}).map(([k, val]) => (
                      <div key={k} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="truncate">
                          <span className="text-slate-400 font-mono text-[10px] block truncate">Key: {k}</span>
                          <span className="font-bold text-emerald-600">{val}</span>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const existingOverrides = { ...(globalBrand?.pageOverrides || {}) };
                            const texts = { ...(existingOverrides[selectedPagePath]?.texts || {}) };
                            delete texts[k];
                            existingOverrides[selectedPagePath] = { ...existingOverrides[selectedPagePath], texts };
                            await handleSaveAllCMS({ pageOverrides: existingOverrides });
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Image Replacement Manual Rule */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" /> Replace Image on {selectedPagePath}
                </h4>
                <input
                  type="text"
                  value={newOrigImg}
                  onChange={(e) => setNewOrigImg(e.target.value)}
                  placeholder="Target Image Key (e.g. img_0, img_1) or original Image URL"
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newReplacementImg}
                    onChange={(e) => setNewReplacementImg(e.target.value)}
                    placeholder="New Image URL (or upload file ->)"
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-mono border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                  <label className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingOverrideImg ? '...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setUploadingOverrideImg(true);
                        try {
                          const url = await uploadImage(f);
                          setNewReplacementImg(url);
                        } catch (err: any) {
                          alert(err.message);
                        } finally {
                          setUploadingOverrideImg(false);
                        }
                      }}
                    />
                  </label>
                </div>
                <button
                  type="button"
                  disabled={!newOrigImg.trim() || !newReplacementImg.trim() || saving}
                  onClick={async () => {
                    const existingOverrides = { ...(globalBrand?.pageOverrides || {}) };
                    const pageEntry: PageOverrideData = {
                      texts: { ...(existingOverrides[selectedPagePath]?.texts || {}) },
                      images: { ...(existingOverrides[selectedPagePath]?.images || {}), [newOrigImg.trim()]: newReplacementImg.trim() }
                    };
                    existingOverrides[selectedPagePath] = pageEntry;
                    await handleSaveAllCMS({ pageOverrides: existingOverrides });
                    setNewOrigImg('');
                    setNewReplacementImg('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold cursor-pointer"
                >
                  Save Image Replacement
                </button>

                {/* Active Image Overrides List */}
                {Object.keys(currentPageOverrides.images || {}).length > 0 && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Image Edits on {selectedPagePath}</span>
                    {Object.entries(currentPageOverrides.images || {}).map(([k, val]) => (
                      <div key={k} className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={val} alt={k} className="w-10 h-10 rounded object-cover border" />
                          <div className="truncate">
                            <span className="text-slate-400 font-mono text-[10px] block truncate">Target: {k}</span>
                            <span className="font-mono text-[11px] text-emerald-600 truncate block">{val}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            const existingOverrides = { ...(globalBrand?.pageOverrides || {}) };
                            const images = { ...(existingOverrides[selectedPagePath]?.images || {}) };
                            delete images[k];
                            existingOverrides[selectedPagePath] = { ...existingOverrides[selectedPagePath], images };
                            await handleSaveAllCMS({ pageOverrides: existingOverrides });
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TOP NAVIGATION MENU & DROPDOWNS */}
      {cmsSubTab === 'header_menu' && (
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111928] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm">Main Header Navigation Items</h3>
              <p className="text-xs text-slate-500">Add new links, edit existing labels, or customize mega-menu &amp; dropdown items.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMenuList(DEFAULT_SAAS_HEADER_MENU)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Default
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveAllCMS({ headerMenu: menuList })}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Header Menu'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {menuList.map((item, idx) => (
              <div key={item.id} className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-black text-slate-400">#{idx + 1}</span>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const next = [...menuList];
                      next[idx] = { ...item, label: e.target.value };
                      setMenuList(next);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                  <select
                    value={item.type}
                    onChange={(e) => {
                      const nextType = e.target.value as 'link' | 'mega' | 'dropdown';
                      const next = [...menuList];
                      next[idx] = {
                        ...item,
                        type: nextType,
                        children: nextType === 'link' ? undefined : (item.children || []),
                        href: nextType === 'link' ? (item.href || '/') : undefined
                      };
                      setMenuList(next);
                    }}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                  >
                    <option value="link">Direct Link</option>
                    <option value="dropdown">Dropdown Menu</option>
                    <option value="mega">Mega Menu (2 Columns)</option>
                  </select>

                  {item.type === 'link' && (
                    <input
                      type="text"
                      value={item.href || ''}
                      onChange={(e) => {
                        const next = [...menuList];
                        next[idx] = { ...item, href: e.target.value };
                        setMenuList(next);
                      }}
                      placeholder="/pricing"
                      className={`flex-1 min-w-[160px] px-3 py-2 rounded-xl border text-xs font-mono ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                    />
                  )}

                  <div className="ml-auto flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const next = [...menuList];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        setMenuList(next);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === menuList.length - 1}
                      onClick={() => {
                        const next = [...menuList];
                        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                        setMenuList(next);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuList(menuList.filter((_, i) => i !== idx))}
                      className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {(item.type === 'dropdown' || item.type === 'mega') && (
                  <div className="pl-5 border-l-2 border-emerald-500/40 space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Sub-Menu Items</span>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...menuList];
                          const children = [...(item.children || [])];
                          children.push({
                            id: `sub_${Date.now()}`,
                            label: 'New Sub-Item',
                            href: '/features',
                            description: 'Sub-item description',
                            icon: 'Sparkles'
                          });
                          next[idx] = { ...item, children };
                          setMenuList(next);
                        }}
                        className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Sub-Item
                      </button>
                    </div>
                    {(item.children || []).map((sub, sIdx) => (
                      <div key={sub.id} className={`grid grid-cols-1 sm:grid-cols-12 gap-2 p-2.5 rounded-xl border items-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <input
                          type="text"
                          value={sub.label}
                          onChange={(e) => {
                            const next = [...menuList];
                            const children = [...(item.children || [])];
                            children[sIdx] = { ...sub, label: e.target.value };
                            next[idx] = { ...item, children };
                            setMenuList(next);
                          }}
                          placeholder="Label"
                          className={`sm:col-span-4 px-2.5 py-1.5 rounded-lg border text-xs font-bold ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                        <input
                          type="text"
                          value={sub.href}
                          onChange={(e) => {
                            const next = [...menuList];
                            const children = [...(item.children || [])];
                            children[sIdx] = { ...sub, href: e.target.value };
                            next[idx] = { ...item, children };
                            setMenuList(next);
                          }}
                          placeholder="/path"
                          className={`sm:col-span-3 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                        <input
                          type="text"
                          value={sub.description || ''}
                          onChange={(e) => {
                            const next = [...menuList];
                            const children = [...(item.children || [])];
                            children[sIdx] = { ...sub, description: e.target.value };
                            next[idx] = { ...item, children };
                            setMenuList(next);
                          }}
                          placeholder="Description"
                          className={`sm:col-span-4 px-2.5 py-1.5 rounded-lg border text-xs ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200'}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...menuList];
                            const children = (item.children || []).filter((_, i) => i !== sIdx);
                            next[idx] = { ...item, children };
                            setMenuList(next);
                          }}
                          className="sm:col-span-1 p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg justify-self-end"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setMenuList([
                  ...menuList,
                  { id: `menu_${Date.now()}`, label: 'New Menu Item', type: 'link', href: '/pricing' }
                ])
              }
              className="w-full py-3 rounded-2xl border-2 border-dashed border-emerald-500/40 text-emerald-600 hover:bg-emerald-50/30 text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Top Menu Item
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FOOTER MENUS */}
      {cmsSubTab === 'footer_menu' && (
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111928] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm">Footer Menu Columns</h3>
              <p className="text-xs text-slate-500">Customize column titles and links in the Tripbone.com footer.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFooterCols(DEFAULT_SAAS_FOOTER_COLUMNS)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Default
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveAllCMS({ footerColumns: footerCols })}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Footer Columns'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {footerCols.map((col, cIdx) => (
              <div key={col.id} className={`p-4 rounded-2xl border space-y-3 ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) => {
                      const next = [...footerCols];
                      next[cIdx] = { ...col, title: e.target.value };
                      setFooterCols(next);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-black uppercase ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = [...footerCols];
                      next[cIdx] = {
                        ...col,
                        links: [...col.links, { id: `fl_${Date.now()}`, label: 'New Link', href: '/' }]
                      };
                      setFooterCols(next);
                    }}
                    className="text-xs font-bold text-emerald-600 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  {col.links.map((lnk, lIdx) => (
                    <div key={lnk.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={lnk.label}
                        onChange={(e) => {
                          const next = [...footerCols];
                          const links = [...col.links];
                          links[lIdx] = { ...lnk, label: e.target.value };
                          next[cIdx] = { ...col, links };
                          setFooterCols(next);
                        }}
                        className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                      />
                      <input
                        type="text"
                        value={lnk.href}
                        onChange={(e) => {
                          const next = [...footerCols];
                          const links = [...col.links];
                          links[lIdx] = { ...lnk, href: e.target.value };
                          next[cIdx] = { ...col, links };
                          setFooterCols(next);
                        }}
                        className={`w-36 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...footerCols];
                          const links = col.links.filter((_, i) => i !== lIdx);
                          next[cIdx] = { ...col, links };
                          setFooterCols(next);
                        }}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOM PAGES BUILDER */}
      {cmsSubTab === 'custom_pages' && (
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-[#111928] border-slate-800' : 'bg-white border-slate-200'} space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm">Custom Main-Site Pages</h3>
              <p className="text-xs text-slate-500">Create new pages (e.g. <code className="font-mono">/partners</code>, <code className="font-mono">/enterprise</code>) and link them in your Header or Footer menu.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCustomPages([
                    ...customPages,
                    {
                      slug: `/page-${customPages.length + 1}`,
                      title: 'New Custom Page',
                      badge: 'Tripbone Platform',
                      subtitle: 'Custom page subtitle and overview.',
                      heroImage: 'https://i.ibb.co.com/MqFL4jW/image.png',
                      sections: [
                        {
                          id: `sec_${Date.now()}`,
                          badge: '[ FEATURE HIGHLIGHT ]',
                          heading: 'Built for Modern Tour Operators',
                          body: 'Add your custom section description, images, and bullet points here.',
                          bullets: ['0% Commission Direct Bookings', 'Automated WhatsApp Dispatch'],
                          imageUrl: 'https://i.ibb.co.com/V0PsRmTM/image.png'
                        }
                      ]
                    }
                  ])
                }
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Custom Page
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveAllCMS({ customPages })}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Custom Pages'}</span>
              </button>
            </div>
          </div>

          {customPages.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No custom pages created yet. Click "New Custom Page" above to create one!
            </div>
          ) : (
            <div className="space-y-4">
              {customPages.map((cp, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border space-y-4 ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">URL Path (Slug)</label>
                      <input
                        type="text"
                        value={cp.slug}
                        onChange={(e) => {
                          const next = [...customPages];
                          const val = e.target.value.startsWith('/') ? e.target.value : `/${e.target.value}`;
                          next[idx] = { ...cp, slug: val };
                          setCustomPages(next);
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-mono font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Hero Title</label>
                      <input
                        type="text"
                        value={cp.title}
                        onChange={(e) => {
                          const next = [...customPages];
                          next[idx] = { ...cp, title: e.target.value };
                          setCustomPages(next);
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Hero Image URL</label>
                      <input
                        type="text"
                        value={cp.heroImage || ''}
                        onChange={(e) => {
                          const next = [...customPages];
                          next[idx] = { ...cp, heroImage: e.target.value };
                          setCustomPages(next);
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs font-mono ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Hero Subtitle</label>
                    <textarea
                      rows={2}
                      value={cp.subtitle}
                      onChange={(e) => {
                        const next = [...customPages];
                        next[idx] = { ...cp, subtitle: e.target.value };
                        setCustomPages(next);
                      }}
                      className={`w-full px-3 py-2 rounded-xl border text-xs ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200'}`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <a
                      href={cp.slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      View {cp.slug} <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setCustomPages(customPages.filter((_, i) => i !== idx))}
                      className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Page
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
