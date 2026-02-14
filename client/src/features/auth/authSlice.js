import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../../api/axiosInstance';
import { API } from '../../config/api';

export const loginUser = createAsyncThunk(
  'auth/loginUser', // This is the action type prefix
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(API.AUTH.LOGIN, credentials, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      // The value returned here will become the `action.payload` for `loginUser.fulfilled`
      // console.log(res);

      return res.data.data;
    } catch (err) {
      // Axios errors often have a `response` object
      console.log(err);
      const errorMessage =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      // `rejectWithValue` lets you return a custom error payload
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserProfileData = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(API.AUTH.PROFILE);

      // console.log('profile response', res);
      return res.data.data;
    } catch (error) {
      const errorMessage =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        API.AUTH.REFRESH,
        {},
        { withCredentials: true }
      );
      // console.log(res.data.data);
      return res.data.data; // Return the user object if authenticated
    } catch (err) {
      if (err.response) {
        const statusCode = err.response.status;
        if (statusCode === 401) {
          // Expected: User not authenticated. No console output.
          return rejectWithValue(null);
        } else {
          // Unexpected server error (e.g., 500).
          return rejectWithValue(
            err.response.data?.message ||
            'An unexpected error occurred during authentication check.'
          );
        }
      } else if (err.request) {
        // Network error (no response from server).
        return rejectWithValue('Network error during authentication check.');
      } else {
        // Something else happened in setting up the request that triggered an Error
        return rejectWithValue(
          'Failed to set up authentication check request.'
        );
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // the backend handles session clearing (e.g., clearing httpOnly cookies)
      await axiosInstance.post(API.AUTH.LOGOUT, {}, { withCredentials: true });
      return null; // Successful API call
    } catch (err) {
      // Even if the logout API fails (e.g., network error, token already invalid),
      // I want to clear the local state to ensure the user is logged out visually.
      console.error('Logout API call failed, but clearing local state.', err);
      // We return null on failure so the .fulfilled/rejected still runs the local logout logic.
      return null;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    role: null,
    token: null,
    isLoading: false,
    isAuthChecking: true,
    error: null,
    isAuthenticated: false,
    isInitialized: false,
  },
  reducers: {
    // Synchronous reducers for simple state changes
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

    setAuthState: (state, action) => {
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
      // --- Handlers for loginUser thunk ---
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
        state.isAuthChecking = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.user = action.payload.user;
        state.role = action.payload.user?.role || action.payload.role;
        state.token = action.payload.accessToken || action.payload.token;
        state.isAuthenticated = true;
        state.isAuthChecking = false;
        state.isInitialized = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        // console.log('SLICE REJECTED FIRED:', action);
        state.isLoading = false;
        state.user = null;
        state.role = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        // console.error('Login rejected with payload:', action.payload);

        state.isAuthChecking = false;
        state.isInitialized = true;
      })

      // handlers for the CheckAuthStatus thunk
      .addCase(checkAuthStatus.pending, state => {
        state.isAuthChecking = true;
        state.isInitialized = false;
      })

      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        // console.log('action', action);
        state.isAuthChecking = false;
        state.isInitialized = true;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.role = action.payload.user.role || null;
        state.error = null;
      })

      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isAuthChecking = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        state.token = null;
        state.error = action.payload;
      })

      // --- Handlers for logoutUser thunk ---
      .addCase(logoutUser.fulfilled, state => {
        // Clear state upon successful logout API call
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
        // Clearing the state even if the API call fails, just to ensure local integrity
        state.user = null;
        state.role = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.isAuthChecking = false;
      })

      // --- Handlers for getUserProfileData thunk ---

      .addCase(getUserProfileData.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfileData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || action.payload;
        state.role = action.payload.role || action.payload.user?.role || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUserProfileData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export the synchronous actions generated by createSlice
export const { logout, clearAuthError, setAuthState, setAuthInitialized } =
  authSlice.actions;

// Export the reducer function itself
export default authSlice.reducer;
