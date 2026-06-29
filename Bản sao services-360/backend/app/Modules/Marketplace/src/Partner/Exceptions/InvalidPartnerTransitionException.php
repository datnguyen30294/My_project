<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\Partner\Exceptions;

use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\Partner\Enums\PartnerStatus;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class InvalidPartnerTransitionException extends BusinessException
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function __construct(
        string $message = 'Trạng thái vendor hiện tại không cho phép thực hiện hành động này.',
        array $context = [],
        ?Throwable $previous = null,
    ) {
        parent::__construct(
            message: $message,
            errorCode: 'INVALID_PARTNER_TRANSITION',
            httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            context: $context,
            previous: $previous,
        );
    }

    public static function from(PartnerStatus $current, PartnerStatus $target): self
    {
        return new self(
            message: "Không thể chuyển vendor từ trạng thái '{$current->label()}' sang '{$target->label()}'.",
            context: [
                'current_status' => $current->value,
                'target_status' => $target->value,
            ],
        );
    }
}
