<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\PartnerCommissionContract\Requests;

use App\Common\Requests\BaseFormRequest;

class SwitchContractRequest extends BaseFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [];
    }
}
