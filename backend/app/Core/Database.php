<?php

declare(strict_types=1);

namespace App\Core;

use App\Config\Config;
use mysqli;
use PDO;
use RuntimeException;

final class Database
{
    private static ?PDO $pdoConnection = null;

    private static ?mysqli $mysqliConnection = null;

    public static function getConnection(): PDO
    {
        return self::getPdoConnection();
    }

    public static function getPdoConnection(): PDO
    {
        if (self::$pdoConnection instanceof PDO) {
            return self::$pdoConnection;
        }

        if (!extension_loaded('pdo_mysql')) {
            throw new RuntimeException('PDO MySQL extension is not available.');
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

        self::createSchema($pdo);
        self::$pdoConnection = $pdo;

        return self::$pdoConnection;
    }

    public static function getMysqliConnection(): mysqli
    {
        if (self::$mysqliConnection instanceof mysqli) {
            return self::$mysqliConnection;
        }

        if (!extension_loaded('mysqli')) {
            throw new RuntimeException('MySQLi extension is not available.');
        }

        $connection = @new mysqli(Config::dbHost(), Config::dbUser(), Config::dbPassword(), '', (int) Config::dbPort());

        if ($connection->connect_error) {
            throw new RuntimeException('MySQLi connection failed: ' . $connection->connect_error, (int) $connection->connect_errno);
        }

        $connection->query(
            'CREATE DATABASE IF NOT EXISTS `' . Config::dbName() . '` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
        );

        if ($connection->errno) {
            throw new RuntimeException('Failed to create MySQL database: ' . $connection->error, (int) $connection->errno);
        }

        $connection->select_db(Config::dbName());
        self::createSchema($connection);
        self::$mysqliConnection = $connection;

        return self::$mysqliConnection;
    }

    public static function getDriver(): string
    {
        return Config::dbDriver();
    }

    private static function createSchema(PDO|mysqli $connection): void
    {
        if ($connection instanceof PDO) {
            $connection->exec(
                'CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) NOT NULL DEFAULT "user",
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
            );

            return;
        }

        $connection->query(
            'CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT "user",
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci'
        );
    }

}
