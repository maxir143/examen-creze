import { useState, useEffect, use } from "react";
import { API_URL } from "astro:env/client";
import { jwtDecode } from "jwt-decode";
import { useStore } from "./store";

type _Token = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  refresh_exp: number;
  active: boolean;
  id: string;
};

type BasicAuth = {
  email: string;
  password: string;
};

export function useAuth() {
  const { token, setToken, removeToken } = useStore();

  useEffect(() => {
    refreshToken().then(({ error, token }) => {
      if (token) {
        setToken(token);
      }
      if (error) {
        console.error(error);
      }
    });
  }, []);

  function getToken(): _Token | null {
    if (!token) return null;
    return jwtDecode(token) as _Token;
  }

  async function login({
    email,
    password,
  }: BasicAuth): Promise<
    { token: string; error: null } | { token: null; error: string }
  > {
    return await fetch(`${API_URL}/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const res_json: { token: string; message: string } = await res.json();

        if (!res_json.token) {
          throw new Error("Response do not contain token");
        }

        return { token: res_json.token, error: null };
      })
      .catch((error) => {
        console.error(error);
        return { token: null, error: error.message };
      });
  }

  async function signUp({
    email,
    password,
  }: BasicAuth): Promise<{ success: boolean; error: string | null }> {
    return await fetch(`${API_URL}/v1/user/sing-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        if (res.ok) {
          return { success: true, error: null };
        }
        throw new Error(await res.text());
      })
      .catch((error) => {
        console.error(error);
        return { success: false, error: error.message };
      });
  }

  async function verifyOTP(
    otp_code: string
  ): Promise<{ token: string; error: null } | { token: null; error: string }> {
    const { error, token } = verifyToken();
    if (error) return { token: null, error: error };
    if (!token) return { token: null, error: "No token found" };

    return await fetch(`${API_URL}/v1/token/activate/${otp_code}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        const res_json: { token: string; message: string } = await res.json();

        if (!res_json.token) {
          throw new Error("Response do not contain token");
        }

        return {
          token: res_json.token,
          error: null,
        };
      })
      .catch((error) => {
        console.error(error);
        return {
          token: null,
          error: error.message,
        };
      });
  }

  async function refreshToken(): Promise<
    { token: string; error: null } | { token: null; error: string }
  > {
    const { error, token } = verifyToken();
    if (error) return { token: null, error: error };
    if (!token) return { token: null, error: "No token found" };
    return await fetch(`${API_URL}/v1/token/refresh`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const res_json: { token: string; message: string } = await res.json();
        return { token: res_json.token, error: null };
      })
      .catch((error) => {
        console.error(error);
        return { token: null, error: error.message };
      });
  }

  async function getOTPQRCode(): Promise<
    { otp_uri: string; error: null } | { otp_uri: null; error: string }
  > {
    const { error, token } = verifyToken();
    if (error) return { otp_uri: null, error: error };
    if (!token) return { otp_uri: null, error: "No token found" };

    return await fetch(`${API_URL}/v1/otp/sync`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const res_json: { otp_uri: string; message: string } = await res.json();
        return { otp_uri: res_json.otp_uri, error: null };
      })
      .catch((error) => {
        console.error(error);
        return { otp_uri: null, error: error.message };
      });
  }

  async function logout() {
    const { error, token } = verifyToken();
    if (error) return { otp_uri: null, error: error };
    if (!token) return { otp_uri: null, error: "No token found" };

    await fetch(`${API_URL}/v1/user/log-out`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
    }).catch((error) => {
      console.error(error);
    });
    removeToken();
  }

  function verifyToken():
    | { token: string; error: null }
    | { token: null; error: string } {
    if (!token) return { token: null, error: "No token found" };
    const token_object = getToken();
    if (!token_object) return { token: null, error: "Cant get token object" };
    const expiration_date = new Date(token_object.exp * 1000);
    const now = new Date();
    if (expiration_date < now) {
      return { token: null, error: "Current token expired, please log in" };
    }
    return { token: token, error: null };
  }

  return {
    token,
    setToken,
    removeToken,
    signUp,
    login,
    getToken,
    verifyOTP,
    getOTPQRCode,
    verifyToken,
    refreshToken,
    logout,
  };
}
