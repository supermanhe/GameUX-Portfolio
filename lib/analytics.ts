export type TrackEvent = {
  name: string
  payload?: Record<string, unknown>
}

export function useTrackEvent() {
  return (evt: TrackEvent) => {
    if (typeof window !== 'undefined') {
      ;(window as any).dataLayer = (window as any).dataLayer || []
      ;(window as any).dataLayer.push({
        event: evt.name,
        ...evt.payload,
        ts: Date.now(),
      })
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.debug('[track]', evt)
      }
    }
  }
}

