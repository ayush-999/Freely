<?php

declare(strict_types=1);

namespace App\Core;

use App\Controllers\AuthController;

final class Router
{
    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH) ?? '/';
        $scriptName = $_SERVER['SCRIPT_NAME'] ?? $_SERVER['PHP_SELF'] ?? '';

        if ($scriptName !== '') {
            $scriptDir = rtrim(dirname($scriptName), '/');
            if ($scriptDir !== '.' && $scriptDir !== '' && str_starts_with($path, $scriptDir)) {
                $path = substr($path, strlen($scriptDir));
            }
        }

        $path = preg_replace('#/index\.php$#i', '', $path) ?? $path;
        $segments = array_values(array_filter(explode('/', $path), static fn(string $segment): bool => $segment !== ''));

        if (($segments[0] ?? '') === 'api') {
            array_shift($segments);
        }

        $action = $segments[0] ?? '';
        $controller = new AuthController();

        if ($action === 'me') {
            if ($method !== 'GET') {
                $controller->notAllowed();
            }

            $controller->me();
            return;
        }

        if ($method !== 'POST') {
            $controller->notAllowed();
        }

        switch ($action) {
            case 'login':
                $controller->login();
                break;
            case 'register':
                $controller->register();
                break;
            case 'forgot-password':
                $controller->forgotPassword();
                break;
            default:
                http_response_code(404);
                echo json_encode(['message' => 'Authentication endpoint not found.']);
                exit;
        }
    }
}
