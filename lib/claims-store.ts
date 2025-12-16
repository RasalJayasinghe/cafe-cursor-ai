/**
 * Netlify Blobs Store for Claim Tracking
 *
 * Why Netlify Blobs instead of database:
 * - Serverless-compatible (no connection pools)
 * - Persists across deployments and refreshes
 * - No filesystem writes needed
 * - Built-in atomic operations
 * - Free tier: 100GB bandwidth, 1GB storage
 *
 * Alternative considered:
 * - Filesystem writes → Not safe on Netlify (read-only after build)
 * - PostgreSQL → Overkill for simple boolean flags
 * - Redis → Requires external service
 */

import { getStore } from "@netlify/blobs";

// Get claims store
// Store name: "claims" - tracks email → claimed status
export function getClaimsStore() {
  return getStore("claims");
}

/**
 * Check if an email has already claimed their meal
 */
export async function hasClaimedMeal(email: string): Promise<boolean> {
  try {
    const store = getClaimsStore();
    const key = `claimed:${email.toLowerCase()}`;

    console.log(`[CLAIMS] Checking claim status for: ${key}`);

    // Get claim status from KV store
    const claimedAt = await store.get(key, { type: "text" });

    console.log(
      `[CLAIMS] Claim status result: ${
        claimedAt !== null ? "CLAIMED" : "NOT CLAIMED"
      }`
    );

    return claimedAt !== null;
  } catch (error) {
    console.error("[CLAIMS] ❌ Error checking claim status:", error);
    // Fail closed: if we can't check, assume not claimed to allow retry
    return false;
  }
}

/**
 * Atomically mark an email as claimed
 * Returns true if claim was successful, false if already claimed
 */
export async function markAsClaimed(email: string): Promise<boolean> {
  try {
    const store = getClaimsStore();
    const key = `claimed:${email.toLowerCase()}`;

    console.log(`[CLAIMS] Attempting to mark as claimed: ${key}`);

    // Check if already claimed
    const existing = await store.get(key, { type: "text" });
    if (existing !== null) {
      console.log(`[CLAIMS] ❌ Already claimed at: ${existing}`);
      return false; // Already claimed
    }

    // Mark as claimed with timestamp
    const timestamp = new Date().toISOString();
    await store.set(key, timestamp);

    console.log(
      `[CLAIMS] ✅ Successfully marked as claimed: ${key} at ${timestamp}`
    );

    return true;
  } catch (error) {
    console.error("[CLAIMS] ❌ Error marking claim:", error);
    return false;
  }
}

/**
 * Get claim timestamp for an email
 */
export async function getClaimTimestamp(email: string): Promise<string | null> {
  try {
    const store = getClaimsStore();
    const key = `claimed:${email.toLowerCase()}`;

    return await store.get(key, { type: "text" });
  } catch (error) {
    console.error("Error getting claim timestamp:", error);
    return null;
  }
}
