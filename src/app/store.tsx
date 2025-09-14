import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./slice/slice"; // adjust the path if needed

export const store = configureStore({
  reducer: {
    todos: todoReducer, // we registered our slice here
  },
});

// ✅ Types for use throughout app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
