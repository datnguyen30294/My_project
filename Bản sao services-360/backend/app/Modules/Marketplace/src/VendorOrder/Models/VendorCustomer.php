<?php

declare(strict_types=1);

namespace App\Modules\Marketplace\VendorOrder\Models;

use App\Modules\Marketplace\VendorOrder\Support\ResiMartConnection;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $code
 * @property string $full_name
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $avatar_url
 * @property string|null $resident_ref
 */
class VendorCustomer extends Model
{
    protected $connection = ResiMartConnection::TENANT_CONNECTION;

    protected $table = 'customers';

    protected $guarded = [];

    public function save(array $options = []): bool
    {
        throw new \RuntimeException('VendorCustomer is read-only.');
    }

    public function delete(): ?bool
    {
        throw new \RuntimeException('VendorCustomer is read-only.');
    }
}
