import { createSlice } from '@reduxjs/toolkit';

const authorsSlice = createSlice({
  name: 'authors',
  initialState: {
    currentAuthor: null,
  },
  reducers: {
    setCurrentAuthor: (state, action) => {
      state.currentAuthor = action.payload;
    },
  },
});

export const { setCurrentAuthor } = authorsSlice.actions;

export const selectCurrentAuthor = (state) => state['authors'].currentAuthor;

export default authorsSlice.reducer;
