<?php

namespace App\Modules\PMC\Account\Services;

use App\Common\Exceptions\BusinessException;
use App\Modules\Platform\Tenant\ExternalServices\PMC\TenantConfigExternalServiceInterface;
use App\Modules\PMC\Account\Repositories\AccountRepository;
use Symfony\Component\HttpFoundation\Response;

/**
 * Guard giới hạn số tài khoản theo gói dịch vụ — dùng chung cho mọi luồng
 * tạo tài khoản (AccountService::create, AuthService::register).
 */
class AccountLimitGuard
{
    public function __construct(
        protected AccountRepository $accountRepository,
        protected TenantConfigExternalServiceInterface $tenantConfigExternalService,
    ) {}

    public function ensureAccountLimitNotReached(): void
    {
        $limits = $this->tenantConfigExternalService->getLimitsForCurrentTenant();

        if ($limits === null) {
            return;
        }

        if ($this->accountRepository->countTotal() >= $limits->maxAccounts) {
            throw new BusinessException(
                message: "Đã đạt giới hạn {$limits->maxAccounts} tài khoản của gói dịch vụ. Vui lòng liên hệ quản trị nền tảng để nâng giới hạn.",
                errorCode: 'ACCOUNT_LIMIT_REACHED',
                httpStatusCode: Response::HTTP_UNPROCESSABLE_ENTITY,
            );
        }
    }
}
