<?php
declare(strict_types=1);

namespace App\EventListener;

use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(event: KernelEvents::REQUEST, priority: 64)] // firewall runs at 8
final class NuxtClientListener
{
    public function __construct(
        #[Autowire('%env(NUXT_CLIENT_USER)%')]
        private readonly string $user,
        #[Autowire('%env(NUXT_CLIENT_PASSWORD)%')]
        private readonly string $password,
    ) {
    }

    public function __invoke(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();

        $userOk = hash_equals($this->user, (string) $request->getUser());
        $passOk = hash_equals($this->password, (string) $request->getPassword());

        if ($userOk === false || $passOk === false) {
            $event->setResponse(new Response(
                'Unauthorized',
                Response::HTTP_UNAUTHORIZED,
                ['WWW-Authenticate' => 'Basic realm="api"'],
            ));
        }
    }
}
