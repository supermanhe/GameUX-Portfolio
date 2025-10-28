export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    if (ms <= 0) {
      resolve()
      return
    }
    setTimeout(resolve, ms)
  })
}

export async function withMinimumDelay<T>(promise: Promise<T>, minimum = 200) {
  const [result] = await Promise.all([promise, sleep(minimum)])
  return result
}
