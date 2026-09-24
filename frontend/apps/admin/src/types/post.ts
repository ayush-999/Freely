export type PostVisibility = "public" | "community" | "private"

export interface Post {
  id: string
  authorId: string
  content: string
  createdAt: string
  visibility: PostVisibility
  likes: number
  comments: number
}
