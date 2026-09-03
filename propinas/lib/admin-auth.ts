export const ADMIN_PASSWORD = "1234";
export const ADMIN_SESSION_KEY = "propinas-admin-ok";

export function isAdminUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export function unlockAdmin(): void {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
}

export function lockAdmin(): void {
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
