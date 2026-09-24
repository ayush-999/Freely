export type LoadingState = "idle" | "loading" | "succeeded" | "failed"

export interface PaginationParams {
  page?: number
  limit?: number
}
