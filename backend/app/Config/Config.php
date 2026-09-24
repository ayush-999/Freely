<?php

declare(strict_types=1);

namespace App\Config;

final class Config
{
    public const APP_NAME = 'Freely';

    private static array $env = [];

    public static function loadEnv(string $path = __DIR__ . '/../../.env'): void
    {
        if (self::$env !== []) {
            return;
        }

        if (!is_file($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        if ($lines === false) {
            return;
        }

        foreach ($lines as $line) {
            $trimmed = trim($line);

            if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                continue;
            }

            [$key, $value] = array_pad(explode('=', $trimmed, 2), 2, '');
            $key = trim($key);
            $value = trim($value);

            if ($key !== '') {
                self::$env[$key] = $value;
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
                putenv($key . '=' . $value);
            }
        }
    }

    public static function env(string $key, string $default = ''): string
    {
        self::loadEnv();

        return $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key) ?: $default;
    }

    public static function dbHost(): string
    {
        return self::env('DB_HOST', '127.0.0.1');
    }

    public static function dbPort(): string
    {
        return self::env('DB_PORT', '3306');
    }

    public static function dbName(): string
    {
        return self::env('DB_NAME', 'freely');
    }

    public static function dbUser(): string
    {
        return self::env('DB_USER', 'root');
    }

    public static function dbPassword(): string
    {
        return self::env('DB_PASSWORD', '');
    }

    public static function dbCharset(): string
    {
        return self::env('DB_CHARSET', 'utf8mb4');
    }

    public static function dbDsn(): string
    {
        return sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            self::dbHost(),
            self::dbPort(),
            self::dbName(),
            self::dbCharset()
        );
    }
}
