export type IssueStatus = "open" | "in_progress" | "resolved" | "closed"
export type IssuePriority = "low" | "medium" | "high" | "critical"

export interface Issue {
  id: string
  title: string
  description: string
  status: IssueStatus
  priority: IssuePriority
  createdAt: string
  updatedAt: string
  reporterId: string
  assignedTo?: string | null
}
