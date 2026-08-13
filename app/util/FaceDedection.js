import { DETECT_ENDPOINT, DETECT_TIMEOUT_MS } from "../constants/Config";

/**
 * Send a captured frame to the backend for MediaPipe analysis.
 *
 * Returns the raw metrics object from `POST /detect`, or `null` when there is
 * nothing to analyse. Network and timeout failures are thrown so the calling
 * capture loop can decide whether to skip the frame or surface an error.
 *
 * @param {{ base64?: string }} photo Frame captured by expo-camera.
 * @returns {Promise<object|null>} Raw detection metrics, or null.
 */
export async function detectFace(photo) {
  if (!photo?.base64) return null;

  //Abort a stalled request so a slow frame cannot block the capture loop
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DETECT_TIMEOUT_MS);

  try {
    const response = await fetch(DETECT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: photo.base64 }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `Detection request failed: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}
