
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: JSON.parse(window.localStorage.getItem("AUTH")),
  role : (window.localStorage.getItem("ROLE")),
  table : 'admin'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.role=action.payload.role
      window.localStorage.setItem('AUTH', action.payload.isAuthenticated)
      window.localStorage.setItem('ROLE', action.payload.role)

    },
    setTable : (state, action) => {
      state.table = action.payload
    }
  },
});

export const { setAuthenticated, setTable } = authSlice.actions;

export default authSlice.reducer;
