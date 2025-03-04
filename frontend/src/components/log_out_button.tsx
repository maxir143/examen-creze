import { navigate } from "astro:transitions/client";
import { useAuth } from "../utils/useAuth";
import { useState } from "react";

export function LogOutButton() {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  return <button disabled={loading} className="btn text-xs mt-4 max-w-1/2 mx-auto w-full" onClick={async () => {
    setLoading(true)
    logout().then(() => { navigate("/login") }).finally(() => setLoading(false))
  }}>Log out</button>
}