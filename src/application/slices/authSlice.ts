import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/domain/entities/User";
import { AuthCredentials, SignUpData } from "@/domain/repositories/AuthRepository";
import { signInService, signUpService, signOutService, getCurrentUserService } from "../services/AuthService";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk<User, AuthCredentials, { rejectValue: string }>(
  "auth/signIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const session = await signInService(credentials);
      return session.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign in failed";
      return rejectWithValue(message);
    }
  }
);

export const signUp = createAsyncThunk<User, SignUpData, { rejectValue: string }>(
  "auth/signUp",
  async (data, { rejectWithValue }) => {
    try {
      const session = await signUpService(data);
      return session.user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign up failed";
      return rejectWithValue(message);
    }
  }
);

export const signOut = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await signOutService();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign out failed";
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk<User | null, void, { rejectValue: string }>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUserService();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get current user";
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    clearError(state) {
      state.error = null;
    },
    resetAuth() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // signIn
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Sign in failed";
      })
      // signUp
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Sign up failed";
      })
      // signOut
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Sign out failed";
      })
      // getCurrentUser
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = action.payload !== null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to get current user";
      });
  },
});

export const { setUser, clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
