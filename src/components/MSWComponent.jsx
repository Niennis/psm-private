'use client'

import { useEffect, useState } from 'react'

export function MSWComponent({ children }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    const initMsw = async () => {
      if (process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
        const { worker } = await import('../mocks/browser')
        await worker.start({
          onUnhandledRequest: 'bypass',
        })
        setMswReady(true)
      } else {
        setMswReady(true)
      }
    }

    if (!mswReady) {
      initMsw()
    }
  }, [mswReady])

  if (!mswReady && process.env.NEXT_PUBLIC_USE_MOCKS === 'true') {
    return null
  }

  return <>{children}</>
}
