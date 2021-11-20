export function confirmUHIPin(isCorrect) {
  window?.UHI?.onVerified(isCorrect);
}
