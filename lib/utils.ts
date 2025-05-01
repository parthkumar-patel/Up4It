import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a human-readable string
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

/**
 * Formats a distance in meters to a human-readable string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m away`
  } else {
    const km = meters / 1000
    return `${km.toFixed(1)}km away`
  }
}

/**
 * Rounds a time to the nearest 5 minutes
 */
export function roundTimeToNearestFiveMinutes(date: Date): Date {
  const coeff = 1000 * 60 * 5
  const rounded = new Date(Math.round(date.getTime() / coeff) * coeff)
  return rounded
}
