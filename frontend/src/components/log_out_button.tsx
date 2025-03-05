import { navigate } from 'astro:transitions/client'
import { useAuth } from '@/utils/useAuth.ts'
import { useState } from 'react'

export function LogOutButton() {
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth()
  return (
    <button
      disabled={loading}
      className="btn btn-secondary"
      onClick={async () => {
        setLoading(true)
        logout()
          .then(() => {
            navigate('/login')
          })
          .finally(() => setLoading(false))
      }}
    >
      Log out
    </button>
  )
}
