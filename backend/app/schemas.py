from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRegister(UserLogin):
    name: str
    role: Literal["user", "admin", "moderator"] = "user"


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    role: str


class IssueCreate(BaseModel):
    title: str
    description: str
    status: Literal["open", "in_progress", "resolved", "closed"] = "open"
    priority: Literal["low", "medium", "high", "critical"] = "medium"
    assigned_to: int | None = None


class IssuePublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    description: str
    status: str
    priority: str
    createdAt: str
    updatedAt: str
    reporterId: str
    assignedTo: str | None = None


class PostCreate(BaseModel):
    content: str
    visibility: Literal["public", "community", "private"] = "public"


class PostPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    authorId: str
    content: str
    createdAt: str
    visibility: str
    likes: int
    comments: int
