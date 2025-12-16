"use server";

/**
 * Server Actions for Meal Claim System
 *
 * These functions run only on the server and handle:
 * 1. Verification: Check if user exists and hasn't claimed
 * 2. Claiming: Atomically mark user as claimed in Netlify KV
 *
 * Why Server Actions:
 * - Type-safe (no REST API needed)
 * - Automatic serialization
 * - Built-in error handling
 * - Can't be called from browser directly
 */

import { findAttendee, findAttendeeByEmail } from "./attendees";
import {
  hasClaimedMeal,
  markAsClaimed,
  getClaimTimestamp,
} from "./claims-store";

console.log("[CLAIMS] Using Netlify Blobs storage");

export type VerifyResult =
  | { status: "invalid"; message: string }
  | { status: "already_claimed"; message: string; claimedAt: string }
  | {
      status: "valid";
      message: string;
      attendee: { name: string; email: string; token: string };
    };

export type ClaimResult =
  | { status: "invalid"; message: string }
  | { status: "already_claimed"; message: string }
  | { status: "success"; message: string; orderId: string }
  | { status: "error"; message: string };

/**
 * Verify if a user can claim their meal
 *
 * Steps:
 * 1. Check if user exists in static attendees list
 * 2. Check if user has already claimed (via Netlify KV)
 * 3. Return appropriate status
 */
export async function verifyClaim(input: {
  email?: string;
  token?: string;
}): Promise<VerifyResult> {
  try {
    // Input validation
    if (!input.email && !input.token) {
      return {
        status: "invalid",
        message: "Please provide either email or token",
      };
    }

    // Step 1: Check if attendee exists in static list
    const attendee = findAttendee(input);

    if (!attendee) {
      return {
        status: "invalid",
        message: "Email or token not found. Please check your registration.",
      };
    }

    // Step 2: Check if already claimed (from Netlify KV)
    const alreadyClaimed = await hasClaimedMeal(attendee.email);

    if (alreadyClaimed) {
      const claimedAt = await getClaimTimestamp(attendee.email);
      return {
        status: "already_claimed",
        message: "You have already claimed your meal.",
        claimedAt: claimedAt || new Date().toISOString(),
      };
    }

    // Step 3: Valid and unclaimed
    return {
      status: "valid",
      message: "Welcome! Please select your meal.",
      attendee: {
        name: attendee.name,
        email: attendee.email,
        token: attendee.token,
      },
    };
  } catch (error) {
    console.error("Error verifying claim:", error);
    return {
      status: "invalid",
      message: "An error occurred. Please try again.",
    };
  }
}

/**
 * Confirm and process meal claim
 *
 * Steps:
 * 1. Re-verify user exists
 * 2. Atomically mark as claimed in KV store
 * 3. Return success or failure
 *
 * Race condition handling:
 * - markAsClaimed() checks before setting
 * - If already claimed between verify and confirm, it fails gracefully
 */
export async function confirmClaim(input: {
  email: string;
  name: string;
  phone?: string;
  foodItem: string;
  drinkItem: string;
}): Promise<ClaimResult> {
  try {
    // Step 1: Verify attendee exists
    const attendee = findAttendeeByEmail(input.email);

    if (!attendee) {
      return {
        status: "invalid",
        message: "Invalid email address",
      };
    }

    // Step 2: Atomically mark as claimed
    const claimed = await markAsClaimed(attendee.email);

    if (!claimed) {
      return {
        status: "already_claimed",
        message: "This meal has already been claimed",
      };
    }

    // Step 3: Generate order ID
    const orderId = `ORDER-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Success!
    return {
      status: "success",
      message: "Meal claimed successfully!",
      orderId,
    };
  } catch (error) {
    console.error("Error confirming claim:", error);
    return {
      status: "error",
      message: "Failed to claim meal. Please try again.",
    };
  }
}

// Re-export for convenience
export { findAttendeeByEmail } from "./attendees";
