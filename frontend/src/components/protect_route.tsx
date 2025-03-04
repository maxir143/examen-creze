import type { JSX } from "react";
import { useAuth } from "../utils/useAuth";
import { navigate } from "astro:transitions/client";


export function ProtectedRoute({ children }: { children: JSX.Element }): JSX.Element | undefined {
  const { getToken, removeToken, verifyToken, refreshToken } = useAuth();

  const token_object = getToken();

  if (!token_object) {
    navigate("/login");
    return
  }

  if (token_object.active === false) {
    navigate("/otp");
    return
  }

  const { error } = verifyToken()

  if (error) {
    removeToken()
    alert(error);
    navigate("/login");
  }

  return children
}