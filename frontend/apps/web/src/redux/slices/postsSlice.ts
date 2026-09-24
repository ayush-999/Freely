import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { Post } from "@/types/post"
import type { LoadingState } from "@/types/common"

interface PostsState {
  items: Post[]
  status: LoadingState
  error: string | null
}

const initialState: PostsState = {
  items: [],
  status: "idle",
  error: null,
}

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.items = action.payload
      state.status = "succeeded"
      state.error = null
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.items.unshift(action.payload)
    },
    setPostsLoading: (state) => {
      state.status = "loading"
    },
    setPostsError: (state, action: PayloadAction<string>) => {
      state.status = "failed"
      state.error = action.payload
    },
  },
})

export const { setPosts, addPost, setPostsLoading, setPostsError } =
  postsSlice.actions
export default postsSlice.reducer
