import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { Issue } from "@/types/issue"
import type { LoadingState } from "@/types/common"

interface IssuesState {
  items: Issue[]
  status: LoadingState
  error: string | null
}

const initialState: IssuesState = {
  items: [],
  status: "idle",
  error: null,
}

const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    setIssues: (state, action: PayloadAction<Issue[]>) => {
      state.items = action.payload
      state.status = "succeeded"
      state.error = null
    },
    addIssue: (state, action: PayloadAction<Issue>) => {
      state.items.unshift(action.payload)
    },
    setIssuesLoading: (state) => {
      state.status = "loading"
    },
    setIssuesError: (state, action: PayloadAction<string>) => {
      state.status = "failed"
      state.error = action.payload
    },
  },
})

export const { setIssues, addIssue, setIssuesLoading, setIssuesError } =
  issuesSlice.actions
export default issuesSlice.reducer
