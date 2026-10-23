/**
 * Central Multi-Tenant Logging & Audit System for Tripbone SaaS
 *
 * Automatically tags all Firestore database queries, mutations, real-time subscriptions,
 * analytics events, and workspace lifecycle transitions with the active `tenantId`
 * (or `'master'` when operating in Master SaaS scope).
 */

export type TenantLogCategory =
  | 'db_query'
  | 'db_mutation'
  | 'db_subscription'
  | 'app_event'
  | 'analytics_event'
  | 'auth_event'
  | 'tenant_lifecycle'
  | 'error';

export type TenantLogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface TenantLoggerContext {
  tenantId: string | null;
  tenantSlug?: string | null;
  isMaster?: boolean;
  isImpersonating?: boolean;
  userId?: string | null;
}

export interface TenantLogEntry {
  id: string;
  timestamp: string;
  tenantId: string; // Always resolved: specific tenantId or 'master'
  rawTenantId: string | null;
  tenantSlug: string | null;
  isMaster: boolean;
  isImpersonating: boolean;
  userId: string | null;
  category: TenantLogCategory;
  level: TenantLogLevel;
  operation: string;
  path?: string | null;
  isTenantFiltered?: boolean;
  durationMs?: number;
  resultCount?: number;
  message: string;
  metadata?: Record<string, any>;
}

export interface TenantLogFilter {
  tenantId?: string;
  category?: TenantLogCategory;
  level?: TenantLogLevel;
  operation?: string;
  search?: string;
  limit?: number;
}

const MAX_LOG_BUFFER_SIZE = 500;

class CentralTenantLogger {
  private context: TenantLoggerContext = {
    tenantId: null,
    tenantSlug: null,
    isMaster: true,
    isImpersonating: false,
    userId: null,
  };

