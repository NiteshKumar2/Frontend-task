import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface UsersState {
  data: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const res = await api.get("/users");
    return res.data;
  }
);

export const createUser = createAsyncThunk<User, Partial<User>>(
  "users/createUser",
  async (data) => {
    const res = await api.post("/users", data);
    return res.data;
  }
);

export const updateUser = createAsyncThunk<
  User,
  { id: string; data: Partial<User> }
>("users/updateUser", async ({ id, data }) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
});

export const deleteUser = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (id) => {
    await api.delete(`/users/${id}`);
    return id;
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch users";
      })

      // CREATE
      .addCase(createUser.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })

      // UPDATE
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (u) => u.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (u) => u.id !== action.payload
        );
      });
  },
});

export default usersSlice.reducer;
