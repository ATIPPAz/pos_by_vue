export function setTimeoutAsync(delay: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), delay)
  })
}
