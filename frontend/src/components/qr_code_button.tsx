import { useState } from "react"
import { useAuth } from "../utils/useAuth"
import QRCode from "react-qr-code"

export function QRCodeButton() {
  const { getOTPQRCode } = useAuth()

  const [qr_uri, set_qr_uri] = useState<string | null>(null)

  async function getQRCode() {
    if (qr_uri) return
    const { error, otp_uri } = await getOTPQRCode()
    if (!otp_uri) {
      alert(error || "Error getting QR code, pls try again")
      return
    }
    set_qr_uri(otp_uri)
  }

  return <div className="flex flex-col gap-4">
    <button disabled={!!qr_uri} className="btn text-xs" onClick={getQRCode}> need a QR code ?</button>
    {qr_uri && <>
      <h1 className="text-center">Scan the QR to get yout OTP code</h1>
      <QRCode value={qr_uri} size={300} className="mx-auto" />

    </>}
  </div>
}