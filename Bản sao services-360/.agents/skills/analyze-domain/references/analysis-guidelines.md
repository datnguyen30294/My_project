# Analysis Guidelines

Use these heuristics when the input is incomplete or comes mostly from mockups.

## Extraction Checklist

Always try to identify:

- Main entities and sub-entities
- Core fields and display labels
- Required vs optional inputs
- Enum-like fields and status flows
- Relationships between entities
- Search, filters, sort, pagination
- CRUD actions, approval flows, imports, exports, reports
- Permissions and actor-specific behavior

## Field Type Mapping

| UI Element | DB Type | Migration Hint |
|------------|---------|----------------|
| Text input | `string` | `$table->string('name', 255)` |
| Short code | `string` | `$table->string('code', 50)` |
| Email / Phone | `string` | `$table->string('email', 255)` |
| Textarea | `text` | `$table->text('description')` |
| Dropdown enum | `string` | `$table->string('status', 50)` |
| Number | `integer` | `$table->integer('quantity')` |
| Money | `decimal` | `$table->decimal('amount', 15, 2)` |
| Boolean | `boolean` | `$table->boolean('is_active')` |
| Date / DateTime | `date` / `timestamp` | `$table->date()` or `$table->timestamp()` |

## Constraint Detection

| UI Signal | Constraint Hint |
|-----------|-----------------|
| `*` or required marker | `required` |
| No required marker | `nullable` by default |
| Fixed dropdown values | enum or `in:` validation |
| Clearly unique business key | `unique:table,column` |

## Relationship Detection

| Pattern | Relationship Hint |
|---------|-------------------|
| Dropdown from another entity | `belongsTo` |
| Embedded list or sub-table in form | `hasMany` |
| Multi-select or tag picker | `belongsToMany` |
| Parent and child tree | self-referential `belongsTo` |

## Cross-Module Rules

If a field references data from another module:

- In BE spec, model it as an external reference plus `ExternalService` dependency.
- Do not propose cross-module repository calls.
- Do not propose foreign keys across top-level modules.
- In FE spec, describe it as a selectable field fed by another module's dataset.

## Output Quality Rules

- Keep BE and FE terminology aligned.
- Prefer explicit assumptions over hidden guesses.
- If the repo already has a similar module, mirror its naming and folder style.
- If the mockup contradicts existing docs or code, record the conflict instead of normalizing it away.
