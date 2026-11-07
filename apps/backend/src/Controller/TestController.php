<?php
declare(strict_types=1);

namespace App\Controller;

use App\Controller\Input\PingInput;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

final class TestController extends AbstractController
{
    #[Route('/test', name: 'app.test', methods: [Request::METHOD_GET])]
    public function test(): JsonResponse
    {
        return $this->json(['message' => 'Hello world!']);
    }

    #[Route('/ping', name: 'app.ping', methods: [Request::METHOD_POST])]
    public function pong(#[MapRequestPayload] PingInput $input): JsonResponse
    {
        return $this->json(['pong' => $input->message]);
    }
}
