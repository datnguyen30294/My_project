<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Exceptions;

use App\Common\Exceptions\BusinessException;
use App\Modules\Marketplace\PartnerCommissionContract\Enums\ContractStatus;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class InvalidContractTransitionException extends BusinessException
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function __construct(
        string $message = 'Trạng thái hợp đồng hiện tại không cho phép thực hiện hành động này.',
        array $context = [],
        ?Throwable $previous = null,
    ) {
        parent::__construct(
            message: $message,
            errorCode: 'INVALID_CONTRACT_TRANSITION',
            httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            context: $context,
            previous: $previous,
        );
    }

    public static function from(ContractStatus $current, ContractStatus $target): self
    {
        return new self(
            message: "Không thể chuyển hợp đồng từ trạng thái '{$current->label()}' sang '{$target->label()}'.",
            context: [
                'current_status' => $current->value,
                'target_status' => $target->value,
            ],
        );
    }

    public static function terminalLocked(ContractStatus $current): self
    {
        return new self(
            message: "Hợp đồng đã ở trạng thái cuối '{$current->label()}', không thể thay đổi.",
            context: ['current_status' => $current->value],
        );
    }
}
