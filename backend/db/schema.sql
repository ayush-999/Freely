CREATE DATABASE IF NOT EXISTS freely
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE freely;

CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email),
    KEY ix_users_id (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posts (
    id INT NOT NULL AUTO_INCREMENT,
    author_id INT NOT NULL,
    content TEXT NOT NULL,
    visibility VARCHAR(30) NOT NULL DEFAULT 'public',
    likes INT NOT NULL DEFAULT 0,
    comments INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_posts_id (id),
    CONSTRAINT fk_posts_author FOREIGN KEY (author_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS issues (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open',
    priority VARCHAR(30) NOT NULL DEFAULT 'medium',
    reporter_id INT NOT NULL,
    assigned_to INT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_issues_id (id),
    KEY ix_issues_reporter_id (reporter_id),
    KEY ix_issues_assigned_to (assigned_to),
    CONSTRAINT fk_issues_reporter FOREIGN KEY (reporter_id) REFERENCES users (id),
    CONSTRAINT fk_issues_assignee FOREIGN KEY (assigned_to) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
