<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use mysqli;
use PDO;

final class UserModel
{
    public function findByEmail(string $email): ?array
    {
        $connection = Database::getConnection();

        if ($connection instanceof mysqli) {
            $normalizedEmail = strtolower(trim($email));
            $statement = $connection->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
            $statement->bind_param('s', $normalizedEmail);
            $statement->execute();
            $result = $statement->get_result();

            return $result->fetch_assoc() ?: null;
        }

        $statement = $connection->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $statement->execute([':email' => strtolower(trim($email))]);

        $user = $statement->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function create(string $name, string $email, string $password, string $role = 'user'): array
    {
        $connection = Database::getConnection();
        $normalizedRole = strtolower(trim($role));

        if (!in_array($normalizedRole, ['user', 'admin', 'moderator'], true)) {
            $normalizedRole = 'user';
        }

        if ($connection instanceof mysqli) {
            $statement = $connection->prepare(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
            );
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $email = strtolower(trim($email));
            $statement->bind_param('ssss', $name, $email, $hashedPassword, $normalizedRole);
            $statement->execute();

            return $this->findById((int) $connection->insert_id);
        }

        $statement = $connection->prepare(
            'INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)'
        );

        $statement->execute([
            ':name' => trim($name),
            ':email' => strtolower(trim($email)),
            ':password' => password_hash($password, PASSWORD_DEFAULT),
            ':role' => $normalizedRole,
        ]);

        $userId = (int) $connection->lastInsertId();

        return $this->findById($userId);
    }

    public function findById(int $userId): ?array
    {
        $connection = Database::getConnection();

        if ($connection instanceof mysqli) {
            $statement = $connection->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
            $statement->bind_param('i', $userId);
            $statement->execute();
            $result = $statement->get_result();

            return $result->fetch_assoc() ?: null;
        }

        $statement = $connection->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $statement->execute([':id' => $userId]);

        return $statement->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}
