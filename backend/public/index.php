<?php

declare(strict_types=1);

spl_autoload_register(static function (string $className): void {
    $path = __DIR__ . '/../' . str_replace('\\', '/', $className) . '.php';

    if (file_exists($path)) {
        require_once $path;
    }
});

use App\Core\Router;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $router = new Router();
    $router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $_SERVER['REQUEST_URI'] ?? '/');
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Server error.',
        'error' => $exception->getMessage(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}
