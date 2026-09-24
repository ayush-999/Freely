import { configureStore } from "@reduxjs/toolkit"

import authReducer from "@/redux/slices/authSlice"
import issuesReducer from "@/redux/slices/issuesSlice"
import postsReducer from "@/redux/slices/postsSlice"
import uiReducer from "@/redux/slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issuesReducer,
    posts: postsReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
