import { useState, useEffect, use } from "react";
import { API_URL } from "astro:env/client";
import { jwtDecode } from "jwt-decode";

type _Token = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  active: boolean;
};

type _BasicAuth = {
  email: string;
  password: string;
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  function getToken(): null | _Token {
    if (!token) return null;
    return jwtDecode(token) as _Token;
  }

  async function login({
    email,
    password,
  }: _BasicAuth): Promise<string | null> {
    return await fetch(`${API_URL}/login`, {
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

        return res_json.token;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }

  async function signUp({ email, password }: _BasicAuth): Promise<boolean> {
    return await fetch(`${API_URL}/sing-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        if (res.ok) {
          console.log(await res.json());
          return true;
        }
        throw new Error(await res.text());
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  function verifyToken() {}

  async function verifyOTP(otp_code: number): Promise<string | null> {
    if (!token) return null;
    return await fetch(`${API_URL}/sing-up/${otp_code}`, {
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

        return res_json.token;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }

  return { token, setToken, signUp, login, getToken, verifyOTP };
}
