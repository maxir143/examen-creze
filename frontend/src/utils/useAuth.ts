import { useState, useEffect, use } from "react";
import { API_URL } from "astro:env/client";
import { jwtDecode } from "jwt-decode";
import { useStore } from "./store";

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
  const { token, setToken, removeToken } = useStore();

  function getToken(token: string): _Token {
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
        console.error(error);
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
          return true;
        }
        throw new Error(await res.text());
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }

  function verifyToken() {}

  async function verifyOTP(otp_code: number): Promise<string | null> {
    if (!token) return null;
    return await fetch(`${API_URL}/activate-token/${otp_code}`, {
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
        console.error(error);
        return null;
      });
  }

  return { token, setToken, removeToken, signUp, login, getToken, verifyOTP };
}
