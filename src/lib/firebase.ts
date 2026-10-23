import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigManual from '../../firebase-applet-config.json';

function sanitizeStorageBucket(bucket: string | undefined): string | undefined {
  if (!bucket) return bucket;
  let clean = bucket.trim();
  if (clean.startsWith('gs://')) {
    clean = clean.substring(5);
  }
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    try {
      const url = new URL(clean);
      const pathParts = url.pathname.split('/');
      const bIndex = pathParts.indexOf('b');
      if (bIndex !== -1 && pathParts[bIndex + 1]) {
        clean = pathParts[bIndex + 1];
      } else {
        clean = url.hostname;
      }
    } catch (e) {
      const match = clean.match(/\/v0\/b\/([^/]+)/);
      if (match && match[1]) {
        clean = match[1];
      }
    }
  }
  clean = clean.split('/')[0];
  return clean;
}

// Use environment variables if available (for production deployments like Vercel)
// Fallback to the local config file for development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigManual.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigManual.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigManual.projectId,
  storageBucket: sanitizeStorageBucket(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigManual.storageBucket),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigManual.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigManual.appId,
  // This is a custom property used in this app
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigManual.firestoreDatabaseId
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const storage = getStorage(app);

// --- Multi-Tenant Interceptor & Central Audit Logging Layer ---
import { tenantLogger } from './tenantLogger';

let activeTenantId: string | null = null;

export function setActiveTenantId(id: string | null) {
  activeTenantId = id;
  tenantLogger.setContext({ tenantId: id, isMaster: !id });
}

export function getActiveTenantId() {
  return activeTenantId;
}

const TENANT_SPECIFIC_COLLECTIONS = [
  'tours',
  'bookings',
  'customers',
  'payments',
  'blogs',
  'posts',
  'pages',
  'reviews',
  'media',
  'categories',
  'addons',
  'globalAddOns',
  'globalTransports',
  'coupons',
  'notifications',
  'staff',
  'analytics',
  'analytics_pageviews',
  'guides',
  'supportTickets',
  'popups',
  'inventory',
  'inventory_items',
  'proposals',
  'aiFaqs',
  'aiTips',
  'tourLabels',
  'tourTypes',
  'locationMeta',
  'saved_itineraries',
  'inquiries',
  'whatsapp_chats',
  'whatsapp_messages',
  'rental_vehicles',
  'rentalVehicles',
  'rental_bookings',
  'rentalBookings',
  'users',
  'communicationSettings',
  'settings'
];

function isTenantSpecific(path: string): boolean {
  if (!path) return false;
  const firstSegment = path.split('/')[0];
  return TENANT_SPECIFIC_COLLECTIONS.includes(firstSegment);
}

function resolveRefPath(refOrQuery: any): string {
  if (!refOrQuery) return 'unknown';
  if (typeof refOrQuery.path === 'string' && refOrQuery.path) {
    return refOrQuery.path;
  }
  if (typeof refOrQuery.__collectionPath === 'string' && refOrQuery.__collectionPath) {
    return refOrQuery.__collectionPath;
  }
  if (refOrQuery._query?.path?.segments) {
    return refOrQuery._query.path.segments.join('/');
  }
  return 'unknown';
}

import {
  collection as rawCollection,
  query as rawQuery,
  where as rawWhere,
  addDoc as rawAddDoc,
  setDoc as rawSetDoc,
  updateDoc as rawUpdateDoc,
  deleteDoc as rawDeleteDoc,
  getDocs as rawGetDocs,
  onSnapshot as rawOnSnapshot,
  getDoc as rawGetDoc,
  doc as rawDoc,
  Query,
  CollectionReference
} from 'firebase/firestore';

// 1. Wrap collection to attach metadata
export function collection(firestore: any, path: string, ...pathSegments: string[]): any {
  const colRef = rawCollection(firestore, path, ...pathSegments);
  const fullPath = [path, ...pathSegments].filter(Boolean).join('/');
  (colRef as any).__collectionPath = fullPath || path;
  return colRef;
}

