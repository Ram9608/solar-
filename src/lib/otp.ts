/**
 * Shared OTP helper used by login (OTP tab), registration and forgot-password.
 *
 * Storage: in-memory Map (survives hot reload in dev). For multi-instance
 * production deployments move this to the database or Redis.
 *
 * Delivery: NO SMS / email provider is integrated (per project requirements).
 * When OTP_DEMO_MODE="true" the generated OTP is returned to the client and
 * shown on screen, and the master code 123456 is accepted. Set
 * OTP_DEMO_MODE="false" in production once a delivery channel is added.
 */

type OtpEntry = { otp: string; expiresAt: number; purpose: string; attempts: number }

const g = globalThis as unknown as { __otpStore?: Map<string, OtpEntry> }
const store: Map<string, OtpEntry> = g.__otpStore ?? (g.__otpStore = new Map())

export const OTP_DEMO_MODE = process.env.OTP_DEMO_MODE !== "false"
const OTP_TTL_MS = 5 * 60 * 1000
const MAX_ATTEMPTS = 5

/** Normalise a mobile number or email into a store key. */
export function otpKey(target: string): string {
  const t = target.trim().toLowerCase()
  return t.includes("@") ? t : t.replace(/\D/g, "").slice(-10)
}

/** Create and store a new 6-digit OTP. Returns the code. */
export function issueOtp(target: string, purpose: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  store.set(otpKey(target), { otp, expiresAt: Date.now() + OTP_TTL_MS, purpose, attempts: 0 })
  if (OTP_DEMO_MODE) console.log(`[OTP:${purpose}] ${otpKey(target)} -> ${otp}`)
  return otp
}

/** Verify (and consume on success) an OTP. */
export function verifyOtp(target: string, otp: string | undefined | null): boolean {
  if (!otp) return false
  const code = otp.trim()
  const key = otpKey(target)

  if (OTP_DEMO_MODE && code === "123456") {
    store.delete(key)
    return true
  }

  const entry = store.get(key)
  if (!entry) return false
  if (Date.now() > entry.expiresAt || entry.attempts >= MAX_ATTEMPTS) {
    store.delete(key)
    return false
  }
  if (entry.otp !== code) {
    entry.attempts++
    return false
  }
  store.delete(key)
  return true
}
