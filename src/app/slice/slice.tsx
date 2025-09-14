import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: boolean;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: false,
};

export const todoSlice = createSlice({
  name: "todolist",
  initialState,
  reducers: {
    setError(state, action: PayloadAction<boolean>) {
      state.error = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.todos.push(action.payload);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },

    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
  },
});

export const {
  setError,
  setLoading,
  addTodo,

  setTodos,
} = todoSlice.actions;

export default todoSlice.reducer;
