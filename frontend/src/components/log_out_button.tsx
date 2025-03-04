import { navigate } from "astro:transitions/client";
import { useAuth } from "../utils/useAuth";

export function LogOutButton() {
  const { removeToken } = useAuth();
  return <button className="btn text-xs mt-4 max-w-1/2 mx-auto w-full" onClick={() => {
    removeToken();
    navigate("/login");
  }}>Log out</button>
}