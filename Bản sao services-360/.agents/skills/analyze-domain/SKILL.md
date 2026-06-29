---
name: analyze-domain
description: Analyze a new business domain, feature, or entity from mockups, screenshots, or textual requirements and produce separate Vietnamese BE and FE specs under docs/ba/modules before implementation. Use when the user asks to analyze, spec out, or document a module or feature.
---

# Analyze Domain

Use this skill to convert raw business requirements into implementation-ready BA documents for this repo.

## When To Use

- User provides UI mockups, screenshots, wireframes, or business descriptions.
- User asks to "phân tích", "analyze", "spec", or write BA docs before coding.
- User wants a new module, feature, report, or entity broken down into BE and FE requirements.

## Expected Output

Create or update two Vietnamese files:

- `docs/ba/modules/{module-name}/{feature-name}-be.md`
- `docs/ba/modules/{module-name}/{feature-name}-fe.md`

Rules:

- BE doc is technical: entities, migration shape, enums, requests, endpoints, validation, business rules, presenter output, external dependencies.
- FE doc is nghiệp vụ-oriented: pages, displayed fields, filters, user flows, permissions, business notes.
- Keep file names kebab-cased and stable. Update existing docs instead of creating duplicates when a spec already exists.

## Workflow

1. Gather context from the user input.
   - Extract entities, fields, types, constraints, enums, relationships, filters, sorting, pagination, actions, imports/exports, reports, and user flows.
   - If the user provides images, inspect them directly and list assumptions explicitly when labels or behaviors are ambiguous.
2. Inspect the repo before inventing structure.
   - Check existing modules, routes, and BA docs with fast file searches under `backend/app/Modules`, `frontend/app/pages`, and `docs/ba/modules`.
   - Reuse existing naming, module boundaries, and terminology when there is a clear precedent.
3. Detect cross-module dependencies.
   - If the feature references data owned by another module, document it as an `ExternalService` dependency in the BE spec.
   - Do not model cross-module references as repository access or foreign keys.
4. Resolve uncertainty pragmatically.
   - Ask concise clarifying questions only for blockers.
   - Otherwise proceed with explicit assumptions and label them in the spec.
5. Write the two specs.
   - Use `references/output-templates.md` for the section structure.
   - Use `references/analysis-guidelines.md` for field mapping and relationship heuristics.
   - Keep both documents in Vietnamese.
6. Validate the result.
   - BE and FE docs must agree on names, enums, permissions, actions, and flows.
   - Call out any mismatch between mockups, existing code, and current docs before finalizing.

## Project-Specific Rules

- Prefer the existing module hierarchy in the repo over creating a brand-new top-level module name unless the requirements clearly demand it.
- FE specs should not prescribe composables, components, or implementation patterns; keep them focused on business behavior and UI expectations.
- BE specs should mention enum presenter format as `{ value, label }` when relevant.
- If the input is incomplete, include a short `Giả định` or `Ghi chú` section instead of silently guessing.

## References

- `references/output-templates.md`: BE and FE document skeletons.
- `references/analysis-guidelines.md`: field-type, constraint, relationship, and cross-module heuristics.
