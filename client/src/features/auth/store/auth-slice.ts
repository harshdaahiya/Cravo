import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../lib/axios-instance';
import { API_ENDPOINTS } from '../../../constants/api-endpoints';
import { ApiResponse } from '../../../types/api-responses';
import { AuthState, AuthResponse } from '../types/auth-types';
import { IUser } from '../../../types/domain-models';

export const loginUser = createAsyncThunk<
  AuthResponse,
  any,
  { rejectValue: string }
>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return res.data.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const signupUser = createAsyncThunk<
  AuthResponse,
  any,
  { rejectValue: string }
>(
  'auth/signupUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.SIGNUP,
        userData,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      return res.data.data;
    } catch (err: any) {
      if (err.response?.status === 409) {
        return rejectWithValue('A user already exists with this e-mail.');
      }
      const errorMessage =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserProfileData = createAsyncThunk<
  { user: IUser },
  void,
  { rejectValue: string }
>(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get<ApiResponse<{ user: IUser }>>(
        API_ENDPOINTS.AUTH.PROFILE
      );
      return res.data.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkAuthStatus = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string | null }
>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.REFRESH,
        {},
        { withCredentials: true }
      );
      return res.data.data;
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 401) {
          return rejectWithValue(null);
        }
        return rejectWithValue(
          err.response.data?.message || 'An unexpected error occurred during authentication check.'
        );
      }
      return rejectWithValue('Network error during authentication check.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, {}, { withCredentials: true });
      return null;
    } catch (err) {
      return null;
    }
  }
);

const initialState: AuthState = {
  user: null,
  role: null,
  token: null,
  isLoading: false,
  isAuthChecking: true,
  error: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.isAuthenticated = false;
      state.isAuthChecking = false;
    },
    clearAuthError: state => {
      state.error = null;
    },
    setAuthState: (state, action: PayloadAction<{ user: IUser | null; role: any; token: string | null }>) => {
      const { user, role, token } = action.payload;
      state.user = user || null;
      state.role = role || null;
      state.token = token || null;
      state.isAuthenticated = !!user;
      state.isLoading = false;
      state.error = null;
      state.isAuthChecking = false;
      state.isInitialized = true;
    },
    setAuthInitialized: state => {
      state.isInitialized = true;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signupUser.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.isAuthChecking = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isAuthChecking = false;
        state.isInitialized = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.role = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.isAuthChecking = false;
        state.isInitialized = true;
      })
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.isAuthChecking = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.token = action.payload.accessToken;
        state.isAuthenticated = true;
        state.isAuthChecking = false;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.role = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.isAuthChecking = false;
        state.isInitialized = true;
      })
      .addCase(checkAuthStatus.pending, state => {
        state.isAuthChecking = true;
        state.isInitialized = false;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthChecking = false;
        state.isInitialized = true;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthChecking = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        state.token = null;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.role = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAuthChecking = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.pending, state => {
        state.isAuthChecking = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, state => {
        state.user = null;
        state.role = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.isAuthChecking = false;
      })
      .addCase(getUserProfileData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.role = action.payload.user?.role || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUserProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearAuthError, setAuthState, setAuthInitialized } = authSlice.actions;
export default authSlice.reducer;
