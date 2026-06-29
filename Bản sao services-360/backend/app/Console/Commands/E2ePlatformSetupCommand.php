<?php

namespace App\Console\Commands;

use App\Modules\Platform\Auth\Models\RequesterAccount;
use Illuminate\Console\Command;

class E2ePlatformSetupCommand extends Command
{
    protected $signature = 'e2e:platform-setup {--fresh : Pre-clean throwaway tenant+vendor first}';

    protected $description = 'Seed platform admin + (optionally) pre-clean throwaway E2E tenant/vendor';

    public function handle(): int
    {
        if (! in_array(app()->environment(), ['local', 'testing'], true)) {
            $this->error('Only runnable in local/testing.');

            return self::FAILURE;
        }

        if ($this->option('fresh')) {
            $this->call('e2e:platform-teardown');
        }

        RequesterAccount::firstOrCreate(
            ['email' => 'e2e-platform@test.com'],
            ['name' => 'E2E Platform Admin', 'password' => 'password', 'is_active' => true],
        );

        $this->info('E2E platform admin ready: e2e-platform@test.com / password');

        return self::SUCCESS;
    }
}
