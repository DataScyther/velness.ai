/**
 * Base Repository
 *
 * Shared foundation for every Supabase-backed repository in the Velness backend
 * layer. Provides:
 *   - a single `supabase` (anon, RLS-scoped) client instance,
 *   - consistent error handling that converts Postgrest / auth errors into a
 *     typed `RepositoryError`,
 *   - a `getCurrentUserId()` helper used to stamp `user_id` on inserts.
 *
 * RULE (Sprint S0.5): this is the ONLY place that talks to the Supabase client
 * on behalf of feature/UI code. Nothing here imports `@supabase/supabase-js`
 * except the `supabase` client and the re-exported `SupabaseClient` type.
 */

import { supabase } from '../client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

/**
 * Supabase auth payload types, derived from the typed client so that
 * repositories never import `@supabase/supabase-js` directly (Sprint S0.5 rule).
 */
type Client = SupabaseClient<Database>;
export type AuthSession = Awaited<ReturnType<Client['auth']['getSession']>>['data']['session'];
export type AuthUser = Awaited<ReturnType<Client['auth']['getUser']>>['data']['user'];
export type AuthSubscription = ReturnType<
  Client['auth']['onAuthStateChange']
>['data']['subscription'];
export type AuthErrorType = Awaited<
  ReturnType<Client['auth']['signInWithPassword']>
>['error'];

/** All public tables in the Velness schema. */
export type AppTables = Database['public']['Tables'];
export type TableName = keyof AppTables;

/**
 * Typed error thrown by every repository when a query fails. Carries the
 * underlying Postgrest/auth `code` (and `details`/`hint` when present) so
 * callers can branch on it.
 */
export class RepositoryError extends Error {
  readonly code?: string;
  readonly details?: unknown;
  readonly hint?: string;

  constructor(
    message: string,
    options: { code?: string; details?: unknown; hint?: string } = {},
  ) {
    super(message);
    this.name = 'RepositoryError';
    this.code = options.code;
    this.details = options.details;
    this.hint = options.hint;
    Object.setPrototypeOf(this, RepositoryError.prototype);
  }
}

/** Normalize an unknown thrown value into a `RepositoryError`. */
export function toRepositoryError(error: unknown, context: string): RepositoryError {
  if (error && typeof error === 'object' && 'message' in error) {
    const e = error as {
      message?: string;
      code?: string;
      details?: unknown;
      hint?: string;
    };
    return new RepositoryError(`${context}: ${e.message ?? 'Unknown database error'}`, {
      code: e.code,
      details: e.details,
      hint: e.hint,
    });
  }
  return new RepositoryError(
    `${context}: ${error instanceof Error ? error.message : 'Unknown error'}`,
  );
}

/**
 * Generic base class. Concrete repositories pass their table name so the
 * typed client is always in scope, and reuse the shared helpers.
 */
export class BaseRepository<TTable extends TableName> {
  protected readonly client: SupabaseClient<Database>;
  protected readonly table: TTable;

  constructor(table: TTable, client: SupabaseClient<Database> = supabase) {
    this.table = table;
    this.client = client;
  }

  /**
   * Return the id of the currently authenticated user, or throw if there is
   * none. Used to stamp `user_id` on inserts (defence-in-depth alongside RLS).
   */
  protected async getCurrentUserId(): Promise<string> {
    const { data, error } = await this.client.auth.getUser();
    if (error) throw toRepositoryError(error, 'getCurrentUserId');
    if (!data.user) {
      throw new RepositoryError('No authenticated user found.');
    }
    return data.user.id;
  }
}
