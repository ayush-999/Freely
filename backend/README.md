# Freely FastAPI Backend

This backend replaces the legacy PHP service with a FastAPI application that connects to MySQL.

## Environment

Start MySQL from the XAMPP Control Panel, then update `.env` if your local MySQL settings differ. The defaults use XAMPP's usual `localhost:3306` connection and `root` user with no password:

```env
DB_DRIVER=mysql
DB_SERVER=localhost
DB_PORT=3306
DB_NAME=freely
DB_USERNAME=root
DB_PASSWORD=
```

The app creates missing tables on startup, but the `freely` database must exist first. You can create it in phpMyAdmin or import `db/schema.sql`.

## Install dependencies

```bash
cd backend
py -m pip install -r requirements.txt
```

## Run

From the backend folder:

```bash
cd backend
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

If you are already inside the backend folder, just run:

```bash
py -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then open the API in your browser:

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

## Swagger / OpenAPI

FastAPI exposes the interactive API docs automatically:

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc
- OpenAPI JSON: http://127.0.0.1:8000/openapi.json

Use Swagger to test `login`, `register`, `issues`, and `posts` without needing Postman or curl.

The frontend dev server can proxy requests to this API at `http://127.0.0.1:8000`.

## Notes

- The app uses MySQL through the PyMySQL driver.
- The app creates missing tables automatically on startup; it does not alter existing tables.
- User passwords are hashed with PBKDF2.
- Session tokens are stored in memory for the current process and are sufficient for the current frontend flow.
