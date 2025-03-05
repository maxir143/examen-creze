import { useAuth } from '../utils/useAuth'

export function TokenInfo() {
  const { getToken } = useAuth()
  const token_object = getToken()

  if (!token_object) {
    return <p className="text-2xl text-center">No token found</p>
  }

  const expires_at = new Date(token_object.exp * 1000)
  const created_at = new Date(token_object.iat * 1000)
  const active_until = new Date(token_object.active_exp * 1000)

  return (
    <>
      <h2 className="text-center">
        Welcome back! <b>{token_object.email}</b>
      </h2>
      <ul className="flex flex-col list-disc gap-4">
        <li>
          Token id: <small className="ms-2">{token_object.id}</small>
        </li>

        <li>
          Token created at:
          <small className="ms-2">{created_at.toLocaleString()}</small>
        </li>

        <li>
          Token expires at:
          <small className="ms-2">{expires_at.toLocaleString()}</small>
        </li>

        <li>
          Token active until:
          <small className="ms-2">{active_until.toLocaleString()}</small>
        </li>
      </ul>
      <button className="btn" onClick={() => location.reload()}>
        Refresh token
      </button>
    </>
  )
}
