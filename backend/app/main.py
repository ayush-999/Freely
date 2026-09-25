from __future__ import annotations

import secrets
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from .config import get_settings
from .database import engine, get_db, init_db
from .models import Issue, Post, User
from .schemas import IssueCreate, IssuePublic, PostCreate, PostPublic, UserLogin, UserPublic, UserRegister

settings = get_settings()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
ACTIVE_TOKENS: dict[str, int] = {}
api_router = APIRouter(prefix=settings.API_PREFIX)

app = FastAPI(
    title=f"{settings.APP_NAME} API",
    version="1.0.0",
    description="FastAPI replacement for the legacy PHP backend used by the Freely frontend.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_db()


@app.get("/")
def read_root() -> dict[str, str]:
    return {"status": "ok", "app": settings.APP_NAME}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "database": settings.DB_NAME, "driver": engine.dialect.name}


def user_public_payload(user: User) -> UserPublic:
    return UserPublic(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
    )


def issue_public_payload(issue: Issue) -> IssuePublic:
    return IssuePublic(
        id=str(issue.id),
        title=issue.title,
        description=issue.description,
        status=issue.status,
        priority=issue.priority,
        createdAt=issue.created_at.isoformat(),
        updatedAt=issue.updated_at.isoformat(),
        reporterId=str(issue.reporter_id),
        assignedTo=str(issue.assigned_to) if issue.assigned_to else None,
    )


def post_public_payload(post: Post) -> PostPublic:
    return PostPublic(
        id=str(post.id),
        authorId=str(post.author_id),
        content=post.content,
        createdAt=post.created_at.isoformat(),
        visibility=post.visibility,
        likes=post.likes,
        comments=post.comments,
    )


def _require_auth(db: Session, authorization: str | None) -> User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"message": "Unauthenticated."})

    token = authorization.split(" ", 1)[1].strip()
    user_id = ACTIVE_TOKENS.get(token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"message": "Unauthenticated."})

    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"message": "Unauthenticated."})

    return user


@api_router.post("/login")
@app.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)) -> dict[str, Any]:
    email = payload.email.strip().lower()
    user = db.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if user is None or not pwd_context.verify(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={"message": "Invalid email or password."})

    token = secrets.token_urlsafe(32)
    ACTIVE_TOKENS[token] = user.id

    return {
        "message": "Signed in successfully.",
        "token": token,
        "user": user_public_payload(user).model_dump(),
    }


@api_router.post("/logout")
@app.post("/logout")
def logout(authorization: str | None = Header(default=None)) -> dict[str, str]:
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()
        if token:
            ACTIVE_TOKENS.pop(token, None)

    return {"message": "Signed out successfully."}


@api_router.post("/register", status_code=status.HTTP_201_CREATED)
@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)) -> dict[str, Any]:
    name = payload.name.strip()
    email = payload.email.strip().lower()
    password = payload.password.strip()

    if not name or not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"message": "Name, email, and password are required."})

    if len(password) < 6:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"message": "Password must be at least 6 characters long."})

    if payload.role not in {"user", "admin", "moderator"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={"message": "Invalid role selected."})

    if db.execute(select(User).where(User.email == email)).scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail={"message": "This email is already registered."})

    user = User(
        name=name,
        email=email,
        password_hash=pwd_context.hash(password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Account created successfully. You can now sign in.",
        "user": user_public_payload(user).model_dump(),
    }


@api_router.post("/forgot-password")
@app.post("/forgot-password")
def forgot_password(payload: UserLogin, db: Session = Depends(get_db)) -> dict[str, str]:
    email = payload.email.strip().lower()
    db.execute(select(User).where(User.email == email)).scalar_one_or_none()
    return {"message": "If the email exists, reset instructions have been sent."}


@api_router.get("/me")
@app.get("/me")
def me(db: Session = Depends(get_db), authorization: str | None = Header(default=None)) -> dict[str, Any]:
    user = _require_auth(db, authorization)
    return {"message": "Authenticated.", "user": user_public_payload(user).model_dump()}


@api_router.get("/issues")
@app.get("/issues")
def list_issues(db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    issues = db.execute(select(Issue).order_by(Issue.created_at.desc())).scalars().all()
    return [issue_public_payload(issue).model_dump() for issue in issues]


@api_router.post("/issues")
@app.post("/issues")
def create_issue(
    payload: IssueCreate,
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    current_user = _require_auth(db, authorization)
    issue = Issue(
        title=payload.title.strip(),
        description=payload.description.strip(),
        status=payload.status,
        priority=payload.priority,
        reporter_id=current_user.id,
        assigned_to=payload.assigned_to,
    )
    db.add(issue)
    db.commit()
    db.refresh(issue)

    return {
        "message": "Issue created successfully.",
        "issue": issue_public_payload(issue).model_dump(),
    }


@api_router.get("/posts")
@app.get("/posts")
def list_posts(db: Session = Depends(get_db)) -> list[dict[str, Any]]:
    posts = db.execute(select(Post).order_by(Post.created_at.desc())).scalars().all()
    return [post_public_payload(post).model_dump() for post in posts]


@api_router.post("/posts")
@app.post("/posts")
def create_post(
    payload: PostCreate,
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    current_user = _require_auth(db, authorization)
    post = Post(
        author_id=current_user.id,
        content=payload.content.strip(),
        visibility=payload.visibility,
        likes=0,
        comments=0,
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "message": "Post created successfully.",
        "post": post_public_payload(post).model_dump(),
    }


app.include_router(api_router)
