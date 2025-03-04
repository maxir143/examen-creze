import { useAuth } from "../utils/useAuth";



export function TokenInfo() {
  const { getToken } = useAuth();
  const token_object = getToken();

  if (!token_object) {
    return <p className="text-2xl text-center">No token found</p>
  }

  const expires_at = new Date(token_object.exp * 1000)
  const created_at = new Date(token_object.iat * 1000)

  return (<>
    <ul className="text-center gap-2 flex flex-col ">
      <li >Welcome back! {token_object.email}</li>
      <li >This token was created {created_at.toLocaleDateString()} at {created_at.toLocaleTimeString()}</li>
      <li >This token expires  {expires_at.toLocaleDateString()} at {expires_at.toLocaleTimeString()}</li>
    </ul>
    <button className="btn w-1/4 mx-auto"
      onClick={() => location.reload()}
    >
      Reload window
    </button>
  </>)
}