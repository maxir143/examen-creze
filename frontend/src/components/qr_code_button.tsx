import { useState } from 'react'
import { useAuth } from '@/utils/useAuth.ts'
import QRCode from 'react-qr-code'
import { ToastContainer, toast } from 'react-toastify'

export function QRCodeButton() {
  const { getOTPQRCode } = useAuth()
  const [qr_uri, set_qr_uri] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function getQRCode() {
    if (qr_uri) return
    setLoading(true)
    const { error, otp_uri } = await getOTPQRCode()
    if (!otp_uri) {
      toast.error(error || 'Error getting QR code, pls try again')
      return
    }
    set_qr_uri(otp_uri)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <button disabled={!!qr_uri || loading} className="btn text-xs" onClick={getQRCode}>

        need a QR code ?
      </button>
      {qr_uri && (
        <>
          <h1 className="text-center">Scan the QR to get yout OTP code</h1>
          <QRCode value={qr_uri} size={300} className="mx-auto" />
        </>
      )}
      <ToastContainer />
    </div>
  )
}
