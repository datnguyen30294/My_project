<?php

namespace Tests\Feature\PMC;

use App\Modules\PMC\Commission\Contracts\CommissionConfigServiceInterface;
use App\Modules\PMC\Commission\Models\CommissionPartyRule;
use App\Modules\PMC\Commission\Models\ProjectCommissionConfig;
use App\Modules\PMC\Project\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Covers proportional rebalancing of commission party percentages when the
 * platform fee ("Platform" party) changes. Relative ratios between the parties
 * are preserved; the parties' total stretches to fill 100 − platform%.
 */
class CommissionRebalanceTest extends TestCase
{
    use RefreshDatabase;

    private function makeConfigWithParties(array $parties): int
    {
        $project = Project::factory()->create();
        $config = ProjectCommissionConfig::query()->create(['project_id' => $project->id]);

        foreach ($parties as $partyType => $percent) {
            CommissionPartyRule::query()->create([
                'config_id' => $config->id,
                'party_type' => $partyType,
                'value_type' => 'percent',
                'percent' => $percent,
                'value_fixed' => null,
            ]);
        }

        return $project->id;
    }

    #[Test]
    public function test_rebalances_three_parties_proportionally_when_platform_percent_rises(): void
    {
        // Platform 10% + (CTVH 20 + BQT 40 + BQL 30 = 90) = 100%.
        $projectId = $this->makeConfigWithParties([
            'operating_company' => 20,
            'board_of_directors' => 40,
            'management' => 30,
        ]);

        // Platform rises to 20% → parties must refit into the remaining 80%.
        $changed = app(CommissionConfigServiceInterface::class)
            ->rebalancePartyRulesToPlatformPercent($projectId, 20.0);

        $this->assertTrue($changed);

        $rules = CommissionPartyRule::query()->get()->keyBy('party_type');
        $this->assertEqualsWithDelta(17.78, (float) $rules['operating_company']->percent, 0.001);
        $this->assertEqualsWithDelta(35.55, (float) $rules['board_of_directors']->percent, 0.001);
        $this->assertEqualsWithDelta(26.67, (float) $rules['management']->percent, 0.001);

        // Parties total + platform = exactly 100%.
        $partiesTotal = (float) $rules->sum(fn ($r) => (float) $r->percent);
        $this->assertEqualsWithDelta(80.0, $partiesTotal, 0.001);
    }

    #[Test]
    public function test_rebalances_to_full_remaining_when_platform_drops_to_zero(): void
    {
        // Parties summing to 72 (as if platform was 28%).
        $projectId = $this->makeConfigWithParties([
            'operating_company' => 16,
            'board_of_directors' => 32,
            'management' => 24,
        ]);

        $changed = app(CommissionConfigServiceInterface::class)
            ->rebalancePartyRulesToPlatformPercent($projectId, 0.0);

        $this->assertTrue($changed);

        $rules = CommissionPartyRule::query()->get()->keyBy('party_type');
        $this->assertEqualsWithDelta(22.22, (float) $rules['operating_company']->percent, 0.001);
        $this->assertEqualsWithDelta(44.45, (float) $rules['board_of_directors']->percent, 0.001);
        $this->assertEqualsWithDelta(33.33, (float) $rules['management']->percent, 0.001);

        $partiesTotal = (float) $rules->sum(fn ($r) => (float) $r->percent);
        $this->assertEqualsWithDelta(100.0, $partiesTotal, 0.001);
    }

    #[Test]
    public function test_returns_false_when_project_has_no_commission_config(): void
    {
        $project = Project::factory()->create();

        $changed = app(CommissionConfigServiceInterface::class)
            ->rebalancePartyRulesToPlatformPercent($project->id, 20.0);

        $this->assertFalse($changed);
    }

    #[Test]
    public function test_returns_false_when_no_party_uses_percent(): void
    {
        $project = Project::factory()->create();
        $config = ProjectCommissionConfig::query()->create(['project_id' => $project->id]);

        CommissionPartyRule::query()->create([
            'config_id' => $config->id,
            'party_type' => 'operating_company',
            'value_type' => 'fixed',
            'percent' => null,
            'value_fixed' => 50000,
        ]);

        $changed = app(CommissionConfigServiceInterface::class)
            ->rebalancePartyRulesToPlatformPercent($project->id, 20.0);

        $this->assertFalse($changed);

        // Fixed amount untouched.
        $this->assertNull(CommissionPartyRule::query()->first()->percent);
    }
}
