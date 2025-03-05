import { API_URL } from 'astro:env/client'
import { useEffect, useState } from 'react'

export function DotStatus({ delay = 1000 }: { delay?: number }) {
  const [status, setStatus] = useState<boolean>(false)

  async function refresh(): Promise<void> {
    return await fetch(`${API_URL}/status`, {
      method: 'GET',
    })
      .then((res) => {
        setStatus(res.ok)
      })
      .catch(() => {
        setStatus(false)
      })
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      refresh()
    }, delay)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="inline-grid *:[grid-area:1/1]">
      <span
        className={`status animate-ping  ${status ? 'status-success' : 'status-error'}`}
      />
      <span
        className={`status   ${status ? 'status-success' : 'status-error'}`}
      />
    </div>
  )
}
