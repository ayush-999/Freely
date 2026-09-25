from __future__ import annotations

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import get_settings


class Base(DeclarativeBase):
    pass


settings = get_settings()
engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db() -> None:
    from .models import Issue, Post, User

    Base.metadata.create_all(bind=engine)

    with engine.begin() as connection:
        connection.execute(text("SELECT 1"))


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