// 2. Wrap query to pass along metadata
export function query(queryRef: any, ...queryConstraints: any[]): any {
  const q = rawQuery(queryRef, ...queryConstraints);
  (q as any).__collectionPath = queryRef.__collectionPath || (queryRef.path && queryRef.path.split('/')[0]);
  if (queryRef.__isTenantFiltered) {
    (q as any).__isTenantFiltered = true;
  }
  for (const constraint of queryConstraints) {
    if (constraint && (constraint._field?.segments?.[0] === 'tenantId' || constraint.type === 'where')) {
      if (constraint._field?.segments?.[0] === 'tenantId') {
        (q as any).__isTenantFiltered = true;
      }
    }
  }
  return q;
}

// 3. Helper to inject tenant filter if needed
function applyTenantFilter(q: any): any {
  if (!activeTenantId) return q;
  
  // Guard: If it's a DocumentReference, we do not want to apply query constraints (like where) which are only valid on Collections/Queries.
  // We can identify a DocumentReference by checking if q.type is 'document' or if its path has an even number of segments.
  if (q && (q.type === 'document' || (q.path && q.path.split('/').length % 2 === 0))) {
    return q;
  }
  
  const path = q.__collectionPath || (q.path && q.path.split('/')[0]);
  if (path && isTenantSpecific(path) && !q.__isTenantFiltered) {
    // Append tenantId filter
    const filtered = rawQuery(q, rawWhere('tenantId', '==', activeTenantId));
    (filtered as any).__collectionPath = path;
    (filtered as any).__isTenantFiltered = true;
    return filtered;
  }
  return q;
}

// 4. Wrap getDocs to apply filter & log query with tenantId
export async function getDocs(q: any): Promise<any> {
  const filtered = applyTenantFilter(q);
  const path = resolveRefPath(filtered);
  const isFiltered = Boolean((filtered as any)?.__isTenantFiltered);
  const start = Date.now();
  try {
    const snap = await rawGetDocs(filtered);
    tenantLogger.logQuery({
      operation: 'GET_DOCS',
      path,
      tenantId: activeTenantId,
      isTenantFiltered: isFiltered,
      durationMs: Date.now() - start,
      resultCount: typeof snap?.size === 'number' ? snap.size : undefined,
    });
    return snap;
  } catch (err) {
    tenantLogger.logError('GET_DOCS', path, err, { isTenantFiltered: isFiltered }, activeTenantId);
    throw err;
  }
}

// 4b. Wrap getDoc to log single-document reads with tenantId
export async function getDoc(reference: any): Promise<any> {
  const path = resolveRefPath(reference);
  const start = Date.now();
  try {
    const snap = await rawGetDoc(reference);
    const docTenantId = snap?.exists?.() ? (snap.data() as any)?.tenantId || activeTenantId : activeTenantId;
    tenantLogger.logQuery({
      operation: 'GET_DOC',
      path,
      tenantId: docTenantId,
      isTenantFiltered: Boolean(docTenantId),
      durationMs: Date.now() - start,
      resultCount: snap?.exists?.() ? 1 : 0,
    });
    return snap;
  } catch (err) {
    tenantLogger.logError('GET_DOC', path, err, undefined, activeTenantId);
    throw err;
  }
}

// 5. Wrap onSnapshot to apply filter & log real-time subscription with tenantId
export function onSnapshot(q: any, ...args: any[]): any {
  const filtered = applyTenantFilter(q);
  const path = resolveRefPath(filtered);
  const isFiltered = Boolean((filtered as any)?.__isTenantFiltered);
  tenantLogger.logQuery({
    operation: 'ON_SNAPSHOT',
    path,
    tenantId: activeTenantId,
    isTenantFiltered: isFiltered,
  });
  return (rawOnSnapshot as any)(filtered, ...args);
}

