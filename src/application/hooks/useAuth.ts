"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { signIn as signInThunk, signUp as signUpThunk, signOut as signOutThunk, 
  getCurrentUser as getCurrentUserThunk,
  clearError,
} from "../slices/authSlice";
import { AuthCredentials, SignUpData } from "@/domain/repositories/AuthRepository";

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const signIn = useCallback(
    async (credentials: AuthCredentials) => {
      const result = await dispatch(signInThunk(credentials));
      if (signInThunk.rejected.match(result)) {
        throw new Error(result.payload ?? "Sign in failed");
      }
      return result.payload;
    },
    [dispatch]
  );

  const signUp = useCallback(
    async (data: SignUpData) => {
      const result = await dispatch(signUpThunk(data));
      if (signUpThunk.rejected.match(result)) {
        throw new Error(result.payload ?? "Sign up failed");
      }
      return result.payload;
    },
    [dispatch]
  );

  const signOut = useCallback(async () => {
    const result = await dispatch(signOutThunk());
    if (signOutThunk.rejected.match(result)) {
      throw new Error(result.payload ?? "Sign out failed");
    }
  }, [dispatch]);

  const refreshSession = useCallback(async () => {
    const result = await dispatch(getCurrentUserThunk());
    if (getCurrentUserThunk.rejected.match(result)) {
      throw new Error(result.payload ?? "Failed to refresh session");
    }
    return result.payload;
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshSession,
    clearError: clearAuthError,
  };
}