  private logs: TenantLogEntry[] = [];
  private listeners: Set<(entry: TenantLogEntry) => void> = new Set();
  private consoleOutputEnabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.consoleOutputEnabled =
          window.localStorage.getItem('tripbone_debug_tenant_logs') === 'true';
        (window as any).__TRIPBONE_TENANT_LOGGER__ = {
          getLogs: (filter?: TenantLogFilter) => this.getLogs(filter),
          getSummary: (tenantId?: string) => this.getTenantAuditSummary(tenantId),
          exportJson: (tenantId?: string) => this.exportLogsAsJson(tenantId),
          clear: () => this.clearLogs(),
          enableConsole: (enabled: boolean = true) => this.setConsoleOutput(enabled),
          getContext: () => this.getContext(),
        };
      } catch {
        // Ignore storage errors in restricted environments
      }
    }
  }

  /**
   * Updates the active tenant context used to tag all subsequent logs.
   */
  public setContext(partialContext: Partial<TenantLoggerContext>): void {
    const prevTenantId = this.context.tenantId;
    this.context = {
      ...this.context,
      ...partialContext,
    };

    if (
      partialContext.tenantId !== undefined &&
      partialContext.tenantId !== prevTenantId
    ) {
      this.record({
        category: 'tenant_lifecycle',
        level: 'info',
        operation: 'TENANT_CONTEXT_SWITCH',
        path: typeof window !== 'undefined' ? window.location.pathname : null,
        message: `Tenant workspace context switched from [${prevTenantId || 'master'}] to [${this.context.tenantId || 'master'}]`,
        metadata: {
          previousTenantId: prevTenantId || 'master',
          currentTenantId: this.context.tenantId || 'master',
          tenantSlug: this.context.tenantSlug || null,
          isMaster: Boolean(this.context.isMaster),
          isImpersonating: Boolean(this.context.isImpersonating),
        },
      });
    }
  }

  /**
   * Returns a snapshot of the current tenant context.
   */
  public getContext(): TenantLoggerContext {
    return { ...this.context };
  }

  /**
   * Resolves the effective tenantId tag, prioritizing explicit override,
   * then active tenant context, and falling back to 'master'.
   */
  public resolveTenantTag(explicitTenantId?: string | null): string {
    return explicitTenantId || this.context.tenantId || 'master';
  }

  /**
   * Enables or disables live structured console output for debugging.
   */
  public setConsoleOutput(enabled: boolean): void {
    this.consoleOutputEnabled = enabled;
    if (typeof window !== 'undefined') {
      try {
        if (enabled) {
          window.localStorage.setItem('tripbone_debug_tenant_logs', 'true');
        } else {
          window.localStorage.removeItem('tripbone_debug_tenant_logs');
        }
      } catch {
        // Ignore storage errors
      }
    }
  }

  /**
   * Core internal recorder that stamps `tenantId` and dispatches to listeners.
   */
  public record(params: {
    tenantId?: string | null;
    category: TenantLogCategory;
    level?: TenantLogLevel;
    operation: string;
    path?: string | null;
    isTenantFiltered?: boolean;
    durationMs?: number;
    resultCount?: number;
    message: string;
    metadata?: Record<string, any>;
  }): TenantLogEntry {
    const resolvedTenantId = this.resolveTenantTag(params.tenantId);
    const rawTenantId =
      params.tenantId !== undefined ? params.tenantId : this.context.tenantId;

    const entry: TenantLogEntry = {
      id: `tlog_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: new Date().toISOString(),
      tenantId: resolvedTenantId,
      rawTenantId: rawTenantId || null,
      tenantSlug: this.context.tenantSlug || null,
      isMaster: resolvedTenantId === 'master' ? true : Boolean(this.context.isMaster),
      isImpersonating: Boolean(this.context.isImpersonating),
      userId: this.context.userId || null,
      category: params.category,
      level: params.level || 'info',
      operation: params.operation,
      path: params.path || null,
      isTenantFiltered: params.isTenantFiltered,
      durationMs: params.durationMs,
      resultCount: params.resultCount,
      message: params.message,
      metadata: params.metadata
        ? {
            ...params.metadata,
            tenantId: resolvedTenantId,
          }
        : { tenantId: resolvedTenantId },
    };

    this.logs.unshift(entry);
    if (this.logs.length > MAX_LOG_BUFFER_SIZE) {
      this.logs.pop();
    }

    if (this.consoleOutputEnabled || entry.level === 'error') {
      const prefix = `[TripboneAudit][tenant:${entry.tenantId}][${entry.category}:${entry.operation}]`;
      if (entry.level === 'error') {
        console.error(prefix, entry.message, entry.metadata || {});
      } else if (entry.level === 'warn') {
        console.warn(prefix, entry.message, entry.metadata || {});
      } else {
        console.debug(prefix, entry.message, entry.metadata || {});
      }
    }

    this.listeners.forEach((listener) => {
      try {
        listener(entry);
      } catch {
        // Prevent listener errors from breaking application flow
      }
    });

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(
          new CustomEvent('tripbone-tenant-log', { detail: entry })
        );
      } catch {
        // Ignore custom event errors
      }
    }

    return entry;
  }

  /**
   * Logs a Firestore database query (`GET_DOC`, `GET_DOCS`, `ON_SNAPSHOT`).
   */
  public logQuery(params: {
    operation: 'GET_DOC' | 'GET_DOCS' | 'ON_SNAPSHOT' | 'REST_QUERY' | 'REST_GET_DOC';
    path: string | null;
    tenantId?: string | null;
    isTenantFiltered?: boolean;
    durationMs?: number;
    resultCount?: number;
    metadata?: Record<string, any>;
  }): TenantLogEntry {
    const resolvedTenant = this.resolveTenantTag(params.tenantId);
    const category: TenantLogCategory =
      params.operation === 'ON_SNAPSHOT' ? 'db_subscription' : 'db_query';

    return this.record({
      tenantId: params.tenantId,
      category,
      level: 'debug',
      operation: params.operation,
      path: params.path,
      isTenantFiltered: params.isTenantFiltered,
      durationMs: params.durationMs,
      resultCount: params.resultCount,
      message: `[${params.operation}] ${params.path || 'unknown'} (tenantId=${resolvedTenant}, filtered=${Boolean(params.isTenantFiltered)}${params.resultCount !== undefined ? `, count=${params.resultCount}` : ''}${params.durationMs !== undefined ? `, ${params.durationMs}ms` : ''})`,
      metadata: params.metadata,
    });
  }

  /**
   * Logs a Firestore database mutation (`ADD_DOC`, `SET_DOC`, `UPDATE_DOC`, `DELETE_DOC`).
   */
  public logMutation(params: {
    operation:
      | 'ADD_DOC'
      | 'SET_DOC'
      | 'UPDATE_DOC'
      | 'DELETE_DOC'
      | 'REST_WRITE'
      | 'REST_DELETE';
    path: string | null;
    tenantId?: string | null;
    isTenantFiltered?: boolean;
    durationMs?: number;
    metadata?: Record<string, any>;
  }): TenantLogEntry {
    const resolvedTenant = this.resolveTenantTag(params.tenantId);
    return this.record({
      tenantId: params.tenantId,
      category: 'db_mutation',
      level: 'info',
      operation: params.operation,
      path: params.path,
      isTenantFiltered: params.isTenantFiltered,
      durationMs: params.durationMs,
      message: `[${params.operation}] ${params.path || 'unknown'} (tenantId=${resolvedTenant}${params.durationMs !== undefined ? `, ${params.durationMs}ms` : ''})`,
      metadata: params.metadata,
    });
  }

  /**
   * Logs an application, analytics, or user event tagged with the current `tenantId`.
   */
  public logEvent(
    eventName: string,
    metadata?: Record<string, any>,
    options?: {
      category?: TenantLogCategory;
      level?: TenantLogLevel;
      tenantId?: string | null;
      path?: string | null;
    }
  ): TenantLogEntry {
    const explicitTenant =
      options?.tenantId ||
      metadata?.tenantId ||
      metadata?.tenant_id ||
      this.context.tenantId;
    const resolvedTenant = this.resolveTenantTag(explicitTenant);

    return this.record({
      tenantId: explicitTenant,
      category: options?.category || 'app_event',
      level: options?.level || 'info',
      operation: eventName,
      path:
        options?.path ||
        (typeof window !== 'undefined' ? window.location.pathname : null),
      message: `Event [${eventName}] triggered in workspace [tenantId=${resolvedTenant}]`,
      metadata,
    });
  }

  /**
   * Logs a database or runtime error tagged with the current `tenantId`.
   */
  public logError(
    operation: string,
    path: string | null,
    error: unknown,
    metadata?: Record<string, any>,
    explicitTenantId?: string | null
  ): TenantLogEntry {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    const resolvedTenant = this.resolveTenantTag(explicitTenantId);

    return this.record({
      tenantId: explicitTenantId,
      category: 'error',
      level: 'error',
      operation,
      path,
      message: `Error in [${operation}] on [${path || 'unknown'}] (tenantId=${resolvedTenant}): ${errorMessage}`,
      metadata: {
        ...metadata,
        errorMessage,
      },
    });
  }

  /**
   * Retrieves logs filtered by `tenantId`, `category`, `level`, `operation`, or text search.
   */
  public getLogs(filter?: TenantLogFilter): TenantLogEntry[] {
    let result = this.logs;

    if (filter?.tenantId) {
      result = result.filter(
        (entry) =>
          entry.tenantId === filter.tenantId ||
          entry.rawTenantId === filter.tenantId
      );
    }

    if (filter?.category) {
      result = result.filter((entry) => entry.category === filter.category);
    }

    if (filter?.level) {
      result = result.filter((entry) => entry.level === filter.level);
    }

    if (filter?.operation) {
      result = result.filter((entry) => entry.operation === filter.operation);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (entry) =>
          entry.message.toLowerCase().includes(q) ||
          (entry.path && entry.path.toLowerCase().includes(q)) ||
          entry.operation.toLowerCase().includes(q) ||
          entry.tenantId.toLowerCase().includes(q)
      );
    }

    if (filter?.limit && filter.limit > 0) {
      result = result.slice(0, filter.limit);
    }

    return result;
  }

  /**
   * Produces an aggregated audit summary for a specific `tenantId` or across all workspaces.
   */
  public getTenantAuditSummary(tenantId?: string) {
    const relevantLogs = tenantId
      ? this.getLogs({ tenantId })
      : this.logs;

    const byTenant: Record<
      string,
      {
        totalEntries: number;
        queries: number;
        mutations: number;
        subscriptions: number;
        events: number;
        errors: number;
        unfilteredQueriesOnTenantCollections: number;
        avgQueryDurationMs: number;
      }
    > = {};

    const durationSums: Record<string, { totalMs: number; count: number }> = {};

    for (const log of relevantLogs) {
      const tid = log.tenantId || 'master';
      if (!byTenant[tid]) {
        byTenant[tid] = {
          totalEntries: 0,
          queries: 0,
          mutations: 0,
          subscriptions: 0,
          events: 0,
          errors: 0,
          unfilteredQueriesOnTenantCollections: 0,
          avgQueryDurationMs: 0,
        };
        durationSums[tid] = { totalMs: 0, count: 0 };
      }

      const bucket = byTenant[tid];
      bucket.totalEntries += 1;

      if (log.category === 'db_query') bucket.queries += 1;
      else if (log.category === 'db_mutation') bucket.mutations += 1;
      else if (log.category === 'db_subscription') bucket.subscriptions += 1;
      else if (log.category === 'error') bucket.errors += 1;
      else bucket.events += 1;

      if (
        (log.category === 'db_query' || log.category === 'db_subscription') &&
        log.isTenantFiltered === false &&
        tid !== 'master'
      ) {
        bucket.unfilteredQueriesOnTenantCollections += 1;
      }

      if (typeof log.durationMs === 'number') {
        durationSums[tid].totalMs += log.durationMs;
        durationSums[tid].count += 1;
      }
    }

    for (const tid of Object.keys(byTenant)) {
      const d = durationSums[tid];
      byTenant[tid].avgQueryDurationMs =
        d && d.count > 0 ? Math.round((d.totalMs / d.count) * 100) / 100 : 0;
    }

    return {
      generatedAt: new Date().toISOString(),
      activeContext: this.getContext(),
      totalBufferedLogs: relevantLogs.length,
      workspaces: byTenant,
    };
  }

  /**
   * Exports logs as a formatted JSON string for audit reporting.
   */
  public exportLogsAsJson(tenantId?: string): string {
    return JSON.stringify(
      {
        summary: this.getTenantAuditSummary(tenantId),
        logs: this.getLogs(tenantId ? { tenantId } : undefined),
      },
      null,
      2
    );
  }

  /**
   * Clears in-memory log buffer.
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Subscribes to real-time log entries. Returns an unsubscribe function.
   */
  public subscribe(listener: (entry: TenantLogEntry) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const tenantLogger = new CentralTenantLogger();
