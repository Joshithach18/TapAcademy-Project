import { createSlice } from '@reduxjs/toolkit';

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    todayAttendance: null,
    history: [],
    loading: false,
    error: null
  },
  reducers: {
    setTodayAttendance: (state, action) => {
      state.todayAttendance = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setTodayAttendance, setHistory, setLoading, setError } = attendanceSlice.actions;
export default attendanceSlice.reducer;