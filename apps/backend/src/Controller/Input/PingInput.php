<?php
declare(strict_types=1);

namespace App\Controller\Input;

use Symfony\Component\Validator\Constraints as Assert;

final class PingInput
{
    #[Assert\NotBlank]
    public string $message;
}
