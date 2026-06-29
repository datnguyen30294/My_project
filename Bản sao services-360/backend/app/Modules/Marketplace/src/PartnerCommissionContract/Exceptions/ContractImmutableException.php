<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Exceptions;

use App\Common\Exceptions\BusinessException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class ContractImmutableException extends BusinessException
{
    /**
     * @param  array<string, mixed>  $context
     */
    public function __construct(
        string $message = 'Hợp đồng đã ký không cho phép sửa các điều khoản tài chính.',
        array $context = [],
        ?Throwable $previous = null,
    ) {
        parent::__construct(
            message: $message,
            errorCode: 'CONTRACT_IMMUTABLE',
            httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            context: $context,
            previous: $previous,
        );
    }
}
