<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class UserModel
{
    public function findByEmail(string $email): ?array
    {
        $connection = Database::getConnection();
        $statement = $connection->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $statement->execute([':email' => strtolower(trim($email))]);

        $user = $statement->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public function create(string $name, string $email, string $password): array
    {
        $connection = Database::getConnection();

        $statement = $connection->prepare(
            'INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)'
        );

        $statement->execute([
            ':name' => trim($name),
            ':email' => strtolower(trim($email)),
            ':password' => password_hash($password, PASSWORD_DEFAULT),
            ':role' => 'user',
        ]);

        $userId = (int) $connection->lastInsertId();

        return $this->findById($userId);
    }

    public function findById(int $userId): ?array
    {
        $connection = Database::getConnection();
        $statement = $connection->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $statement->execute([':id' => $userId]);

        return $statement->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}
