import { API_URL } from 'astro:env/client'
import { useState } from 'react'
import { useAuth } from '../utils/useAuth'
import { ToastContainer, toast } from 'react-toastify'

export function TransactionButton() {
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()

  async function makeTransaction() {
    setLoading(true)

    if (!token) {
      console.error('No token found')
      setLoading(false)
      return
    }

    const { error } = await fetch(`${API_URL}/v1/transaction/create`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-token': token },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text())
        }
        await res.json()
        return { error: null }
      })
      .catch((error) => {
        console.error(error)
        return { error: error.message }
      })

    if (!error) {
      toast.success('Transaction created', { autoClose: 100 })
    } else {
      toast.error(error)
    }

    setLoading(false)
  }

  return (
    <>
      <button className="btn" disabled={loading} onClick={makeTransaction}>
        Make a transaction
      </button>
      <ToastContainer />
    </>
  )
}
