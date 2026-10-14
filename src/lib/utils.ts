export type ClassValue = string | number | boolean | undefined | null;

/**
 * Standard utility function for merging class names (shadcn/ui style)
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}
