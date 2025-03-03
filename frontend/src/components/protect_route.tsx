import type { JSX } from "react";
import { useAuth } from "../utils/useAuth";
import { navigate } from "astro:transitions/client";


export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { getToken } = useAuth();

  const token = getToken();

  console.log(token);

  if (!token) {
    navigate("/login");
    return
  }

  if (!token.active) {
    navigate("/otp");
    return
  }

  return children
}