// 6. Wrap addDoc to inject tenantId & log mutation
export async function addDoc(reference: any, data: any): Promise<any> {
  const path = reference.__collectionPath || (reference.path && reference.path.split('/')[0]);
  if (activeTenantId && path && isTenantSpecific(path)) {
    data = { ...data, tenantId: activeTenantId };
  }
  const effectiveTenantId = data?.tenantId || activeTenantId;
  const start = Date.now();
  try {
    const res = await rawAddDoc(reference, data);
    tenantLogger.logMutation({
      operation: 'ADD_DOC',
      path: res?.path || resolveRefPath(reference),
      tenantId: effectiveTenantId,
      isTenantFiltered: Boolean(effectiveTenantId),
      durationMs: Date.now() - start,
    });
    return res;
  } catch (err) {
    tenantLogger.logError('ADD_DOC', resolveRefPath(reference), err, undefined, effectiveTenantId);
    throw err;
  }
}

// 7. Wrap setDoc to inject tenantId & log mutation
export async function setDoc(reference: any, data: any, options?: any): Promise<any> {
  const path = reference.path ? reference.path.split('/')[0] : null;
  if (activeTenantId && path && isTenantSpecific(path)) {
    // If it's settings, we don't want to force set the tenantId field if we are writing system settings, but for standard tenant settings yes.
    data = { ...data, tenantId: activeTenantId };
  }
  const effectiveTenantId = data?.tenantId || activeTenantId;
  const fullPath = resolveRefPath(reference);
  const start = Date.now();
  try {
    const res = await rawSetDoc(reference, data, options);
    tenantLogger.logMutation({
      operation: 'SET_DOC',
      path: fullPath,
      tenantId: effectiveTenantId,
      isTenantFiltered: Boolean(effectiveTenantId),
      durationMs: Date.now() - start,
      metadata: options ? { merge: Boolean(options.merge) } : undefined,
    });
    return res;
  } catch (err) {
    tenantLogger.logError('SET_DOC', fullPath, err, undefined, effectiveTenantId);
    throw err;
  }
}

// 8. Wrap updateDoc to inject tenantId & log mutation
export async function updateDoc(reference: any, data: any): Promise<any> {
  const path = reference.path ? reference.path.split('/')[0] : null;
  if (activeTenantId && path && isTenantSpecific(path)) {
    data = { ...data, tenantId: activeTenantId };
  }
  const effectiveTenantId = data?.tenantId || activeTenantId;
  const fullPath = resolveRefPath(reference);
  const start = Date.now();
  try {
    const res = await rawUpdateDoc(reference, data);
    tenantLogger.logMutation({
      operation: 'UPDATE_DOC',
      path: fullPath,
      tenantId: effectiveTenantId,
      isTenantFiltered: Boolean(effectiveTenantId),
      durationMs: Date.now() - start,
    });
    return res;
  } catch (err) {
    tenantLogger.logError('UPDATE_DOC', fullPath, err, undefined, effectiveTenantId);
    throw err;
  }
}

// 9. Wrap deleteDoc to log document deletion with tenantId
export async function deleteDoc(reference: any): Promise<any> {
  const fullPath = resolveRefPath(reference);
  const start = Date.now();
  try {
    const res = await rawDeleteDoc(reference);
    tenantLogger.logMutation({
      operation: 'DELETE_DOC',
      path: fullPath,
      tenantId: activeTenantId,
      isTenantFiltered: Boolean(activeTenantId),
      durationMs: Date.now() - start,
    });
    return res;
  } catch (err) {
    tenantLogger.logError('DELETE_DOC', fullPath, err, undefined, activeTenantId);
    throw err;
  }
}

// Re-export standard query variables & functions
export {
  rawWhere as where,
  rawDoc as doc,
  rawCollection,
  rawQuery,
  rawWhere,
  rawGetDocs,
  rawDoc,
  rawGetDoc,
  rawDeleteDoc,
  tenantLogger
};
export * from 'firebase/firestore';
export * from './tenantLogger';

// Test connection
async function testConnection() {
  try {
    // Attempting to get a dummy doc to test responsiveness
    await rawGetDoc(rawDoc(db, '_connection_test', 'test'));
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}
testConnection();

export * from './firestore-utils';


