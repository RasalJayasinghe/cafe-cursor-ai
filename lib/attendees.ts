/**
 * Attendee Data Service
 *
 * Loads static attendee list from JSON file (generated from Luma CSV)
 * This file is read-only at runtime and used only for validation
 */

import attendeesData from "@/data/static/attendees.json";

export interface Attendee {
  email: string;
  token: string;
  name: string;
}

// In-memory cache of attendees (loaded once at startup)
const attendees: Attendee[] = attendeesData as Attendee[];

/**
 * Find attendee by email
 */
export function findAttendeeByEmail(email: string): Attendee | null {
  const normalized = email.toLowerCase().trim();
  return attendees.find((a) => a.email.toLowerCase() === normalized) || null;
}

/**
 * Find attendee by token
 */
export function findAttendeeByToken(token: string): Attendee | null {
  const normalized = token.toUpperCase().trim();
  return attendees.find((a) => a.token.toUpperCase() === normalized) || null;
}

/**
 * Find attendee by email OR token
 */
export function findAttendee(input: {
  email?: string;
  token?: string;
}): Attendee | null {
  if (input.email) {
    return findAttendeeByEmail(input.email);
  }
  if (input.token) {
    return findAttendeeByToken(input.token);
  }
  return null;
}

/**
 * Get total number of attendees
 */
export function getTotalAttendees(): number {
  return attendees.length;
}
