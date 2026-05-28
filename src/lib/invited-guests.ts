export type InvitedGuestMatch = {
  id: string;
  display_name: string;
  group_name: string | null;
  allowed_companions: number;
};

export const INVITED_GUEST_STORAGE_KEY = "validated_invited_guest";

export function normalizeGuestName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function clampAllowedCompanions(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, Math.trunc(value)));
}

export function readStoredInvitedGuest() {
  try {
    const raw = sessionStorage.getItem(INVITED_GUEST_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<InvitedGuestMatch>;

    if (!parsed.id || !parsed.display_name || typeof parsed.allowed_companions !== "number") {
      return null;
    }

    return {
      id: parsed.id,
      display_name: parsed.display_name,
      group_name: parsed.group_name ?? null,
      allowed_companions: clampAllowedCompanions(parsed.allowed_companions),
    } satisfies InvitedGuestMatch;
  } catch {
    return null;
  }
}

export function storeInvitedGuest(guest: InvitedGuestMatch) {
  sessionStorage.setItem(INVITED_GUEST_STORAGE_KEY, JSON.stringify(guest));
}
