import { COMPLIANCE_MOCK_DATA } from "../constants/ComplianceMockData";
/**
 * Returns random mock detection data
 * Simulates async face detection delay
 */
export async function getMockFaceDetectionData(delay = 500) {
  await new Promise((resolve) => setTimeout(resolve, delay));

  const randomIndex = Math.floor(Math.random() * COMPLIANCE_MOCK_DATA.length);

  return COMPLIANCE_MOCK_DATA[randomIndex];
}
/**
 * Returns specific mock case by id
 * Useful for testing specific scenarios
 */
export async function getMockFaceDetectionById(id, delay = 300) {
  await new Promise((resolve) => setTimeout(resolve, delay));

  return COMPLIANCE_MOCK_DATA.find((item) => item.id === id);
}
/**
 * Simulates real-time detection stream
 * Calls callback repeatedly with new mock data
 */
export function startMockDetectionStream(callback, interval = 1000) {
  const intervalId = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * COMPLIANCE_MOCK_DATA.length);

    callback(COMPLIANCE_MOCK_DATA[randomIndex]);
  }, interval);

  return () => clearInterval(intervalId); // stop function
}
