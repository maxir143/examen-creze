import type { JSX } from "react";
import { useAuth } from "../utils/useAuth";
import { navigate } from "astro:transitions/client";


export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { getToken, token } = useAuth();

  console.log("token", token);

  if (!token) {
    navigate("/login");
    return
  }

  const token_object = getToken(token);

  console.log(token_object.active);

  if (token_object.active === false) {
    navigate("/otp");
    return
  }

  return children
}