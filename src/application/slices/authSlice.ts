import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/domain/entities/User";
import { AppError } from "@/domain/errors/AppError";
import { AuthCredentials, SignUpData } from "@/domain/repositories/AuthRepository";
import { signInService, signUpService, signOutService, getCurrentUserService } from "../services/AuthService";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AppError | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

function mapAuthError(error: unknown): AppError {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("invalid") || msg.includes("credentials") || msg.includes("password")) {
      return { code: "UNAUTHORIZED", message: "Invalid email or password." };
    }
    if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
      return { code: "FORBIDDEN", message: "An account with this email already exists." };
    }
    if (msg.includes("network") || msg.includes("fetch") || msg.includes("connect")) {
      return { code: "NETWORK_ERROR", message: "Unable to connect. Check your connection." };
    }
  }
  return { code: "UNKNOWN", message: "Authentication failed. Please try again." };
}

export const signIn = createAsyncThunk<User, AuthCredentials, { rejectValue: AppError }>(
  "auth/signIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const session = await signInService(credentials);
      return session.user;
    } catch (error) {
      return rejectWithValue(mapAuthError(error));
    }
  }
);

export const signUp = createAsyncThunk<User, SignUpData, { rejectValue: AppError }>(
  "auth/signUp",
  async (data, { rejectWithValue }) => {
    try {
      const session = await signUpService(data);
      return session.user;
    } catch (error) {
      return rejectWithValue(mapAuthError(error));
    }
  }
);

export const signOut = createAsyncThunk<void, void, { rejectValue: AppError }>(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await signOutService();
    } catch {
      return rejectWithValue({ code: "UNKNOWN", message: "Sign out failed. Please try again." });
    }
  }
);

// getCurrentUser is a silent bootstrap check — failure means no session, not an error
export const getCurrentUser = createAsyncThunk<User | null, void, { rejectValue: AppError }>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await getCurrentUserService();
    } catch {
      return rejectWithValue({ code: "UNAUTHORIZED", message: "No active session." });
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
        state.error = action.payload ?? { code: "UNKNOWN", message: "Authentication failed. Please try again." };
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
        state.error = action.payload ?? { code: "UNKNOWN", message: "Authentication failed. Please try again." };
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
      .addCase(signOut.rejected, (state) => {
        state.loading = false;
        // error surfaced as toast in useAuth, not stored in state
      })
      // getCurrentUser — silent: no session is normal, not an error
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = action.payload !== null;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        // intentionally no error stored — unauthenticated is the default state
      });
  },
});

export const { setUser, clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
