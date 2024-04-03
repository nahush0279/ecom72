
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUserData = createAsyncThunk('users/fetchUserData', async () => {
  try {
    const response = await fetch( process.env.REACT_APP_API_URL + 'info/all');
    const data = await response.json();
    return data;
  } catch (error) {
    throw Error('Error fetching user data');
  }
});

const initialState = {
  userData: null,
  status: 'idle', 
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectUserData = (state) => state.users.userData;
export const selectFetchStatus = (state) => state.users.status;
export const selectError = (state) => state.users.error;

export default usersSlice.reducer;
