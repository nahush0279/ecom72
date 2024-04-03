import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: 
   JSON.parse(window.localStorage.getItem(('USER')))
   
  
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUser(state) {
      return state.users;
    },
    setUser: (state, action) => {
      state.users = { ...state.users, ...action.payload };
      window.localStorage.setItem('USER', JSON.stringify(state.users));
    },
    deleteUser: (state) => {
      state.users = null;
    },
  },
});

export const { getUser, setUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
