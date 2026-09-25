<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Models\UserModel;

final class AuthController extends Controller
{
    private UserModel $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function login(): void
    {
        $payload = $this->readJsonBody();

        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $password = (string) ($payload['password'] ?? '');

        if ($email === '' || $password === '') {
            $this->json(['message' => 'Email and password are required.'], 400);
        }

        $user = $this->userModel->findByEmail($email);

        if (!$user || !password_verify($password, (string) $user['password'])) {
            $this->json(['message' => 'Invalid email or password.'], 401);
        }

        $token = bin2hex(random_bytes(24));

        $this->json([
            'message' => 'Signed in successfully.',
            'token' => $token,
            'user' => [
                'id' => (string) $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'] ?? 'user',
            ],
        ]);
    }

    public function register(): void
    {
        $payload = $this->readJsonBody();

        $name = trim((string) ($payload['name'] ?? ''));
        $email = strtolower(trim((string) ($payload['email'] ?? '')));
        $password = (string) ($payload['password'] ?? '');
        $role = strtolower(trim((string) ($payload['role'] ?? 'user')));

        if ($name === '' || $email === '' || $password === '') {
            $this->json(['message' => 'Name, email, and password are required.'], 400);
        }

        if (strlen($password) < 6) {
            $this->json(['message' => 'Password must be at least 6 characters long.'], 400);
        }

        if (!in_array($role, ['user', 'admin', 'moderator'], true)) {
            $this->json(['message' => 'Invalid role selected.'], 400);
        }

        if ($this->userModel->findByEmail($email)) {
            $this->json(['message' => 'This email is already registered.'], 409);
        }

        $user = $this->userModel->create($name, $email, $password, $role);

        $this->json([
            'message' => 'Account created successfully. You can now sign in.',
            'user' => [
                'id' => (string) $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'] ?? 'user',
            ],
        ]);
    }

    public function forgotPassword(): void
    {
        $payload = $this->readJsonBody();
        $email = strtolower(trim((string) ($payload['email'] ?? '')));

        if ($email === '') {
            $this->json(['message' => 'Email is required.'], 400);
        }

        $user = $this->userModel->findByEmail($email);

        if ($user) {
            // This is a demo flow. In a production app, a reset token would be created and emailed.
        }

        $this->json([
            'message' => 'If the email exists, reset instructions have been sent.',
        ]);
    }

    public function me(): void
    {
        $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        $token = preg_replace('/^Bearer\s+/i', '', $authorization);

        if ($token === '' || !is_string($token)) {
            $this->json(['message' => 'Unauthenticated.'], 401);
        }

        $this->json(['message' => 'No user context available for this session.'], 401);
    }

    public function notAllowed(): void
    {
        $this->json(['message' => 'Method not allowed.'], 405);
    }

    private function readJsonBody(): array
    {
        $json = file_get_contents('php://input');

        if ($json === false || $json === '') {
            return [];
        }

        $decoded = json_decode($json, true);

        return is_array($decoded) ? $decoded : [];
    }
}
