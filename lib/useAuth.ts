"use client";

import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => void;
  signOut: () => Promise<void>;
}

let _setters: Array<(u: AuthUser | null, l: boolean) => void> = [];
let _cached: AuthUser | null | undefined = undefined;
let _fetching = false;

async function fetchUser() {
  if (_fetching) return;
  _fetching = true;
  try {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    _cached = data.user ?? null;
    _setters.forEach((fn) => fn(_cached!, false));
  } catch {
    _cached = null;
    _setters.forEach((fn) => fn(null, false));
  } finally {
    _fetching = false;
  }
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(_cached ?? null);
  const [loading, setLoading] = useState(_cached === undefined);

  useEffect(() => {
    const fn = (u: AuthUser | null, l: boolean) => {
      setUser(u);
      setLoading(l);
    };
    _setters.push(fn);

    if (_cached === undefined) {
      fetchUser();
    } else {
      setUser(_cached);
      setLoading(false);
    }

    return () => {
      _setters = _setters.filter((s) => s !== fn);
    };
  }, []);

  const refresh = useCallback(() => {
    _cached = undefined;
    fetchUser();
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    _cached = null;
    _setters.forEach((fn) => fn(null, false));
    setUser(null);
  }, []);

  return { user, loading, refresh, signOut };
}
