/**
 * Backend connection settings.
 *
 * The phone and the machine running `uvicorn` must be on the same network, so
 * the host is the dev machine's LAN IP — not `localhost`, which on a physical
 * device resolves to the phone itself.
 *
 * Override without touching source by setting `EXPO_PUBLIC_BACKEND_URL`
 * (e.g. in `.env`); the literal below is the fallback for the study setup.
 */
export const BACKEND_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL ?? "http://172.20.10.2:8000";

export const DETECT_ENDPOINT = `${BACKEND_URL}/detect`;

/** Abort a detection request that hangs, so the capture loop keeps running. */
export const DETECT_TIMEOUT_MS = 5000;
