<?php

namespace Database\Factories\Platform;

use App\Modules\Platform\Tenant\Enums\ServicePlan;
use App\Modules\Platform\Tenant\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Organization>
 */
class OrganizationFactory extends Factory
{
    protected $model = Organization::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => $this->faker->unique()->slug(2),
            'name' => $this->faker->unique()->company(),
            'is_active' => true,
            'is_organization' => false,
            'service_plan' => ServicePlan::Business,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    public function organization(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_organization' => true,
        ]);
    }

    public function withBusinessProfile(): static
    {
        return $this->state(fn (array $attributes) => [
            'tax_code' => (string) $this->faker->numerify('##########'),
            'representative_name' => $this->faker->name(),
            'contact_email' => $this->faker->unique()->safeEmail(),
            'contact_phone' => $this->faker->numerify('09########'),
            'address' => $this->faker->address(),
            'notes' => $this->faker->sentence(),
        ]);
    }
}
