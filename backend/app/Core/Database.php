<?php

declare(strict_types=1);

namespace App\Core;

use App\Config\Config;
use PDO;

final class Database
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $dsn = Config::dbDsn();
        $user = Config::dbUser();
        $password = Config::dbPassword();

        $temporaryConnection = new PDO(
            sprintf('mysql:host=%s;port=%s;charset=%s', Config::dbHost(), Config::dbPort(), Config::dbCharset()),
            $user,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );

        $temporaryConnection->exec(
            'CREATE DATABASE IF NOT EXISTS `' . Config::dbName() . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
        );

        $pdo = new PDO(
            $dsn,
            $user,
            $password,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]
        );

        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT "user",
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_admin_user (user_id),
                CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci'
        );

        $pdo->exec(
            'CREATE TABLE IF NOT EXISTS moderators (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_moderator_user (user_id),
                CONSTRAINT fk_moderator_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci'
        );
        self::seedDefaultUser($pdo);
        self::$connection = $pdo;

        return self::$connection;
    }

    private static function seedDefaultUser(PDO $connection): void
    {
        $statement = $connection->prepare('SELECT id FROM users WHERE email = :email LIMIT 1');
        $statement->execute([':email' => 'admin@freely.test']);

        if ($statement->fetch()) {
            return;
        }

        $hashedPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $connection->prepare(
            'INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)'
        )->execute([
                    ':name' => 'Freely Admin',
                    ':email' => 'admin@freely.test',
                    ':password' => $hashedPassword,
                    ':role' => 'admin',
                ]);
    }
}
